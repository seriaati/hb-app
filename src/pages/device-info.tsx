import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { useSubmitDeviceInfo } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEVICE_INFO_APK =
  'https://ghproxy.mihomo.me/https://raw.githubusercontent.com/forchannot/get_device_info/main/app/build/outputs/apk/debug/app-debug.apk'
const AAID_OBTAIN_APP =
  'https://apkpure.com/easy-advertising-id/advertising.id.ccpa.gdpr/downloading'

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
            需要补充设备信息
          </h1>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-4">
          {/* Step 1: Device info app */}
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              获取设备信息
            </p>
            <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>点击下方按钮下载用于获取设备信息的应用程序</li>
              <li>安装并启动该应用</li>
              <li>点击「点击查看信息」</li>
              <li>点击「点击复制」</li>
              <li>点击下方的「提交设备信息」按钮并将复制的信息贴上</li>
            </ol>
          </div>

          {/* Step 2: AAID fallback */}
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              如果 oaid 显示 error_123456
            </p>
            <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>点击下方按钮下载获取 aaid 应用程序的 apk</li>
              <li>安装后启动并点击右下角按钮复制 aaid，并用新复制的 aaid 取代原本的 error_123456</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-1">
              结果应该长的像这样：<code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">'oaid':'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'</code>
            </p>
          </div>

          {/* Download buttons */}
          <div className="flex flex-wrap gap-2">
            <a href={DEVICE_INFO_APK} target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="outline" className="gap-2 text-sm">
                <Download className="size-4" />
                复制设备信息应用程序
              </Button>
            </a>
            <a href={AAID_OBTAIN_APP} target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="outline" className="gap-2 text-sm">
                <Download className="size-4" />
                获取 aaid 应用程序
              </Button>
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="device_info"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              设备信息
            </Label>
            <textarea
              id="device_info"
              className="min-h-35 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder="请将复制的设备信息粘贴到此处"
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
              placeholder="请将复制的 aaid 粘贴到此处"
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
