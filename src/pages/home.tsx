import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const userId = searchParams.get('user_id')
    if (userId) {
      navigate(`/platforms?${searchParams.toString()}`, { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background bg-texture overflow-hidden">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative background elements */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-[0.06] dark:opacity-[0.08]"
          style={{ background: 'var(--accent)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-[0.05] dark:opacity-[0.07]"
          style={{ background: 'oklch(0.62 0.12 200)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="page-enter relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl opacity-30 dark:opacity-20 blur-xl"
            style={{ background: 'var(--accent)', transform: 'scale(0.85) translateY(8px)' }}
          />
          <img
            src="/images/logo.png"
            alt="Hoyo Buddy"
            className="relative h-20 w-20 rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-4xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Hoyo Buddy
          </h1>
          <p className="text-base text-muted-foreground max-w-xs leading-relaxed">
            Your HoYoverse companion bot
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 w-48">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Open via Discord to get started
        </p>
      </div>
    </div>
  )
}
