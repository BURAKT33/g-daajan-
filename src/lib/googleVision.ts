import { yieldToMain } from './asyncUtils'

const MAX_IMAGE_DIMENSION = 1200
const JPEG_QUALITY = 0.82

function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  )
}

async function convertHeicToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: JPEG_QUALITY,
  })
  return Array.isArray(converted) ? converted[0] : converted
}

async function compressImage(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob)
  let { width, height } = bitmap

  const largestSide = Math.max(width, height)
  if (largestSide > MAX_IMAGE_DIMENSION) {
    const scale = MAX_IMAGE_DIMENSION / largestSide
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Görsel işlenemedi.')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  const base64 = dataUrl.split(',')[1]
  if (!base64) throw new Error('Görsel JPEG formatına dönüştürülemedi.')

  return base64
}

async function prepareImageBase64(file: File): Promise<string> {
  let blob: Blob = file
  if (isHeicFile(file)) blob = await convertHeicToJpeg(file)

  try {
    return await compressImage(blob)
  } catch {
    throw new Error('Fotoğraf okunamadı. JPG/PNG formatında ve daha net bir görsel deneyin.')
  }
}

const GOOGLE_VISION_API_KEY = 'AIzaSyDxjuBhLuR_Hm4KsnXsMOTrhh6Tg9Yci74'

function getVisionApiKey(): string {
  return GOOGLE_VISION_API_KEY
}

export async function extractTextFromImage(file: File): Promise<string> {
  const apiKey = getVisionApiKey()
  if (!apiKey) {
    throw new Error('Vision API anahtarı yapılandırılmamış.')
  }

  const base64 = await prepareImageBase64(file)
  await yieldToMain()

  let response: Response
  try {
    response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          }],
        }),
      },
    )
  } catch {
    throw new Error('Vision API\'ye bağlanılamadı. İnternet bağlantınızı kontrol edin.')
  }

  let data: {
    error?: { message?: string }
    responses?: Array<{
      error?: { message?: string }
      fullTextAnnotation?: { text?: string }
      textAnnotations?: Array<{ description?: string }>
    }>
  }

  try {
    data = await response.json()
  } catch {
    throw new Error('Vision API yanıtı okunamadı.')
  }

  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Cloud Vision API isteği başarısız.')
  }

  const annotation = data.responses?.[0]
  if (annotation?.error) throw new Error(annotation.error.message)

  const text =
    annotation?.fullTextAnnotation?.text ??
    annotation?.textAnnotations?.[0]?.description ??
    ''

  if (!text.trim()) {
    throw new Error('Görselde okunabilir yazı bulunamadı. Etiketi daha net çekin.')
  }

  return text.trim()
}
