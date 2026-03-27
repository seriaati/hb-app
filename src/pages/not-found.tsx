import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background bg-texture overflow-hidden">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-[0.06] dark:opacity-[0.08]"
          style={{ background: 'var(--accent)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-[0.05] dark:opacity-[0.07]"
          style={{ background: 'oklch(0.62 0.12 200)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full opacity-[0.03] dark:opacity-[0.04]"
          style={{ background: 'oklch(0.35 0.18 295)', filter: 'blur(120px)' }}
        />
      </div>

      <div className="page-enter relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-sm">
        {/* Logo */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl opacity-30 dark:opacity-20 blur-xl"
            style={{ background: 'var(--accent)', transform: 'scale(0.85) translateY(8px)' }}
          />
          <img
            src="/images/logo.png"
            alt="Hoyo Buddy"
            className="relative h-16 w-16 rounded-2xl object-cover shadow-lg opacity-60"
          />
        </div>

        {/* 404 number */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-[7rem] font-bold leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-display)',
              background: `linear-gradient(135deg, var(--accent) 0%, oklch(0.35 0.18 295) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.not_found_title', 'Page Not Found')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'web.not_found_desc',
              "This page doesn't exist or may have been moved. Head back home to get started.",
            )}
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 w-40">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Action */}
        <Button
          onClick={() => navigate('/', { replace: true })}
          className="px-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('web.go_home', 'Go Home')}
        </Button>
      </div>
    </div>
  )
}
