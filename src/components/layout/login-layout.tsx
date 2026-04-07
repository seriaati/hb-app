import { LanguageSelector } from '@/components/ui/language-selector'
import { PageContainer } from '@/components/layout/page-container'
import { DiscordUserBadge } from '@/components/auth/discord-user-badge'
import { FooterLinks } from '@/components/layout/footer-links'
import { ShieldCheck } from 'lucide-react'

export interface LoginLayoutPanel {
  /** Accent color in oklch or any CSS color string */
  accentColor: string
  /** Large icon/image shown in the hero area — a ReactNode (img, svg, emoji wrapper, etc.) */
  hero: React.ReactNode
  /** Small eyebrow label above the title */
  eyebrow?: string
  /** Main title on the left panel */
  title: string
  /** Supporting description */
  description: string
  /** Optional feature pill labels */
  features?: string[]
  /** Optional security/disclaimer note. Defaults to the standard credentials note. Pass null to suppress. */
  securityNote?: string | null
}

interface LoginLayoutProps {
  panel: LoginLayoutPanel
  children: React.ReactNode
}

/**
 * Shared two-column layout for all login/auth pages.
 *
 * - Mobile (< lg): renders children inside the standard narrow PageContainer.
 * - Desktop (lg+): left info panel + right form panel side-by-side.
 */
export function LoginLayout({ panel, children }: LoginLayoutProps) {
  const {
    accentColor,
    hero,
    eyebrow,
    title,
    description,
    features,
    securityNote = null,
  } = panel

  return (
    <>
      {/* ── Mobile layout (< lg) ── */}
      <div className="lg:hidden" style={{ '--accent': accentColor, '--ring': accentColor, '--primary': accentColor } as React.CSSProperties}>
        <PageContainer narrow>{children}</PageContainer>
      </div>

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden lg:flex min-h-screen bg-background bg-texture text-foreground">
        {/* Controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <DiscordUserBadge />
          <LanguageSelector />
        </div>

        {/* Left panel — branding & context */}
        <div
          className="relative flex flex-col justify-between w-1/2 p-12 overflow-hidden"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in oklch, ${accentColor} 18%, var(--background)) 0%,
              color-mix(in oklch, ${accentColor} 6%, var(--background)) 60%,
              var(--background) 100%)`,
          }}
        >
          {/* Decorative blobs — animated float */}
          <div
            className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl blob-float"
            style={{ background: accentColor }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full opacity-10 blur-3xl blob-float-slow"
            style={{ background: accentColor }}
          />

          {/* Top: app logo */}
          <div className="relative flex items-center gap-3 fade-in" style={{ animationDelay: '50ms' }}>
            <img
              src="/images/logo.png"
              alt="Hoyo Buddy"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <span
              className="text-sm font-semibold tracking-wide text-foreground/80"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hoyo Buddy
            </span>
          </div>

          {/* Center: hero content */}
          <div className="relative flex flex-col gap-6 panel-stagger">
            {/* Hero icon/image */}
            <div className="flex items-center gap-4">
              <div
                className="shrink-0 scale-in"
                style={{
                  filter: `drop-shadow(0 8px 24px color-mix(in oklch, ${accentColor} 35%, transparent))`,
                  animationDelay: '120ms',
                }}
              >
                {hero}
              </div>
              <div>
                {eyebrow && (
                  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-0.5">
                    {eyebrow}
                  </p>
                )}
                <h2
                  className="text-3xl font-bold tracking-tight text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Feature pills */}
            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feat, i) => (
                  <span
                    key={feat}
                    className="rounded-full px-3 py-1 text-xs font-medium scale-in"
                    style={{
                      background: `color-mix(in oklch, ${accentColor} 12%, transparent)`,
                      color: accentColor,
                      border: `1px solid color-mix(in oklch, ${accentColor} 25%, transparent)`,
                      animationDelay: `${320 + i * 60}ms`,
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom: security note + footer links */}
          <div className="relative flex flex-col gap-3 fade-in" style={{ animationDelay: '500ms' }}>
            {securityNote && (
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground leading-relaxed">{securityNote}</p>
              </div>
            )}
            <FooterLinks className="flex items-center" />
          </div>
        </div>

        {/* Right panel — form */}
        <div
          className="flex w-1/2 items-center justify-center p-12"
          style={{ '--accent': accentColor, '--ring': accentColor, '--primary': accentColor } as React.CSSProperties}
        >
          <div className="w-full max-w-md page-enter">{children}</div>
        </div>
      </div>
    </>
  )
}
