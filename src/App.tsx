import { useState, useEffect } from 'react'
import {
  Radar, Scan, ShieldCheck, ChevronDown, Check,
  ArrowRight, Star, Camera, AlertTriangle, Menu, X, Play, LayoutGrid,
  MessageCircle, Users, Database, QrCode, Search, FileWarning, CircleCheck, Eye
} from 'lucide-react'
import ListeTarama from './ListeTarama'
import { ThemeToggle } from './lib/theme'

const LOGO = '/logo.svg'
const SCREENSHOTS = {
  safe: '/screenshots/scan-safe.jpeg',
  risk: '/screenshots/scan-risk.jpeg',
  history: '/screenshots/scan-history.jpeg',
} as const

function Logo({ className = 'h-9 w-auto' }: { className?: string }) {
  return <img src={LOGO} alt="Gıda Ajanı" className={className} />
}

function PhoneMockup({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative mx-auto w-[260px] sm:w-[280px] ${className}`}>
      <div className="absolute -inset-3 bg-gradient-to-br from-orange-500/20 to-emerald-500/10 rounded-[3rem] blur-xl" />
      <div className="relative rounded-[2.5rem] glass-phone p-1.5 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 phone-notch rounded-b-xl z-10" />
        <div className="rounded-[2rem] overflow-hidden bg-black">
          <img src={src} alt={alt} className="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Ürün Tara', href: '#tarama' },
    { label: 'Nasıl Çalışır', href: '#how-it-works' },
    { label: 'Özellikler', href: '#features' },
    { label: 'SSS', href: '#faq' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass transition-all duration-300">
      <nav className="content-column h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <Logo className="h-9 w-auto" />
          <span className="font-bold text-lg tracking-tight text-heading hidden sm:inline">Gıda<span className="gradient-text"> Ajanı</span></span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.label}>
              <a href={l.href} className="text-sm text-muted hover:text-heading transition-colors duration-200 font-medium">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a href="#tarama" className="text-sm text-muted hover:text-heading transition-colors font-medium">Giriş Yap</a>
          <a href="#tarama" className="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white">
            <span>Ürün Tara</span>
          </a>
        </div>

        <button className="md:hidden text-muted hover:text-heading" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-subtle content-column py-4 flex flex-col gap-4">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-body hover:text-heading font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#tarama" className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold text-white text-center mt-2">
            <span>Ücretsiz Ürün Tara</span>
          </a>
        </div>
      )}
    </header>
  )
}

// ─── APP SCREENSHOT SHOWCASE ──────────────────────────────────────────────────
function AppScreenshotShowcase() {
  const screens = [
    { key: 'safe', src: SCREENSHOTS.safe, label: 'Güvenli Ürün', alt: 'Güvenli ürün tarama sonucu ekranı' },
    { key: 'risk', src: SCREENSHOTS.risk, label: 'Riskli Ürün', alt: 'Riskli ürün tespit ekranı' },
    { key: 'history', src: SCREENSHOTS.history, label: 'Tarama Geçmişi', alt: 'Önceki taramalarım ekranı' },
  ] as const

  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % screens.length), 4000)
    return () => clearInterval(timer)
  }, [screens.length])

  return (
    <div className="flex flex-col items-center gap-6">
      <PhoneMockup src={screens[active].src} alt={screens[active].alt} />
      <div className="flex items-center gap-2">
        {screens.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              active === i
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 backdrop-blur-sm'
                : 'glass-chip text-subtle hover:text-heading'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const stats = [
    { value: '1.2M+', label: 'Taranan Ürün', icon: <Scan size={16} />, span: 'col-span-2' },
    { value: '%97', label: 'Doğruluk Oranı', icon: <ShieldCheck size={16} />, span: 'col-span-1' },
    { value: '<3sn', label: 'Analiz Süresi', icon: <Radar size={16} />, span: 'col-span-1' },
  ]

  return (
    <section className="mesh-bg min-h-screen flex items-center pt-24 pb-16">
      <div className="content-column grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full glass-chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium">
            <ShieldCheck size={14} className="pulse-glow" />
            Tarım ve Orman Bakanlığı Verileriyle
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-heading">
            Ürünün fotoğrafını çek,<br />
            <span className="gradient-text">güvenli mi</span><br />
            hemen öğren.
          </h1>

          <p className="text-lg text-muted leading-relaxed max-w-md">
            Gıda Ajanı, ürün etiketini fotoğraflayarak Tarım ve Orman Bakanlığı&apos;nın
            taklit-tağşiş listeleri ve kayıt verileriyle karşılaştırır. Marketten almadan önce kontrol edin.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#tarama" className="btn-primary px-7 py-3.5 rounded-full text-base font-semibold text-white flex items-center gap-2">
              <span>Ürünü Hemen Tara</span>
              <ArrowRight size={16} className="relative z-10" />
            </a>
            <a href="#how-it-works" className="flex items-center gap-2 text-muted hover:text-heading transition-colors font-medium text-sm">
              <div className="w-9 h-9 rounded-full glass-icon flex items-center justify-center hover:border-white/40 transition-colors">
                <Play size={14} fill="currentColor" />
              </div>
              Nasıl çalışır?
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {stats.map(s => (
              <div
                key={s.label}
                className={`gradient-border card-hover glass-card rounded-2xl px-5 py-4 flex flex-col justify-center ${s.span}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">{s.icon}</span>
                  <p className={`font-black gradient-text ${s.span === 'col-span-2' ? 'text-4xl' : 'text-2xl'}`}>
                    {s.value}
                  </p>
                </div>
                <p className="text-xs text-subtle mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative float-anim">
          <div className="absolute -inset-4 bg-gradient-to-br from-orange-600/15 to-emerald-600/10 rounded-3xl blur-2xl" />
          <div className="relative">
            <AppScreenshotShowcase />
            <p className="text-center text-xs text-subtle mt-3 font-medium">Gerçek uygulama ekranları — güvenli, riskli ve geçmiş taramalar</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: <Camera size={22} />,
      title: 'Fotoğraf Çek',
      desc: 'Market rafındaki veya elinizdeki ürünün etiketini net bir şekilde fotoğraflayın. Barkod ve marka adı görünür olsun.',
    },
    {
      step: '02',
      icon: <Scan size={22} />,
      title: 'Yapay Zeka Analiz Eder',
      desc: 'Sistem etiketten marka, ürün adı ve barkod bilgisini okur; Bakanlık veri tabanıyla eşleştirir.',
    },
    {
      step: '03',
      icon: <Database size={22} />,
      title: 'Bakanlık Verisiyle Karşılaştır',
      desc: 'Taklit-tağşiş listesi, gıda kayıt/onay verileri ve kamuoyu duyuruları anlık sorgulanır.',
    },
    {
      step: '04',
      icon: <ShieldCheck size={22} />,
      title: 'Sonucu Gör',
      desc: 'Ürün güvenli mi, listede mi, kayıtlı mı — saniyeler içinde net bir rapor alırsınız.',
    },
  ]

  return (
    <section id="how-it-works" className="py-28 section-gradient">
      <div className="content-column">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-5">
            <Search size={14} />
            Nasıl Çalışır?
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            4 adımda <span className="gradient-text">ürün doğrulama.</span>
          </h2>
          <p className="text-muted mt-4 text-lg max-w-xl mx-auto">
            Karmaşık formlar yok. Ürünün fotoğrafını çekin, Gıda Ajanı gerisini halletsin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => (
            <div key={s.step} className="gradient-border card-hover glass-card rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl glass-chip bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-heading/10">{s.step}</span>
              </div>
              <h3 className="font-bold text-heading text-lg">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES BENTO ───────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Camera size={22} />,
      title: 'Etiket Tanıma',
      desc: 'Yapay zeka ile ürün etiketindeki marka, ürün adı, barkod ve son kullanma tarihini otomatik okur.',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=340&fit=crop&auto=format',
      alt: 'Gıda ürünü etiketi yakın çekim',
      span: 'lg:col-span-2',
    },
    {
      icon: <FileWarning size={22} />,
      title: 'Taklit & Tağşiş Kontrolü',
      desc: 'Bakanlığın yayınladığı taklit ve tağşiş yapılan ürünler listesiyle anlık karşılaştırma.',
      image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&h=340&fit=crop&auto=format',
      alt: 'Market rafındaki gıda ürünleri',
      span: 'lg:col-span-1',
    },
    {
      icon: <QrCode size={22} />,
      title: 'Barkod & Karekod Sorgu',
      desc: 'Barkod ve işletme karekodlarını okuyarak kayıt/onay numarası ve denetim bilgilerine ulaşın.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=340&fit=crop&auto=format',
      alt: 'Süt ürünü barkod etiketi',
      span: 'lg:col-span-1',
    },
    {
      icon: <Database size={22} />,
      title: 'Resmi Veri Kaynağı',
      desc: 'guvenilirgida.tarimorman.gov.tr ve Bakanlık kamuoyu duyurularından güncel veri çekilir.',
      image: null,
      alt: '',
      span: 'lg:col-span-1',
      stat: { value: 'Güncel', label: 'bakanlık verisi' },
    },
    {
      icon: <AlertTriangle size={22} />,
      title: 'Risk Uyarıları',
      desc: 'Ürün listede bulunursa anında kırmızı uyarı, detaylı uygunsuzluk bilgisi ve alternatif öneriler sunulur.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=340&fit=crop&auto=format',
      alt: 'Şüpheli gıda ürünü kontrolü',
      span: 'lg:col-span-1',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Güven Skoru',
      desc: 'Her tarama sonucunda ürüne 0-100 arası güven skoru verilir; yeşil, sarı veya kırmızı durum gösterilir.',
      image: null,
      alt: '',
      span: 'lg:col-span-1',
      stat: { value: '<3sn', label: 'analiz süresi' },
    },
  ]

  return (
    <section id="features" className="py-28 bg-page">
      <div className="content-column">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-5">
            <LayoutGrid size={14} />
            Özellikler
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            Gıda güvenliğinde<br className="hidden md:block" />
            <span className="gradient-text"> dijital kalkanınız.</span>
          </h2>
          <p className="text-muted mt-4 text-lg max-w-xl mx-auto">
            Devletin resmi verileriyle çalışan, vatandaş odaklı gıda doğrulama platformu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`gradient-border card-hover glass-card rounded-2xl overflow-hidden flex flex-col ${f.span}`}
            >
              {f.image && (
                <div className="h-48 overflow-hidden">
                  <img src={f.image} alt={f.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              )}
              {f.stat && (
                <div className="h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-cyan-900/20" />
                  <div className="relative text-center">
                    <p className="text-6xl font-black gradient-text">{f.stat.value}</p>
                    <p className="text-muted text-sm mt-2 font-medium">{f.stat.label}</p>
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl glass-chip bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {f.icon}
                </div>
                <h3 className="font-bold text-heading text-lg">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function Gallery() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=600&fit=crop&auto=format', label: '✓ Güvenli — Süt Ürünü', alt: 'Onaylı süt ürünü', safe: true },
    { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=380&fit=crop&auto=format', label: '✓ Güvenli — Sebze & Meyve', alt: 'Taze sebze meyve', safe: true },
    { url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=480&fit=crop&auto=format', label: '✗ Riskli — Sahte Bal', alt: 'Taklit bal ürünü', safe: false },
    { url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=540&fit=crop&auto=format', label: '✓ Güvenli — Et Ürünü', alt: 'Onaylı et ürünü', safe: true },
    { url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=400&fit=crop&auto=format', label: '✓ Güvenli — Peynir', alt: 'Kayıtlı peynir ürünü', safe: true },
    { url: 'https://images.unsplash.com/photo-1574484284002-952d78056913?w=500&h=460&fit=crop&auto=format', label: '✗ Riskli — Tağşiş Zeytinyağı', alt: 'Tağşiş zeytinyağı', safe: false },
    { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=420&fit=crop&auto=format', label: '✓ Güvenli — Unlu Mamul', alt: 'Onaylı ekmek ürünü', safe: true },
    { url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=360&fit=crop&auto=format', label: '✓ Güvenli — İçecek', alt: 'Kayıtlı içecek', safe: true },
  ]

  return (
    <section id="gallery" className="py-28 bg-page">
      <div className="content-column">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-5">
            <Eye size={14} />
            Tarama Örnekleri
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            Gerçek tarama <span className="gradient-text">sonuçları.</span>
          </h2>
          <p className="text-muted mt-4 text-lg max-w-lg mx-auto">
            Gıda Ajanı ile taranan ürünlerden örnekler — yeşil güvenli, kırmızı riskli.
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="image-gallery-item group relative break-inside-avoid glass-card p-1">
              <img src={img.url} alt={img.alt} className="w-full object-cover rounded-2xl" loading="lazy" />
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${img.safe ? 'bg-emerald-400' : 'bg-red-500'} shadow-lg`} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className={`text-sm font-semibold ${img.safe ? 'text-emerald-300' : 'text-red-300'}`}>{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: 'Ayşe Demir',
      role: 'Anne, İstanbul',
      avatar: 'AD',
      text: "Marketten alışveriş yapmadan önce Gıda Ajanı ile ürünleri kontrol ediyorum. Özellikle çocuklarım için süt ve bal ürünlerinde çok işime yaradı.",
      stars: 5,
    },
    {
      name: 'Mehmet Korkmaz',
      role: 'Market İşletmecisi, Ankara',
      avatar: 'MK',
      text: "Raflarıma gelen ürünleri hızlıca tarayıp taklit listesinde olup olmadığını kontrol ediyorum. Müşterilerime güvenle satabiliyorum.",
      stars: 5,
    },
    {
      name: 'Zeynep Arslan',
      role: 'Gıda Mühendisi',
      avatar: 'ZA',
      text: "Bakanlık verileriyle entegre çalışması en büyük artısı. Etiket okuma doğruluğu yüksek, riskli ürünlerde anında uyarı veriyor.",
      stars: 5,
    },
  ]

  return (
    <section className="py-24 section-gradient-down">
      <div className="content-column">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-heading tracking-tight">
            Binlerce kullanıcı<br />
            <span className="gradient-text">güvenle tarıyor.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="gradient-border card-hover glass-card rounded-2xl p-7 flex flex-col gap-5">
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-body text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-5 border-t border-subtle">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-heading text-sm font-semibold">{t.name}</p>
                  <p className="text-subtle text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Bireysel',
      desc: 'Günlük alışveriş için.',
      price: 0,
      cta: 'Ücretsiz Başla',
      popular: false,
      features: [
        'Ayda 20 ürün taraması',
        'Taklit-tağşiş listesi sorgusu',
        'Güven skoru raporu',
        'Temel etiket okuma',
        'Mobil uygulama erişimi',
      ],
    },
    {
      name: 'Aile',
      desc: 'Düzenli alışveriş yapanlar için.',
      price: 49,
      cta: '14 Gün Ücretsiz Dene',
      popular: true,
      features: [
        'Sınırsız ürün taraması',
        'Tüm Bakanlık listeleri',
        'Geçmiş tarama arşivi',
        'Risk bildirimi (push)',
        'Barkod & karekod okuma',
        'Aile profili (5 kişi)',
        'Öncelikli destek',
      ],
    },
    {
      name: 'İşletme',
      desc: 'Market, restoran ve oteller.',
      price: 299,
      cta: 'İletişime Geç',
      popular: false,
      features: [
        'Aile paketindeki her şey',
        'Toplu ürün taraması',
        'API entegrasyonu',
        'Çoklu kullanıcı (20 kişi)',
        'Tedarikçi risk raporları',
        'Özel hesap yöneticisi',
        'SLA garantisi',
      ],
    },
  ]

  return (
    <section id="pricing" className="py-28 bg-section-alt">
      <div className="content-column">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium mb-5">
            <ShieldCheck size={14} />
            Fiyatlandırma
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            Gıda güvenliği <span className="gradient-text">herkes için.</span>
          </h2>
          <p className="text-muted mt-4 text-lg max-w-md mx-auto">
            Temel tarama ücretsiz. Daha fazlası için uygun fiyatlı planlar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-all duration-300 ${
                plan.popular
                  ? 'pricing-card-popular border-emerald-500/40 glow-purple'
                  : 'glass-card card-hover'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full text-xs font-bold text-white shadow-lg">
                  EN POPÜLER
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-heading">{plan.name}</h3>
                <p className="text-subtle text-sm mt-1">{plan.desc}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-heading">{plan.price}₺</span>
                {plan.price > 0 ? (
                  <span className="text-muted text-sm mb-2">/ay</span>
                ) : (
                  <span className="text-muted text-sm mb-2">ücretsiz</span>
                )}
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm ${plan.popular ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/20' : 'glass-icon text-muted'}`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className="text-body text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`mt-auto w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                plan.popular
                  ? 'btn-primary text-white'
                  : 'glass-btn'
              }`}>
                {plan.popular ? <span className="relative z-10">{plan.cta}</span> : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Gıda Ajanı nasıl çalışır?',
      a: "Ürünün etiket fotoğrafını çekersiniz. Yapay zeka marka, ürün adı ve barkod bilgisini okur; ardından Tarım ve Orman Bakanlığı'nın taklit-tağşiş listeleri ve kayıt verileriyle karşılaştırır. Sonuç saniyeler içinde ekranınıza gelir.",
    },
    {
      q: 'Veriler nereden geliyor?',
      a: "Tüm veriler Tarım ve Orman Bakanlığı'nın resmi Güvenilir Gıda platformundan (guvenilirgida.tarimorman.gov.tr) çekilir. Taklit-tağşiş listeleri, gıda kayıt/onay verileri ve kamuoyu duyuruları düzenli olarak güncellenir.",
    },
    {
      q: 'Hangi ürünleri tarayabilirim?',
      a: 'Ambalajlı tüm gıda ürünlerini tarayabilirsiniz: süt ürünleri, et, bal, zeytinyağı, konserve, içecek, unlu mamul ve daha fazlası. Etikette marka adı veya barkod görünür olmalıdır.',
    },
    {
      q: 'Riskli ürün tespit edilirse ne olur?',
      a: "Ürün taklit-tağşiş listesinde bulunursa kırmızı uyarı gösterilir, uygunsuzluk detayı ve Bakanlık duyuru tarihi paylaşılır. İsterseniz doğrudan Bakanlık'a ihbar da gönderebilirsiniz.",
    },
    {
      q: 'Ücretsiz mi?',
      a: 'Evet — ayda 20 ürün taraması tamamen ücretsizdir. Sınırsız tarama ve ek özellikler için Aile veya İşletme planlarına geçebilirsiniz.',
    },
  ]

  return (
    <section id="faq" className="py-28 bg-page">
      <div className="content-column">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            Sıkça sorulan <span className="gradient-text">sorular.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden transition-all duration-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
              >
                <span className="font-semibold text-heading text-sm md:text-base">{faq.q}</span>
                <ChevronDown size={18} className={`text-muted flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-7 pb-6">
                  <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24">
      <div className="content-column relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-cyan-900/30 rounded-3xl blur-xl" />
        <div className="relative gradient-border glass-cta border border-emerald-500/20 rounded-3xl px-10 py-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight mb-5">
            Marketten almadan önce<br className="hidden md:block" />
            <span className="gradient-text"> kontrol et.</span>
          </h2>
          <p className="text-muted text-lg max-w-lg mx-auto mb-9">
            1 milyondan fazla ürün tarandı. Sen de ürünün fotoğrafını çek,
            Bakanlık verisiyle güvenli mi öğren — tamamen ücretsiz.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tarama" className="btn-primary px-8 py-4 rounded-full text-base font-bold text-white flex items-center gap-2">
              <span>Ürünü Hemen Tara</span>
              <ArrowRight size={16} className="relative z-10" />
            </a>
            <a href="#how-it-works" className="glass-btn px-8 py-4 rounded-full text-base font-semibold transition-all">
              Nasıl Çalışır?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: 'Özellikler',
      links: ['Etiket Tanıma', 'Taklit Kontrolü', 'Barkod Sorgu', 'Güven Skoru', 'Risk Uyarıları'],
    },
    {
      title: 'Veri Kaynakları',
      links: ['Güvenilir Gıda', 'Taklit-Tağşiş Listesi', 'Kamuoyu Duyuruları', 'İşletme Denetimleri'],
    },
    {
      title: 'Şirket',
      links: ['Hakkımızda', 'Blog', 'Kariyer', 'Gizlilik Politikası', 'Kullanım Şartları'],
    },
  ]

  return (
    <footer className="border-t border-subtle glass pt-16 pb-10">
      <div className="content-column">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5 w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Radar size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-heading">Gıda<span className="gradient-text"> Ajanı</span></span>
            </a>
            <p className="text-subtle text-sm leading-relaxed max-w-xs">
              Ürün fotoğrafını çek, Tarım ve Orman Bakanlığı verileriyle karşılaştır. Gıda güvenliğini cebinde taşı.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[
                { Icon: MessageCircle, href: '#', label: 'WhatsApp' },
                { Icon: Camera, href: '#', label: 'Instagram' },
                { Icon: Users, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-full glass-icon flex items-center justify-center text-subtle hover:text-heading hover:border-white/30 transition-all" aria-label={label}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-heading text-sm font-semibold mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-subtle text-sm hover:text-heading transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-faint text-sm">© 2025 Gıda Ajanı. Tüm hakları saklıdır.</p>
          <p className="text-faint text-sm flex items-center gap-1.5">
            Tarım ve Orman Bakanlığı verileriyle <span className="text-emerald-400">güvenli gıda</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-page" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <ListeTarama />
        <HowItWorks />
        <Features />
        <Gallery />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
