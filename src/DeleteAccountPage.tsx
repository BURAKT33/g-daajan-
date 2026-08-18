import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react'
import { ThemeToggle } from './lib/theme'

const LOGO = '/logo.svg'

type Lang = 'tr' | 'en'

const COPY = {
  tr: {
    titleSuffix: 'Hesabımı Sil — Gıda Ajanı',
    back: 'Ana sayfa',
    badge: 'Hesap silme',
    heading: 'Gıda Ajani Hesap silme bilgileri',
    intro:
      'Bu sayfada, Gıda Ajani hesabınızı nasıl sileceğinizi öğrenebilirsiniz. Hesap silme işlemi gerçekleştirildikten sonra, tüm işlem geçmişiniz, üyelikleriniz ve kişisel verileriniz sunucularımızdan kalıcı olarak silinecektir; hiçbir veri saklanmayacak, işlenmez veya paylaşılmaz. Bu eylem geri döndürülemez.',
    stepsHeading: 'Hesabınızı Uygulamada Silmek İçin Adımlar:',
    steps: [
      'Gıda Ajani uygulamasını açın ve hesabınıza giriş yapın.',
      'Ana ekranın sağ üst köşesindeki profil simgesine dokunun. (Alttaki Profilim kartını da kullanabilirsiniz.)',
      'Profil sayfasında en alta kaydırın ve kırmızı renkli Hesabımı Sil bağlantısına dokunun.',
      'Silme işlemini kalıcı olarak tamamlamak için ekrandaki istemi onaylayın.',
    ],
    screenshotCaptions: [
      'Adım 2 — Ana ekrandaki profil simgesi',
      'Adım 3 — Profil sayfasının altındaki Hesabımı Sil',
      'Adım 4 — Silme onay ekranı',
    ],
    warningTitle: 'Bu işlem geri alınamaz',
    warningBody:
      'Onayladıktan sonra tarama geçmişiniz, üyelikleriniz ve kişisel verileriniz kalıcı olarak silinir. Silinen verilere yeniden erişilemez.',
    help:
      'Hesabınızı silerken sorun yaşarsanız bizimle iletişime geçebilirsiniz:',
    footerHome: 'Ana sayfaya dön',
  },
  en: {
    titleSuffix: 'Delete My Account — Gıda Ajanı',
    back: 'Home',
    badge: 'Account deletion',
    heading: 'Gıda Ajani Account Deletion Information',
    intro:
      'This page explains how to delete your Gıda Ajani account. Once the account deletion is completed, all of your activity history, memberships, and personal data will be permanently deleted from our servers; no data will be retained, processed, or shared. This action is irreversible.',
    stepsHeading: 'Steps to Delete Your Account in the App:',
    steps: [
      'Open the Gıda Ajani app and sign in to your account.',
      'On the home screen, tap the profile icon in the top-right corner. (You can also use the My Profile card at the bottom.)',
      'Scroll to the bottom of the Profile page and tap the red Delete My Account (Hesabımı Sil) link.',
      'Confirm the on-screen prompt to permanently complete the deletion.',
    ],
    screenshotCaptions: [
      'Step 2 — Profile icon on the home screen',
      'Step 3 — Delete My Account at the bottom of Profile',
      'Step 4 — Deletion confirmation dialog',
    ],
    warningTitle: 'This action cannot be undone',
    warningBody:
      'After you confirm, your scan history, memberships, and personal data are permanently deleted. Deleted data cannot be recovered.',
    help: 'If you have trouble deleting your account, contact us at:',
    footerHome: 'Back to home',
  },
} as const

const SCREENSHOTS = [
  {
    src: '/screenshots/delete-step-1-profile.png',
    altTr: 'Gıda Ajani ana ekranı, sağ üstteki profil simgesi işaretlenmiş',
    altEn: 'Gıda Ajani home screen with the top-right profile icon highlighted',
  },
  {
    src: '/screenshots/delete-step-2-delete.png',
    altTr: 'Profilim ekranı, en alttaki Hesabımı Sil bağlantısı işaretlenmiş',
    altEn: 'My Profile screen with the Delete My Account link at the bottom highlighted',
  },
  {
    src: '/screenshots/delete-step-3-confirm.png',
    altTr: 'Hesap silme onay diyaloğu — KVKK kapsamında kalıcı silme uyarısı',
    altEn: 'Account deletion confirmation dialog — permanent deletion warning under KVKK',
  },
] as const

function detectLang(): Lang {
  const stored = localStorage.getItem('gida-ajani-lang')
  if (stored === 'tr' || stored === 'en') return stored
  return 'tr'
}

export default function DeleteAccountPage() {
  const [lang, setLang] = useState<Lang>(() => detectLang())
  const t = COPY[lang]

  useEffect(() => {
    document.title = t.titleSuffix
    document.documentElement.lang = lang
    localStorage.setItem('gida-ajani-lang', lang)
  }, [lang, t.titleSuffix])

  const setLanguage = (next: Lang) => setLang(next)

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
            <div className="flex items-center rounded-full glass-chip p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  lang === 'tr' ? 'chip-cta' : 'text-muted hover:text-heading'
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  lang === 'en' ? 'chip-cta' : 'text-muted hover:text-heading'
                }`}
              >
                EN
              </button>
            </div>
            <ThemeToggle />
            <a
              href="/"
              className="glass-btn px-3 sm:px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">{t.back}</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="mesh-bg pt-28 pb-20">
        <div className="content-column max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip chip-brand text-sm font-medium mb-6">
            <Trash2 size={14} />
            {t.badge}
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-heading tracking-tight leading-tight">
            {t.heading}
          </h1>
          <p className="text-muted mt-5 text-base leading-relaxed">{t.intro}</p>

          <div className="mt-8 rounded-2xl border border-[#FF8A65]/30 bg-[#FF8A65]/8 px-5 py-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#FF8A65] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-heading text-sm">{t.warningTitle}</p>
              <p className="text-muted text-sm mt-1 leading-relaxed">{t.warningBody}</p>
            </div>
          </div>

          <section className="mt-10 gradient-border glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-heading mb-6">{t.stepsHeading}</h2>
            <ol className="flex flex-col gap-4">
              {t.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="mt-0.5 w-7 h-7 rounded-full glass-chip icon-brand flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-muted text-sm sm:text-base leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-8 grid sm:grid-cols-3 gap-5">
            {SCREENSHOTS.map((shot, i) => (
              <figure key={shot.src} className="gradient-border glass-card rounded-2xl overflow-hidden">
                <img
                  src={shot.src}
                  alt={lang === 'tr' ? shot.altTr : shot.altEn}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-xs text-subtle font-medium text-center">
                  {t.screenshotCaptions[i]}
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="text-subtle text-sm mt-10 leading-relaxed">
            {t.help}{' '}
            <a href="mailto:destek@gidaajani.com" className="text-brand hover:underline font-medium">
              destek@gidaajani.com
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-subtle glass py-8">
        <div className="content-column flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-faint text-sm">© 2026 Gıda Ajanı. Tüm hakları saklıdır.</p>
          <a href="/" className="text-subtle text-sm hover:text-heading transition-colors">
            {t.footerHome}
          </a>
        </div>
      </footer>
    </div>
  )
}
