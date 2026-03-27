import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { QrCode } from 'lucide-react'
import { useCreateQRCode, useCheckQRCode } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/layout/loading-spinner'

type QRStatus = 'idle' | 'created' | 'scanned' | 'confirmed' | 'expired'

const ACCENT = 'oklch(0.48 0.16 265)'

const STATUS_CONFIG: Record<QRStatus, { label: string; color: string }> = {
  idle: { label: '', color: 'var(--muted-foreground)' },
  created: { label: '等待扫描…', color: 'var(--muted-foreground)' },
  scanned: { label: '已扫描 — 确认中…', color: 'var(--accent)' },
  confirmed: { label: '已确认！', color: 'var(--accent)' },
  expired: { label: '二维码已过期', color: 'var(--destructive)' },
}

export function LoginQRCodePage() {
  const navigate = useNavigate()
  const createQR = useCreateQRCode()
  const checkQR = useCheckQRCode()
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [status, setStatus] = useState<QRStatus>('idle')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  function startPolling() {
    stopPolling()
    pollRef.current = setInterval(() => {
      checkQR.mutate(undefined, {
        onSuccess: (data) => {
          if (data.status === 'confirmed') {
            stopPolling()
            setStatus('confirmed')
            navigate('/finish')
          } else if (data.status === 'expired') {
            stopPolling()
            setStatus('expired')
            toast.error('二维码已过期，请重新生成。')
          } else if (data.status === 'scanned') {
            setStatus('scanned')
          }
        },
        onError: () => {
          stopPolling()
          setStatus('expired')
        },
      })
    }, 3000)
  }

  function handleGenerate() {
    createQR.mutate(undefined, {
      onSuccess: (data) => {
        setQrImage(data.image_base64)
        setStatus('created')
        startPolling()
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : '生成二维码失败')
      },
    })
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  const statusConfig = STATUS_CONFIG[status]
  const showQR = qrImage && status !== 'expired'

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
            <QrCode size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: '米游社',
        title: '二维码登录',
        description: '生成二维码并使用米游社手机App扫描，即可免密码快速登录。',
        features: ['无需密码', '需要App'],
        securityNote: '二维码由米游社服务器生成，短时间内过期。我们的服务器不存储任何凭证。',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/miyoushe.webp" alt="米游社" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              米游社
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            二维码登录
          </h1>
          <p className="text-sm text-muted-foreground">
            使用米游社App扫描二维码登录
          </p>
        </div>

        {/* QR Code area */}
        <div className="flex flex-col items-center gap-5">
          <div
            className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 overflow-hidden transition-all duration-300"
            style={{
              borderColor: showQR
                ? 'color-mix(in oklch, var(--accent) 40%, var(--border))'
                : 'var(--border)',
              background: showQR ? 'var(--card)' : 'var(--muted)',
            }}
          >
            {showQR ? (
              <img
                src={`data:image/png;base64,${qrImage}`}
                alt="二维码"
                className="h-full w-full object-contain p-3"
              />
            ) : createQR.isPending ? (
              <LoadingSpinner size={32} />
            ) : (
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'color-mix(in oklch, var(--accent) 12%, transparent)' }}
                >
                  📱
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  生成二维码以使用米游社扫描
                </p>
              </div>
            )}
          </div>

          {/* Status indicator */}
          {status !== 'idle' && (
            <div className="flex items-center gap-2">
              {(status === 'created' || status === 'scanned') && (
                <LoadingSpinner size={14} />
              )}
              <span
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full">
            {(status === 'idle' || status === 'expired') && (
              <Button
                onClick={handleGenerate}
                disabled={createQR.isPending}
                className="w-full h-10 font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {status === 'expired' ? '重新生成二维码' : '生成二维码'}
              </Button>
            )}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
            >
              ← 返回
            </button>
          </div>
        </div>
      </div>
    </LoginLayout>
  )
}
