/**
 * Tarım ve Orman Bakanlığı kamuoyu duyuru listelerinde isim taraması.
 *
 * Veri, derleme öncesi `npm run data:build` ile public/data/gida-listesi.json
 * dosyasına yazılır ve tarayıcıda aranır; sunucu tarafı gerekmez.
 */

export type Kayit = {
  id: number
  marka: string
  urun: string
  firma: string
  uygunsuzluk: string
  urunGrubu: string
  konum: string
  kategori: string
  /** 3 = sağlığı tehlikeye düşüren, 2 = taklit/tağşiş */
  agirlik: number
  tarih: string
  parti: string
  /** Aramada karşılaştırılan, normalize edilmiş metin. */
  aranan: string
}

export type VeriSeti = {
  kayitlar: Kayit[]
  olusturmaTarihi: string
  kaynakUrl: string
  listeler: { kategori: string; adet: number }[]
}

type HamVeri = {
  meta: {
    generatedAt: string
    count: number
    sources: { category: string; severity: number; count: number; sourceUrl: string }[]
  }
  dict: { issue: string[]; group: string[]; location: string[]; category: string[] }
  rows: [string, string, string, number, number, number, number, string, string][]
}

/**
 * Türkçe metni arama için sadeleştirir: aksanları çözüp atar, küçük harfe
 * indirir, noktalama yerine boşluk koyar.
 *
 * NFD ayrıştırması ş/ğ/ü/ö/ç/â ve İ harflerini ASCII'ye indirir; noktasız "ı"
 * harfinin ayrışması olmadığı için ayrıca eşlenir.
 */
export function normalize(metin: string): string {
  return metin
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

let istek: Promise<VeriSeti> | null = null

/** Veri setini bir kez indirir ve sonraki çağrılarda aynı sonucu döndürür. */
export function veriSetiniYukle(): Promise<VeriSeti> {
  if (istek) return istek

  const url = `${import.meta.env.BASE_URL}data/gida-listesi.json`

  istek = fetch(url)
    .then(cevap => {
      if (!cevap.ok) throw new Error(`Veri indirilemedi (HTTP ${cevap.status})`)
      return cevap.json() as Promise<HamVeri>
    })
    .then(ham => {
      const agirliklar = new Map(ham.meta.sources.map(s => [s.category, s.severity]))

      const kayitlar = ham.rows.map((satir, i) => {
        const [marka, urun, firma, uIdx, gIdx, kIdx, katIdx, tarih, parti] = satir
        const kategori = ham.dict.category[katIdx] ?? ''
        return {
          id: i,
          marka,
          urun,
          firma,
          uygunsuzluk: ham.dict.issue[uIdx] ?? '',
          urunGrubu: ham.dict.group[gIdx] ?? '',
          konum: ham.dict.location[kIdx] ?? '',
          kategori,
          agirlik: agirliklar.get(kategori) ?? 2,
          tarih,
          parti,
          aranan: normalize(`${marka} ${urun} ${firma}`),
        }
      })

      return {
        kayitlar,
        olusturmaTarihi: ham.meta.generatedAt,
        kaynakUrl: ham.meta.sources[0]?.sourceUrl ?? '',
        listeler: ham.meta.sources.map(s => ({ kategori: s.category, adet: s.count })),
      }
    })
    .catch(hata => {
      // Sonraki denemenin yeniden istek atabilmesi için önbelleği temizle.
      istek = null
      throw hata
    })

  return istek
}

/**
 * Sorguyu kelimelere böler ve tüm kelimeleri içeren kayıtları puanlayarak
 * döndürür. Marka eşleşmeleri ürün ve firma eşleşmelerinden önce gelir.
 */
export function ara(kayitlar: Kayit[], sorgu: string, enFazla = 50): Kayit[] {
  const temiz = normalize(sorgu)
  if (temiz.length < 2) return []

  const kelimeler = temiz.split(' ').filter(Boolean)
  const bulunanlar: { kayit: Kayit; puan: number }[] = []

  for (const kayit of kayitlar) {
    if (!kelimeler.every(kelime => kayit.aranan.includes(kelime))) continue

    const marka = normalize(kayit.marka)
    const urun = normalize(kayit.urun)

    let puan = kayit.agirlik
    if (marka === temiz) puan += 100
    else if (marka.startsWith(temiz)) puan += 60
    else if (marka.includes(temiz)) puan += 40
    else if (urun.includes(temiz)) puan += 20
    else puan += 5

    bulunanlar.push({ kayit, puan })
  }

  bulunanlar.sort((a, b) => b.puan - a.puan || b.kayit.tarih.localeCompare(a.kayit.tarih))
  return bulunanlar.slice(0, enFazla).map(b => b.kayit)
}

/** "2025-12-11" -> "11.12.2025" */
export function tarihBicimle(iso: string): string {
  const [yil, ay, gun] = iso.split('-')
  return yil && ay && gun ? `${gun}.${ay}.${yil}` : iso
}
