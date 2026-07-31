/**
 * Tarım ve Orman Bakanlığı kamuoyu duyuru listelerini (data/*.xlsx) tarayıcıda
 * aranabilir tek bir JSON'a dönüştürür.
 *
 * Kullanım: npm run data:build
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as XLSX from 'xlsx'

const ROOT = process.cwd()
const DATA_DIR = join(ROOT, 'data')
const OUT_DIR = join(ROOT, 'public', 'data')
const OUT_FILE = join(OUT_DIR, 'gida-listesi.json')

/** Dosya adı -> kullanıcıya gösterilecek liste adı ve risk ağırlığı. */
const SOURCES = [
  {
    file: 'sağlığı_tehlikeye_düşürecek_gıdalar.xlsx',
    category: 'Sağlığı Tehlikeye Düşüren',
    severity: 3,
  },
  {
    file: 'taklitvetağşiş_aynıdeğeri_taşımayan_maddeeklenmesi.xlsx',
    category: 'Aynı Değeri Taşımayan Madde Eklenmesi',
    severity: 2,
  },
  {
    file: 'Taklit veya Tağşiş Yapılan Gıdalar (Temel Özelliği Etkileyen İçerik Eksikliği).xlsx',
    category: 'Temel Özelliği Etkileyen İçerik Eksikliği',
    severity: 2,
  },
]

/** "11/12/2025" -> "2025-12-11". Ayrıştırılamayan değerler boş döner. */
function toIsoDate(value) {
  const match = String(value).trim().match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
  if (!match) return ''
  const [, day, month, year] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/** "MARKA /ÜRÜN ADI" alanını ilk bölü işaretinden ikiye ayırır. */
function splitBrandProduct(value) {
  const raw = String(value).trim()
  const index = raw.indexOf('/')
  if (index === -1) return { brand: '', product: raw }
  return {
    brand: raw.slice(0, index).trim(),
    product: raw.slice(index + 1).trim(),
  }
}

/** Tekrar eden metinleri sözlüğe alıp indeks döndürür; JSON boyutunu küçültür. */
function createInterner() {
  const values = []
  const index = new Map()
  return {
    values,
    intern(value) {
      const key = String(value).trim()
      if (index.has(key)) return index.get(key)
      const id = values.length
      values.push(key)
      index.set(key, id)
      return id
    },
  }
}

const uygunsuzluk = createInterner()
const urunGrubu = createInterner()
const konum = createInterner()
const kategori = createInterner()

const rows = []
const sourceMeta = []
/** Tarih biçimini doğrulamak için: gün alanında 12'den büyük değer var mı? */
let sawDayAboveTwelve = false
let sawMonthAboveTwelve = false

for (const source of SOURCES) {
  const path = join(DATA_DIR, source.file)
  if (!existsSync(path)) {
    console.warn(`! Atlandı (dosya yok): ${source.file}`)
    continue
  }

  const workbook = XLSX.read(readFileSync(path))
  const sheet = workbook.Sheets['Veri']
  if (!sheet) throw new Error(`"Veri" sayfası bulunamadı: ${source.file}`)

  const records = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  const categoryId = kategori.intern(source.category)
  let added = 0

  for (const record of records) {
    const rawName = record['Marka / Ürün Adı']
    const firma = String(record['Firma Adı'] ?? '').trim()
    if (!rawName && !firma) continue

    const { brand, product } = splitBrandProduct(rawName)
    const rawDate = String(record['Kamuoyu Duyuru Tarihi'] ?? '').trim()
    const parts = rawDate.match(/^(\d{1,2})[./](\d{1,2})[./]\d{4}$/)
    if (parts) {
      if (Number(parts[1]) > 12) sawDayAboveTwelve = true
      if (Number(parts[2]) > 12) sawMonthAboveTwelve = true
    }

    rows.push([
      brand,
      product,
      firma,
      uygunsuzluk.intern(record['Uygunsuzluk'] ?? ''),
      urunGrubu.intern(record['Ürün Grubu'] ?? ''),
      konum.intern(record['İl / İlçe'] ?? ''),
      categoryId,
      toIsoDate(rawDate),
      String(record['Parti / Seri Numarası'] ?? '').trim(),
    ])
    added++
  }

  // "Kaynak" sayfasındaki üstveriyi (kaynak URL, çekilme zamanı) taşı.
  const metaSheet = workbook.Sheets['Kaynak']
  const meta = {}
  if (metaSheet) {
    for (const row of XLSX.utils.sheet_to_json(metaSheet, { defval: '' })) {
      if (row['Alan']) meta[String(row['Alan'])] = String(row['Değer'])
    }
  }

  sourceMeta.push({
    category: source.category,
    severity: source.severity,
    count: added,
    sourceUrl: meta['Kaynak URL'] ?? '',
    fetchedAt: meta['Çekilme zamanı (UTC)'] ?? '',
  })

  console.log(`✓ ${source.category}: ${added} kayıt`)
}

if (sawMonthAboveTwelve && !sawDayAboveTwelve) {
  console.warn('! Tarihler MM/DD/YYYY olabilir; toIsoDate gözden geçirilmeli.')
}

// En yeni duyurular önce.
rows.sort((a, b) => String(b[7]).localeCompare(String(a[7])))

const payload = {
  meta: {
    generatedAt: new Date().toISOString(),
    count: rows.length,
    fields: ['brand', 'product', 'company', 'issue', 'group', 'location', 'category', 'date', 'batch'],
    sources: sourceMeta,
  },
  dict: {
    issue: uygunsuzluk.values,
    group: urunGrubu.values,
    location: konum.values,
    category: kategori.values,
  },
  rows,
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT_FILE, JSON.stringify(payload))

const sizeKb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1)
console.log(`\n→ ${OUT_FILE}`)
console.log(`  ${rows.length} kayıt, ${sizeKb} KB`)
console.log(`  sözlük: ${uygunsuzluk.values.length} uygunsuzluk, ${urunGrubu.values.length} ürün grubu, ${konum.values.length} konum`)
