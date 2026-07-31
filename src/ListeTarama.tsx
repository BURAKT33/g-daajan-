import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Search, LoaderCircle, CircleCheck, TriangleAlert, MapPin, Calendar,
  Building2, Tag, ExternalLink, X, Database, Camera, Type, Scan, ImageIcon,
} from 'lucide-react'
import { ara, tarihBicimle, veriSetiniYukle, type Kayit, type VeriSeti } from './lib/gidaVerisi'
import { extractTextFromImage } from './lib/googleVision'
import { ocrAra } from './lib/ocrArama'
import { yieldToMain } from './lib/asyncUtils'

const ORNEK_SORGULAR = ['bal', 'zeytinyağı', 'tereyağı', 'kekik', 'sucuk', 'takviye']

type Mod = 'yazi' | 'kamera'
type Adim = 'bekle' | 'isleniyor' | 'okunuyor' | 'araniyor'

function kategoriRengi(agirlik: number) {
  return agirlik >= 3
    ? { kutu: 'border-red-500/30 bg-red-500/10', yazi: 'text-red-300' }
    : { kutu: 'border-amber-500/30 bg-amber-500/10', yazi: 'text-amber-300' }
}

function SonucKarti({ kayit, puan }: { kayit: Kayit; puan?: number }) {
  const renk = kategoriRengi(kayit.agirlik)

  return (
    <li className="rounded-2xl border border-white/5 bg-[#111827] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {kayit.marka && (
            <p className="text-white font-bold text-base leading-tight break-words">{kayit.marka}</p>
          )}
          <p className="text-slate-300 text-sm mt-0.5 break-words">{kayit.urun}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${renk.kutu} ${renk.yazi}`}>
            {kayit.agirlik >= 3 ? 'Sağlığı Tehlikeye Düşüren' : 'Taklit / Tağşiş'}
          </span>
          {puan !== undefined && (
            <span className="text-[10px] text-slate-500 font-medium">%{puan} eşleşme</span>
          )}
        </div>
      </div>

      <div className={`rounded-xl border px-3 py-2 ${renk.kutu}`}>
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Uygunsuzluk</p>
        <p className={`text-sm font-medium mt-0.5 ${renk.yazi}`}>{kayit.uygunsuzluk}</p>
      </div>

      <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="flex items-start gap-2 min-w-0">
          <Building2 size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <dt className="text-slate-600">Firma</dt>
            <dd className="text-slate-300 break-words">{kayit.firma || '—'}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Tag size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-slate-600">Ürün grubu</dt>
            <dd className="text-slate-300">{kayit.urunGrubu || '—'}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-slate-600">İl / ilçe</dt>
            <dd className="text-slate-300">{kayit.konum || '—'}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-slate-600">Duyuru tarihi</dt>
            <dd className="text-slate-300">
              {tarihBicimle(kayit.tarih)}
              {kayit.parti && <span className="text-slate-600"> · Parti: {kayit.parti}</span>}
            </dd>
          </div>
        </div>
      </dl>
    </li>
  )
}

export default function ListeTarama() {
  const [mod, setMod] = useState<Mod>('yazi')
  const [sorgu, setSorgu] = useState('')
  const [geciken, setGeciken] = useState('')
  const [veri, setVeri] = useState<VeriSeti | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)

  const [onizleme, setOnizleme] = useState<string | null>(null)
  const [adim, setAdim] = useState<Adim>('bekle')
  const [ocrMetin, setOcrMetin] = useState('')
  const [tespitMarkalar, setTespitMarkalar] = useState<string[]>([])
  const [ocrSonuclar, setOcrSonuclar] = useState<{ kayit: Kayit; puan: number }[]>([])
  const [temizSonuc, setTemizSonuc] = useState(false)
  const [kameraArandi, setKameraArandi] = useState(false)

  const girdiRef = useRef<HTMLInputElement>(null)
  const dosyaRef = useRef<HTMLInputElement>(null)
  const secilenDosya = useRef<File | null>(null)

  const veriyiIste = useCallback(() => {
    if (veri || yukleniyor) return
    setYukleniyor(true)
    setHata(null)
    veriSetiniYukle()
      .then(setVeri)
      .catch(() => setHata('Liste indirilemedi. Bağlantınızı kontrol edip tekrar deneyin.'))
      .finally(() => setYukleniyor(false))
  }, [veri, yukleniyor])

  useEffect(() => {
    const zamanlayici = setTimeout(() => setGeciken(sorgu), 250)
    return () => clearTimeout(zamanlayici)
  }, [sorgu])

  useEffect(() => {
    return () => {
      if (onizleme) URL.revokeObjectURL(onizleme)
    }
  }, [onizleme])

  const yaziSonuclar = useMemo(
    () => (veri ? ara(veri.kayitlar, geciken) : []),
    [veri, geciken],
  )

  const aramaYapildi = mod === 'yazi' && geciken.trim().length >= 2 && Boolean(veri)
  const toplam = veri?.kayitlar.length ?? 2310

  const modDegistir = (yeniMod: Mod) => {
    setMod(yeniMod)
    setHata(null)
    setOcrMetin('')
    setTespitMarkalar([])
    setOcrSonuclar([])
    setTemizSonuc(false)
    setKameraArandi(false)
    setAdim('bekle')
  }

  const ornekSec = (kelime: string) => {
    veriyiIste()
    setSorgu(kelime)
    girdiRef.current?.focus()
  }

  const dosyaSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0]
    if (!dosya) return

    secilenDosya.current = dosya
    setHata(null)
    setOcrMetin('')
    setTespitMarkalar([])
    setOcrSonuclar([])
    setTemizSonuc(false)
    setKameraArandi(false)
    setAdim('bekle')

    if (onizleme) URL.revokeObjectURL(onizleme)
    setOnizleme(URL.createObjectURL(dosya))
  }

  const kameraAra = async () => {
    const dosya = secilenDosya.current
    if (!dosya) {
      setHata('Önce ürün etiketinin fotoğrafını seçin veya çekin.')
      return
    }

    setHata(null)
    setYukleniyor(true)
    setAdim('isleniyor')
    setKameraArandi(false)

    try {
      const veriSeti = veri ?? await veriSetiniYukle()
      if (!veri) setVeri(veriSeti)

      await yieldToMain()
      setAdim('okunuyor')
      const metin = await extractTextFromImage(dosya)

      await yieldToMain()
      setAdim('araniyor')
      const sonuc = ocrAra(metin, veriSeti.kayitlar)

      setOcrMetin(sonuc.ocrMetin)
      setTespitMarkalar(sonuc.markalar)
      setOcrSonuclar(sonuc.eslesmeler)
      setTemizSonuc(sonuc.temiz)
      setKameraArandi(true)
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Görsel analizi başarısız oldu.')
      setKameraArandi(true)
    } finally {
      setYukleniyor(false)
      setAdim('bekle')
    }
  }

  const adimMetni =
    adim === 'isleniyor' ? 'Görsel hazırlanıyor...'
      : adim === 'okunuyor' ? 'Etiket okunuyor...'
        : adim === 'araniyor' ? 'Bakanlık listelerinde aranıyor...'
          : ''

  return (
    <section id="tarama" className="py-28 px-6 bg-gradient-to-b from-[#0B0F19] via-[#0D1220] to-[#0B0F19]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium mb-5">
            <Database size={14} />
            Bakanlık Listelerinde Tarama
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ürünü sorgula, <span className="gradient-text">listede mi öğren.</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            Yazı ile arayın veya ürün etiketinin fotoğrafını çekin. Tarım ve Orman Bakanlığı&apos;nın
            taklit-tağşiş ve sağlığı tehlikeye düşüren gıdalar duyurularındaki {toplam.toLocaleString('tr-TR')} kayıt taranır.
          </p>
        </div>

        {/* Mod seçici */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => modDegistir('yazi')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              mod === 'yazi'
                ? 'bg-emerald-600 text-white border border-emerald-500/50 shadow-lg shadow-emerald-900/30'
                : 'bg-[#111827] text-slate-400 border border-white/10 hover:text-white hover:border-white/25'
            }`}
          >
            <Type size={16} />
            Yazı ile ara
          </button>
          <button
            type="button"
            onClick={() => modDegistir('kamera')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              mod === 'kamera'
                ? 'bg-orange-500 text-white border border-orange-400/50 shadow-lg shadow-orange-900/30'
                : 'bg-[#111827] text-slate-400 border border-white/10 hover:text-white hover:border-white/25'
            }`}
          >
            <Camera size={16} />
            Kamera ile ara
          </button>
        </div>

        {/* Yazı modu */}
        {mod === 'yazi' && (
          <>
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                ref={girdiRef}
                type="search"
                value={sorgu}
                onChange={e => { veriyiIste(); setSorgu(e.target.value) }}
                onFocus={veriyiIste}
                placeholder="Örn. bal, zeytinyağı, tereyağı..."
                aria-label="Ürün, marka veya firma adı"
                className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-white text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              {sorgu && (
                <button
                  onClick={() => { setSorgu(''); girdiRef.current?.focus() }}
                  aria-label="Aramayı temizle"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-slate-600 font-medium">Denemek için:</span>
              {ORNEK_SORGULAR.map(kelime => (
                <button
                  key={kelime}
                  onClick={() => ornekSec(kelime)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/25 transition-colors"
                >
                  {kelime}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Kamera modu */}
        {mod === 'kamera' && (
          <div className="gradient-border rounded-2xl border border-white/5 bg-[#111827] p-6 flex flex-col gap-5">
            <input
              ref={dosyaRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={dosyaSec}
            />

            {onizleme ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-64">
                <img src={onizleme} alt="Seçilen ürün etiketi" className="w-full h-full object-contain bg-black/40 max-h-64" />
                <button
                  onClick={() => {
                    secilenDosya.current = null
                    if (onizleme) URL.revokeObjectURL(onizleme)
                    setOnizleme(null)
                    setOcrMetin('')
                    setTespitMarkalar([])
                    setOcrSonuclar([])
                    setTemizSonuc(false)
                    setKameraArandi(false)
                    if (dosyaRef.current) dosyaRef.current.value = ''
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Fotoğrafı kaldır"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => dosyaRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 rounded-xl p-10 text-center transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <ImageIcon size={24} className="text-orange-400" />
                </div>
                <p className="text-white font-semibold text-sm">Fotoğraf çek veya yükle</p>
                <p className="text-slate-500 text-xs mt-1">Ürün etiketini net gösterin — JPG, PNG, HEIC</p>
              </button>
            )}

            <button
              type="button"
              onClick={kameraAra}
              disabled={!onizleme || yukleniyor}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {yukleniyor ? <LoaderCircle size={16} className="animate-spin" /> : <Scan size={16} />}
                {yukleniyor ? adimMetni || 'Analiz ediliyor...' : 'Oku ve Bakanlık Listesinde Ara'}
              </span>
            </button>
          </div>
        )}

        {/* Sonuçlar */}
        <div className="mt-8" aria-live="polite">
          {hata && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300 text-sm">
              {hata}
            </div>
          )}

          {/* Yazı modu sonuçları */}
          {mod === 'yazi' && !hata && yukleniyor && (
            <div className="flex items-center justify-center gap-3 py-10 text-slate-500 text-sm">
              <LoaderCircle size={18} className="animate-spin" />
              Bakanlık listeleri yükleniyor...
            </div>
          )}

          {mod === 'yazi' && !hata && !yukleniyor && sorgu.trim().length > 0 && sorgu.trim().length < 2 && (
            <p className="text-center text-slate-600 text-sm py-8">Aramak için en az 2 karakter girin.</p>
          )}

          {mod === 'yazi' && !hata && aramaYapildi && yaziSonuclar.length === 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <CircleCheck size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-300 font-bold text-lg">Listelerde bulunamadı</p>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                &ldquo;{geciken}&rdquo; için Bakanlığın taklit-tağşiş ve sağlığı tehlikeye düşüren
                gıdalar duyurularında kayıt yok.
              </p>
            </div>
          )}

          {mod === 'yazi' && !hata && aramaYapildi && yaziSonuclar.length > 0 && (
            <>
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-center gap-3 mb-5">
                <TriangleAlert size={22} className="text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-bold">
                    {yaziSonuclar.length}{yaziSonuclar.length === 50 ? '+' : ''} kayıt bulundu
                  </p>
                  <p className="text-slate-400 text-sm">
                    &ldquo;{geciken}&rdquo; aramasıyla eşleşen duyurular aşağıda listeleniyor.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-4">
                {yaziSonuclar.map(kayit => <SonucKarti key={kayit.id} kayit={kayit} />)}
              </ul>
            </>
          )}

          {/* Kamera modu sonuçları */}
          {mod === 'kamera' && kameraArandi && !hata && (
            <>
              {ocrMetin && (
                <div className="rounded-2xl border border-white/5 bg-[#111827] p-4 mb-5">
                  <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Okunan etiket metni</p>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{ocrMetin}</p>
                  {tespitMarkalar.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs text-slate-600">Tespit edilen markalar:</span>
                      {tespitMarkalar.map(m => (
                        <span key={m} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {temizSonuc && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <CircleCheck size={32} className="text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-300 font-bold text-lg">Ürün güvenli görünüyor</p>
                  <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                    Tespit edilen marka Bakanlığın taklit-tağşiş listelerinde bulunamadı.
                  </p>
                </div>
              )}

              {!temizSonuc && ocrSonuclar.length > 0 && (
                <>
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-center gap-3 mb-5">
                    <TriangleAlert size={22} className="text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-300 font-bold">Riskli ürün tespit edildi!</p>
                      <p className="text-slate-400 text-sm">
                        Bu ürün bakanlık kayıtlarıyla eşleşiyor. Aşağıdaki duyuruları inceleyin.
                      </p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {ocrSonuclar.map(({ kayit, puan }) => (
                      <SonucKarti key={kayit.id} kayit={kayit} puan={puan} />
                    ))}
                  </ul>
                </>
              )}

              {!temizSonuc && ocrSonuclar.length === 0 && ocrMetin && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <CircleCheck size={32} className="text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-300 font-bold text-lg">Listelerde eşleşme bulunamadı</p>
                  <p className="text-slate-400 text-sm mt-2">Okunan etiket için bakanlık duyurularında kayıt yok.</p>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-slate-600 text-xs text-center mt-10 leading-relaxed">
          Kaynak: Tarım ve Orman Bakanlığı kamuoyu duyuruları
          {veri && ` · ${veri.kayitlar.length.toLocaleString('tr-TR')} kayıt`}
          {mod === 'kamera' && ' · Görsel okuma: Google Cloud Vision API'}
          {veri?.kaynakUrl && (
            <>
              {' · '}
              <a href={veri.kaynakUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors">
                resmi liste <ExternalLink size={10} />
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  )
}
