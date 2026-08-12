import { useEffect } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from './lib/theme'

const LOGO = '/logo.svg'

const SECTIONS = [
  {
    id: '1',
    title: 'Veri Sorumlusu',
    body: (
      <p>
        Gıda Ajanı mobil uygulaması üzerinden toplanan kişisel verileriniz, veri sorumlusu sıfatıyla
        Meres Tohum (Bundan sonra &quot;Gıda Ajanı&quot; olarak anılacaktır) tarafından, 6698 sayılı
        Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca aşağıda açıklanan kapsamda
        işlenebilecektir.
      </p>
    ),
  },
  {
    id: '2',
    title: 'İşlenen Kişisel Veriler ve İşleme Amaçları',
    body: (
      <div className="flex flex-col gap-6">
        <p>Uygulamamızı kullandığınızda aşağıdaki verileriniz, belirtilen amaçlarla işlenmektedir:</p>
        <div className="flex flex-col gap-4">
          {[
            {
              label: 'A. Kimlik ve İletişim Bilgileri',
              detail: 'Ad-Soyad, E-posta adresi.',
              purpose: 'Kullanıcı hesabı oluşturma, kimlik doğrulama ve kullanıcı desteği sağlama.',
            },
            {
              label: 'B. Kullanım ve Tercih Verileri',
              detail: 'Tarama geçmişi, favori ürünler, riskli olarak işaretlenen ürünler.',
              purpose: 'Hizmet sunumu, alışveriş rehberliği ve kişiselleştirilmiş kullanıcı deneyimi.',
            },
            {
              label: 'C. Görsel Veriler',
              detail: 'Uygulama kamerası aracılığıyla çekilen ürün etiket ve içerik fotoğrafları.',
              purpose:
                'Yapay zeka destekli analiz işleminin gerçekleştirilmesi ve taklit/tağşiş kontrolü. (Bu görseller analiz işlemi bittikten sonra sistemlerimizde kalıcı olarak saklanmaz.)',
            },
            {
              label: 'D. Cihaz Bilgileri',
              detail: 'IP adresi, cihaz modeli, işletim sistemi.',
              purpose: 'Uygulama güvenliği, hata ayıklama (debug) ve teknik optimizasyon.',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl glass-chip border border-subtle px-5 py-4">
              <p className="font-semibold text-heading text-sm">{item.label}</p>
              <p className="text-muted text-sm mt-1.5">{item.detail}</p>
              <p className="text-subtle text-sm mt-2">
                <span className="text-brand font-medium">Amaç:</span> {item.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: '3',
    title: 'Kişisel Verilerin Aktarılması',
    body: (
      <p>
        Kişisel verileriniz; hizmetin teknik olarak sunulabilmesi amacıyla bulut bilişim altyapısı
        sağlayıcımız olan Google Firebase ve Google Cloud Platform (GCP) sunucularına aktarılmaktadır.
        Bu altyapı sunucuları yurt dışında bulunabilmektedir. Verileriniz, yasal zorunluluklar
        haricinde üçüncü taraf şahıs veya ticari şirketlerle reklam amaçlı paylaşılmaz veya satılmaz.
      </p>
    ),
  },
  {
    id: '4',
    title: 'Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi',
    body: (
      <p>
        Verileriniz, uygulamayı kullanmanız esnasında tamamen dijital kanallar aracılığıyla
        toplanmaktadır. Veri işleme faaliyetimiz; &quot;bir sözleşmenin kurulması veya ifasıyla
        doğrudan doğruya ilgili olması&quot; ve &quot;veri sorumlusunun hukuki yükümlülüğünü yerine
        getirebilmesi için zorunlu olması&quot; hukuki sebeplerine dayanmaktadır.
      </p>
    ),
  },
  {
    id: '5',
    title: 'Veri Sahibinin Hakları (KVKK Madde 11)',
    body: (
      <div className="flex flex-col gap-4">
        <p>KVKK uyarınca herkes, veri sorumlusuna başvurarak kendisiyle ilgili;</p>
        <ul className="flex flex-col gap-2.5 list-none pl-0">
          {[
            'Kişisel verilerinin işlenip işlenmediğini öğrenme,',
            'Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,',
            'Kişisel verilerin düzeltilmesini, silinmesini veya yok edilmesini isteme,',
            'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme',
          ].map((right) => (
            <li key={right} className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#A2B997] shrink-0" />
              <span>{right}</span>
            </li>
          ))}
        </ul>
        <p>haklarına sahiptir.</p>
        <p className="rounded-xl glass-chip border border-[#A2B997]/25 px-5 py-4 text-sm">
          Kullanıcılar, uygulama içerisindeki &quot;Hesabımı Sil&quot; butonu aracılığıyla tüm
          verilerinin kalıcı olarak silinmesini her zaman talep edebilirler.
        </p>
      </div>
    ),
  },
  {
    id: '6',
    title: 'İletişim',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          Gizlilik politikamızla ilgili sorularınız ve hak talepleriniz için bizimle iletişime
          geçebilirsiniz:
        </p>
        <p>
          E-posta:{' '}
          <a
            href="mailto:destek@gidaajani.com"
            className="text-brand hover:underline font-medium"
          >
            destek@gidaajani.com
          </a>
        </p>
        <p>
          Web:{' '}
          <a href="https://gidaajani.com" className="text-brand hover:underline font-medium">
            https://gidaajani.com
          </a>
        </p>
      </div>
    ),
  },
]

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Gizlilik Politikası — Gıda Ajanı'
  }, [])

  return (
    <div className="min-h-screen bg-page" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header className="fixed top-0 inset-x-0 z-50 glass transition-all duration-300">
        <nav className="content-column h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <img src={LOGO} alt="Gıda Ajanı" className="h-9 w-auto" />
            <span className="font-bold text-lg tracking-tight text-heading hidden sm:inline">
              Gıda<span className="gradient-text"> Ajanı</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="glass-btn px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Ana sayfa
            </a>
          </div>
        </nav>
      </header>

      <main className="mesh-bg pt-28 pb-20">
        <div className="content-column max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip chip-brand text-sm font-medium mb-6">
            <ShieldCheck size={14} />
            KVKK Aydınlatma Metni
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight leading-tight">
            Gizlilik <span className="gradient-text">Politikası</span>
          </h1>
          <p className="text-muted mt-4 text-base leading-relaxed">
            Gıda Ajanı — Gizlilik Politikası ve Aydınlatma Metni
          </p>
          <p className="text-subtle text-sm mt-2">Son güncelleme: 12.08.2026</p>

          <div className="mt-10 flex flex-col gap-5">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                className="gradient-border glass-card rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-sm font-bold text-brand tabular-nums">{section.id}.</span>
                  <h2 className="text-lg sm:text-xl font-bold text-heading">{section.title}</h2>
                </div>
                <div className="text-muted text-sm leading-relaxed">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-subtle glass py-8">
        <div className="content-column flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-faint text-sm">© 2026 Gıda Ajanı. Tüm hakları saklıdır.</p>
          <a href="/" className="text-subtle text-sm hover:text-heading transition-colors">
            Ana sayfaya dön
          </a>
        </div>
      </footer>
    </div>
  )
}
