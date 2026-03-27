import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSubmitDeviceInfo } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DeviceInfoPage() {
  const navigate = useNavigate()
  const submit = useSubmitDeviceInfo()
  const [deviceInfo, setDeviceInfo] = useState('')
  const [aaid, setAaid] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submit.mutate(
      { device_info: deviceInfo, aaid: aaid || undefined },
      {
        onSuccess: (data) => {
          handleLoginFlowResponse(data, navigate)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : '提交失败')
        },
      },
    )
  }

  return (
    <PageContainer narrow>
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            设备信息
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            提供您的设备信息以完成米游社登录验证
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="device_info" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              设备信息 (JSON)
            </Label>
            <textarea
              id="device_info"
              className="min-h-35 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder={'{"device_id": "...", ...}'}
              value={deviceInfo}
              onChange={(e) => setDeviceInfo(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="aaid" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                AAID
              </Label>
              <span className="text-xs text-muted-foreground">可选</span>
            </div>
            <Input
              id="aaid"
              type="text"
              placeholder="Android Advertising ID"
              value={aaid}
              onChange={(e) => setAaid(e.target.value)}
              className="h-10 font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={submit.isPending}
              className="w-full h-10 font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {submit.isPending ? '提交中…' : '提交设备信息'}
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
    </PageContainer>
  )
}
