import { normalize, type Kayit } from './gidaVerisi'

export type OcrEslesme = {
  kayit: Kayit
  puan: number
}

export type OcrSonuc = {
  markalar: string[]
  eslesmeler: OcrEslesme[]
  temiz: boolean
  ocrMetin: string
}

const OCR_STOP_WORDS = new Set([
  'sut', 'gida', 'urun', 'urunleri', 'urunler', 'marka', 'tic', 'san', 'ltd', 'sti',
  'anonim', 'sirketi', 've', 'icin', 'ile', 'gr', 'gram', 'ml', 'kg', 'adet',
  'tam', 'yagli', 'yag', 'taze', 'islem', 'gormus', 'isil', 'net', 'icerik',
  'miktari', 'skt', 'tet', 'tett', 'parti', 'seri', 'no', 'the', 'and',
])

type IndekslenenKayit = {
  kayit: Kayit
  markaNorm: string
  urunNorm: string
  birlesikNorm: string
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
    }
  }
  return matrix[b.length][a.length]
}

function benzerlikPuani(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 100
  if (a.includes(b) || b.includes(a)) return 85
  const distance = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length)
  return Math.max(0, Math.round((1 - distance / maxLen) * 100))
}

function indeksle(kayitlar: Kayit[]): IndekslenenKayit[] {
  return kayitlar.map(kayit => ({
    kayit,
    markaNorm: normalize(kayit.marka),
    urunNorm: normalize(kayit.urun),
    birlesikNorm: normalize(`${kayit.marka} ${kayit.urun} ${kayit.firma}`),
  }))
}

function hizliPuan(sorgu: string, indeks: IndekslenenKayit): number {
  const norm = normalize(sorgu)
  if (!norm || norm.length < 3) return 0

  const alanlar = [
    { deger: indeks.markaNorm, agirlik: 1.2 },
    { deger: indeks.urunNorm, agirlik: 1 },
    { deger: indeks.birlesikNorm, agirlik: 1.05 },
  ]

  let enIyi = 0
  for (const alan of alanlar) {
    if (!alan.deger) continue
    if (alan.deger === norm) enIyi = Math.max(enIyi, 100 * alan.agirlik)
    else if (alan.deger.startsWith(norm)) enIyi = Math.max(enIyi, 92 * alan.agirlik)
    else if (alan.deger.includes(norm)) enIyi = Math.max(enIyi, 78 * alan.agirlik)
    else enIyi = Math.max(enIyi, benzerlikPuani(norm, alan.deger) * alan.agirlik)
  }
  return Math.round(enIyi)
}

function faydaliKelime(kelime: string): boolean {
  return kelime.length >= 4 && !OCR_STOP_WORDS.has(kelime) && !/^\d+$/.test(kelime)
}

function markaAdaylariCikar(ocrMetin: string): string[] {
  const adaylar: string[] = []
  const gorulen = new Set<string>()

  const ekle = (deger: string) => {
    const temiz = deger.replace(/["']/g, ' ').replace(/\s+/g, ' ').trim()
    const anahtar = normalize(temiz)
    if (temiz.length < 3 || gorulen.has(anahtar)) return
    gorulen.add(anahtar)
    adaylar.push(temiz)
  }

  const satirlar = ocrMetin.split('\n').map(s => s.trim()).filter(Boolean)

  for (const satir of satirlar.slice(0, 5)) {
    if (satir.length <= 45 && !/^\d/.test(satir)) ekle(satir)
    for (const parca of satir.split('/').map(p => p.trim())) {
      if (parca.length >= 4 && parca.length <= 40) ekle(parca)
    }
  }

  const anlamliSatirlar = satirlar.filter(s => s.length >= 4 && s.length <= 24)
  if (anlamliSatirlar.length >= 2) ekle(anlamliSatirlar.slice(0, 2).join(' '))

  for (const kelime of normalize(ocrMetin).split(' ').filter(faydaliKelime)) {
    ekle(kelime)
  }

  return adaylar.slice(0, 8)
}

/** OCR metninden marka adaylarını çıkarıp bakanlık listesinde arar. */
export function ocrAra(ocrMetin: string, kayitlar: Kayit[], enFazla = 8): OcrSonuc {
  const indeks = indeksle(kayitlar)
  const adaylar = markaAdaylariCikar(ocrMetin)
  const markalar = adaylar.slice(0, 3)
  const birincilMarka = markalar[0] ?? ''
  const markaNorm = normalize(birincilMarka)

  if (markaNorm.length >= 4) {
    const havuz = indeks.filter(item =>
      item.markaNorm.includes(markaNorm) ||
      item.urunNorm.includes(markaNorm) ||
      item.birlesikNorm.includes(markaNorm),
    )

    if (havuz.length === 0) {
      return { markalar, eslesmeler: [], temiz: true, ocrMetin }
    }

    const enIyi = new Map<number, OcrEslesme>()
    for (const aday of adaylar) {
      for (const item of havuz) {
        const puan = hizliPuan(aday, item)
        if (puan < 60) continue
        const mevcut = enIyi.get(item.kayit.id)
        if (!mevcut || puan > mevcut.puan) {
          enIyi.set(item.kayit.id, { kayit: item.kayit, puan })
        }
      }
    }

    return {
      markalar,
      eslesmeler: [...enIyi.values()].sort((a, b) => b.puan - a.puan).slice(0, enFazla),
      temiz: false,
      ocrMetin,
    }
  }

  const enIyi = new Map<number, OcrEslesme>()
  for (const aday of adaylar) {
    if (normalize(aday).length < 4) continue
    for (const item of indeks) {
      const puan = hizliPuan(aday, item)
      if (puan < 70) continue
      const mevcut = enIyi.get(item.kayit.id)
      if (!mevcut || puan > mevcut.puan) {
        enIyi.set(item.kayit.id, { kayit: item.kayit, puan })
      }
    }
  }

  return {
    markalar,
    eslesmeler: [...enIyi.values()].sort((a, b) => b.puan - a.puan).slice(0, enFazla),
    temiz: false,
    ocrMetin,
  }
}
