import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Bug } from 'lucide-react'
import { useRawCookiesLogin } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.48 0.15 295)'

export function LoginRawCookiesPage() {
  const navigate = useNavigate()
  const { platform } = useParams<{ platform: string }>()
  const login = useRawCookiesLogin()
  const [cookies, setCookies] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { cookies },
      {
        onSuccess: (data) => {
          handleLoginFlowResponse(data, navigate)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Login failed')
        },
      },
    )
  }

  return (
    <LoginLayout
      panel={{
        accentColor: ACCENT,
        hero: (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in oklch, ${ACCENT} 15%, var(--background))`,
              border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            }}
          >
            <Bug size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: platform === 'miyoushe' ? 'Miyoushe' : 'HoYoLAB',
        title: 'Dev Cookies',
        description: 'Paste raw cookie JSON for development and testing purposes.',
        features: ['Bypasses all verification steps', 'For development use only'],
        securityNote: null,
      }}
    >
      <div className="flex flex-col gap-6 stagger-children">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{
                background: `color-mix(in oklch, ${ACCENT} 15%, var(--background))`,
                border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
              }}
            >
              <Bug size={13} style={{ color: ACCENT }} />
            </div>
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Dev Mode
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Dev Cookies
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste a JavaScript-extracted cookie object or JSON string. This bypasses all
            verification steps and goes directly to account selection.
          </p>
        </div>

        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{
            background: `color-mix(in oklch, ${ACCENT} 8%, var(--card))`,
            border: `1px solid color-mix(in oklch, ${ACCENT} 20%, transparent)`,
            color: `color-mix(in oklch, ${ACCENT} 80%, var(--foreground))`,
          }}
        >
          <strong>Dev only.</strong> This method is hidden and intended for development and testing.
          Do not share your cookies with anyone.
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="raw-cookies"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Cookie JSON
            </Label>
            <textarea
              id="raw-cookies"
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder={'{"ltuid_v2": "...", "ltoken_v2": "...", ...}'}
              required
              rows={6}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={login.isPending || !cookies.trim()}
              className="w-full h-10 font-semibold"
              style={{ fontFamily: 'var(--font-display)', background: ACCENT }}
            >
              {login.isPending ? 'Submitting…' : 'Submit Cookies'}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </LoginLayout>
  )
}
