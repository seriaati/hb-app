import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Wrench, Download } from 'lucide-react'
import { useModAppLogin } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.48 0.16 265)'

const APK_URL =
  'https://github.com/PaiGramTeam/GetToken/releases/download/2.90.1/miyoushe-430-lspatched.apk'

const STEPS = [
  '如果你的装置上已经有米游社的应用程序，请将它卸载。',
  '点击下方的按钮下载改装过的应用程序档案。',
  '安装该应用程序，并启动它。',
  '忽略任何更新视窗，登入你的帐户。',
  '点击「我的」并点击钥匙图案。',
  '点击「复制登入信息」。',
  '点击下方的「通过改装过的米游社应用程序」按钮并将复制的登入信息贴上。',
] as const

export function LoginModAppPage() {
  const navigate = useNavigate()
  const login = useModAppLogin()
  const [loginDetails, setLoginDetails] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { login_details: loginDetails },
      {
        onSuccess: (data) => {
          handleLoginFlowResponse(data, navigate)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : '登录失败')
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
            <Wrench size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: '米游社 · Miyoushe',
        title: '改装版米游社 App 登录',
        description: '使用改装版米游社 App 拦截并提取您的登录信息。此方法适用于米游社账号。',
        features: ['适合移动端', '无需浏览器'],
        securityNote: '从改装 App 提取的登录信息仅用于向米游社 API 验证身份，不会存储于我们的服务器。',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img
              src="/images/miyoushe.webp"
              alt="Miyoushe"
              className="h-6 w-6 rounded-md object-cover"
            />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              米游社 · Miyoushe
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            改装版米游社 App 登录
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            使用改装版米游社 App 提取您的登录信息并粘贴到下方
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <div key={index} className="flex gap-3">
              {/* Step number */}
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5"
                style={{
                  background: `color-mix(in oklch, ${ACCENT} 15%, var(--background))`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
                  color: ACCENT,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {index + 1}
              </div>
              {/* Step content */}
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
                {/* APK download button on step 2 */}
                {index === 1 && (
                  <a
                    href={APK_URL}
                    className="mt-1.5 inline-flex items-center gap-1.5 self-start rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 12%, var(--card))`,
                      border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
                      color: ACCENT,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    <Download size={12} />
                    下载改装版米游社 APK
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="login_details"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              登录信息
            </Label>
            <textarea
              id="login_details"
              className="min-h-35 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder="在此粘贴您的登录信息…"
              value={loginDetails}
              onChange={(e) => setLoginDetails(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-10 font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {login.isPending ? '提交中…' : '提交信息'}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
            >
              ← 返回
            </button>
          </div>
        </form>
      </div>
    </LoginLayout>
  )
}
