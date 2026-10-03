import { useEffect } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { ThemeToggle } from './lib/theme'

const LOGO = '/logo.svg'

const SECTIONS = [
  {
    id: '1',
    title: 'Taraflar ve Kabul',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          Bu Kullanım Şartları; Gıda Ajanı mobil uygulaması ve web sitesi
          (birlikte &quot;Hizmet&quot;) üzerinden sunulan hizmetlerin kullanımına ilişkin
          koşulları düzenler. Hizmet, Meres Tohum (&quot;Gıda Ajanı&quot;, &quot;biz&quot;)
          tarafından sağlanmaktadır.
        </p>
        <p>
          Uygulamayı indirerek, hesabı oluşturarak veya Hizmeti herhangi bir şekilde
          kullanarak bu şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan
          etmiş olursunuz. Şartları kabul etmiyorsanız Hizmeti kullanmayınız.
        </p>
      </div>
    ),
  },
  {
    id: '2',
    title: 'Hizmetin Tanımı',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          Gıda Ajanı; ürün fotoğrafı veya ilgili sorgular aracılığıyla kullanıcıya,
          T.C. Tarım ve Orman Bakanlığı kamuoyu duyuruları ile Güvenilir Gıda
          platformu gibi resmi kaynaklara dayalı bilgilendirme sunmayı amaçlayan bir
          uygulamadır.
        </p>
        <p>
          Hizmet kapsamında ürün tanıma, taklit-tağşiş listesiyle karşılaştırma,
          tarama geçmişi, hesap yönetimi ve benzeri özellikler sunulabilir. Özellikler
          zaman içinde güncellenebilir, değiştirilebilir veya kaldırılabilir.
        </p>
      </div>
    ),
  },
  {
    id: '3',
    title: 'Hesap Oluşturma ve Güvenlik',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          Bazı özellikler için hesap oluşturmanız gerekebilir. Hesap bilgilerinizin
          doğruluğundan, güncelliğinden ve gizliliğinden siz sorumlusunuz. Hesabınız
          üzerinden gerçekleşen işlemlerden hesabın yetkili kullanıcısı olarak siz
          sorumlu tutulursunuz.
        </p>
        <p>
          Hesabınızı dilediğiniz zaman uygulama içindeki &quot;Hesabımı Sil&quot;
          seçeneği veya{' '}
          <a href="/delete-my-account" className="text-brand hover:underline font-medium">
            hesap silme sayfası
          </a>{' '}
          üzerinden kalıcı olarak silebilirsiniz.
        </p>
      </div>
    ),
  },
  {
    id: '4',
    title: 'Kullanıcı Yükümlülükleri',
    body: (
      <div className="flex flex-col gap-4">
        <p>Hizmeti kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
        <ul className="flex flex-col gap-2.5 list-none pl-0">
          {[
            'Hizmeti yalnızca hukuka uygun ve meşru amaçlarla kullanmak,',
            'Yanıltıcı, sahte veya başkasına ait bilgilerle hesap oluşturmamak,',
            'Sisteme zarar verecek, aşırı yük bindirecek veya güvenliği bozacak girişimlerde bulunmamak,',
            'Uygulama veya sunucu altyapısını tersine mühendislik, yetkisiz erişim veya benzeri yollarla kötüye kullanmamak,',
            'Hizmet içeriğini izinsiz kopyalamamak, ticari olarak yeniden satmamak veya üçüncü kişilere yetkisiz şekilde dağıtmamak.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#A2B997] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: '5',
    title: 'Bilgilendirme Niteliği ve Sorumluluk Reddi',
    body: (
      <div className="flex flex-col gap-3">
        <p className="rounded-xl glass-chip border border-[#FF8A65]/25 px-5 py-4 text-sm">
          Gıda Ajanı tarafından sunulan sonuçlar bilgilendirme amaçlıdır; yasal
          bağlayıcılık taşımaz. Nihai değerlendirme ve karar kullanıcıya aittir.
        </p>
        <p>
          Uygulama, resmi kamu kaynaklarından alınan verileri işler ve kullanıcıya
          sunar. Kaynak verilerdeki gecikme, eksiklik, güncelleme farkı veya teknik
          eşleştirme hataları nedeniyle oluşabilecek sonuçlardan Gıda Ajanı; doğrudan,
          dolaylı, özel veya sonuçsal zararlardan mümkün olan en geniş ölçüde sorumlu
          tutulamaz.
        </p>
        <p>
          Hizmet; tıbbi, hukuki veya resmi denetim sonucu niteliği taşımaz. Ürün
          güvenliği konusunda resmi makamların duyuruları ve ilgili mevzuat esas
          alınmalıdır.
        </p>
      </div>
    ),
  },
  {
    id: '6',
    title: 'Fikri Mülkiyet',
    body: (
      <p>
        Uygulama arayüzü, yazılım, logo, metin, tasarım ve diğer içerikler Gıda Ajanı
        veya lisans verenlerine aittir. Bu materyallerin tamamı veya bir kısmı, önceden
        yazılı izin olmaksızın kopyalanamaz, çoğaltılamaz, değiştirilemez veya ticari
        amaçla kullanılamaz. Resmi kamu verileri ilgili kamu kurumlarının kaynak
        haklarına tabidir.
      </p>
    ),
  },
  {
    id: '7',
    title: 'Ücretlendirme ve Abonelikler',
    body: (
      <p>
        Hizmetin temel özellikleri ücretsiz sunulabilir; bazı özellikler ücretli plan
        veya abonelik kapsamında olabilir. Ücretli içerikler varsa fiyat, kapsam ve
        iptal koşulları uygulama içinde veya ilgili satın alma ekranında ayrıca
        belirtilir. Platform üzerinden yapılan satın almalarda (App Store, Google Play
        vb.) ilgili mağazanın ödeme ve iptal kuralları da geçerlidir.
      </p>
    ),
  },
  {
    id: '8',
    title: 'Hizmetin Askıya Alınması ve Fesih',
    body: (
      <p>
        Bu şartların ihlali, kötüye kullanım şüphesi, yasal zorunluluk veya teknik
        güvenlik gerekçeleriyle hesabınızı veya Hizmete erişiminizi geçici ya da kalıcı
        olarak askıya alabilir veya sonlandırabiliriz. Kullanıcı olarak hesabınızı
        istediğiniz zaman kapatabilirsiniz. Fesih sonrasında kişisel verilerinizin
        işlenmesi,{' '}
        <a href="/privacy" className="text-brand hover:underline font-medium">
          Gizlilik Politikası
        </a>{' '}
        kapsamında yürütülür.
      </p>
    ),
  },
  {
    id: '9',
    title: 'Gizlilik',
    body: (
      <p>
        Kişisel verilerinizin işlenmesine ilişkin detaylar{' '}
        <a href="/privacy" className="text-brand hover:underline font-medium">
          Gizlilik Politikası
        </a>{' '}
        sayfasında yer alır. Hizmeti kullanarak bu politikayı da okuduğunuzu ve
        anladığınızı kabul etmiş sayılırsınız.
      </p>
    ),
  },
  {
    id: '10',
    title: 'Şartlarda Değişiklik',
    body: (
      <p>
        Bu Kullanım Şartları zaman zaman güncellenebilir. Güncel metin bu sayfada
        yayımlanır. Önemli değişikliklerde makul ölçüde bilgilendirme yapmaya
        çalışırız. Değişikliklerden sonra Hizmeti kullanmaya devam etmeniz, güncel
        şartları kabul ettiğiniz anlamına gelir.
      </p>
    ),
  },
  {
    id: '11',
    title: 'Uygulanacak Hukuk ve Yetki',
    body: (
      <p>
        Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda, yetkili
        mahkemeler ve icra daireleri Türkiye Cumhuriyeti mahkemeleridir; zorunlu
        tüketici hakları saklıdır.
      </p>
    ),
  },
  {
    id: '12',
    title: 'İletişim',
    body: (
      <div className="flex flex-col gap-3">
        <p>Kullanım Şartları ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:</p>
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

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Kullanım Şartları — Gıda Ajanı'
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
            <FileText size={14} />
            Kullanım koşulları
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight leading-tight">
            Kullanım <span className="gradient-text">Şartları</span>
          </h1>
          <p className="text-muted mt-4 text-base leading-relaxed">
            Gıda Ajanı — Kullanım Şartları ve Hizmet Koşulları
          </p>
          <p className="text-subtle text-sm mt-2">Son güncelleme: 04.10.2026</p>

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
