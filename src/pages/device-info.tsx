import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useSubmitDeviceInfo } from '@/hooks/use-login'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DeviceInfoPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const submit = useSubmitDeviceInfo()
  const [deviceInfo, setDeviceInfo] = useState('')
  const [aaid, setAaid] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submit.mutate(
      { device_info: deviceInfo, aaid: aaid || undefined },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            navigate('/finish')
          } else if (data.status === 'geetest_required') {
            navigate('/geetest')
          } else {
            toast.info(data.message ?? 'Unknown status')
          }
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Submission failed')
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
            {t('web.device_info_title', 'Device Information')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.device_info_desc', 'Provide your device information for Miyoushe login verification')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="device_info" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t('web.device_info_label', 'Device Info (JSON)')}
            </Label>
            <textarea
              id="device_info"
              className="min-h-[140px] w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder={'{"device_id": "...", ...}'}
              value={deviceInfo}
              onChange={(e) => setDeviceInfo(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="aaid" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t('web.aaid_label', 'AAID')}
              </Label>
              <span className="text-xs text-muted-foreground">{t('web.optional', 'Optional')}</span>
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
              {submit.isPending ? t('web.submitting', 'Submitting…') : t('web.submit_device_info', 'Submit Device Info')}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
            >
              {t('web.back', '← Back')}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
