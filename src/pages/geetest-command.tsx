import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { useGeetest } from '@/hooks/use-geetest'
import { useGeetestCommand } from '@/hooks/use-login'
import { buildDiscordUrls } from '@/lib/discord'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { PageContainer } from '@/components/layout/page-container'
import { Button, buttonVariants } from '@/components/ui/button'
import type { GeetestMMTData } from '@/api/types'
import type { GeetestV3Validate, GeetestV4Validate } from '@/hooks/use-geetest'

export function GeetestCommandPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const geetestCommandMutation = useGeetestCommand()

  const userId = searchParams.get('user_id')
  const guildId = searchParams.get('guild_id')
  const channelId = searchParams.get('channel_id')
  const messageId = searchParams.get('message_id')
  const gtVersionRaw = searchParams.get('gt_version')
  const apiServer = searchParams.get('api_server')
  const accountIdRaw = searchParams.get('account_id')
  const gtType = searchParams.get('gt_type')

  const mmtGt = searchParams.get('mmt_gt')
  const mmtChallenge = searchParams.get('mmt_challenge')
  const mmtNewCaptchaRaw = searchParams.get('mmt_new_captcha')
  const mmtSuccessRaw = searchParams.get('mmt_success')
  const mmtSessionId = searchParams.get('mmt_session_id')
  const mmtCheckId = searchParams.get('mmt_check_id')
  const mmtRiskType = searchParams.get('mmt_risk_type')

  const missingParams =
    !userId || !channelId || !messageId || !gtVersionRaw || !accountIdRaw || !gtType ||
    !mmtGt || !mmtChallenge || mmtNewCaptchaRaw === null || mmtSuccessRaw === null

  const gtVersion = gtVersionRaw ? parseInt(gtVersionRaw, 10) : null
  const accountId = accountIdRaw ? parseInt(accountIdRaw, 10) : null

  const mmt: GeetestMMTData | null =
    !missingParams && mmtGt && mmtChallenge && mmtNewCaptchaRaw !== null && mmtSuccessRaw !== null
      ? {
          gt: mmtGt,
          challenge: mmtChallenge,
          new_captcha: parseInt(mmtNewCaptchaRaw, 10),
          success: parseInt(mmtSuccessRaw, 10),
          ...(mmtSessionId && { session_id: mmtSessionId }),
          ...(mmtCheckId && { check_id: mmtCheckId }),
          ...(mmtRiskType && { risk_type: mmtRiskType }),
        }
      : null

  const invalidGtVersion = gtVersion !== null && gtVersion !== 3 && gtVersion !== 4

  function submitResult(mmtResult: Record<string, string>) {
    if (accountId === null || !gtType) return
    setCaptchaState('verifying')
    geetestCommandMutation.mutate(
      { account_id: accountId, gt_type: gtType, mmt_result: mmtResult },
      {
        onSuccess: () => {
          setCaptchaState('success')
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('geetest_command_error', 'Verification failed. Please try again.')
          toast.error(message)
          setCaptchaState('error')
        },
      },
    )
  }

  function handleV3Success(validate: GeetestV3Validate) {
    submitResult({
      geetest_challenge: validate.geetest_challenge,
      geetest_validate: validate.geetest_validate,
      geetest_seccode: validate.geetest_seccode,
    })
  }

  function handleV4Success(validate: GeetestV4Validate) {
    submitResult({
      lot_number: validate.lot_number,
      captcha_output: validate.captcha_output,
      pass_token: validate.pass_token,
      gen_time: validate.gen_time,
    })
  }

  const { captchaState, setCaptchaState, error, launchCaptcha } = useGeetest({
    gtVersion: missingParams || invalidGtVersion ? null : gtVersion,
    apiServer,
    mmt,
    onV3Success: handleV3Success,
    onV4Success: handleV4Success,
    onError: () => {},
    onClose: () => {},
  })

  const discordUrls = channelId ? buildDiscordUrls(channelId, guildId) : null

  function ReturnToDiscord() {
    if (!discordUrls) return null
    return (
      <div className="flex flex-col items-center gap-2">
        <a href={discordUrls.deepLink} className={buttonVariants({ variant: 'default' })}>
          {t('return_to_discord', 'Return to Discord')}
        </a>
        <a
          href={discordUrls.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ExternalLink className="h-3 w-3" />
          {t('open_discord_browser', 'Open Discord in browser')}
        </a>
      </div>
    )
  }

  if (missingParams || invalidGtVersion) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">
            {t('geetest_command_missing_params', 'Missing required parameters.')}
          </p>
          {discordUrls && <ReturnToDiscord />}
        </div>
      </PageContainer>
    )
  }

  if (captchaState === 'success') {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {t('geetest_command_success', 'Verification completed!')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('geetest_command_success_desc', 'You can now return to Discord.')}
            </p>
          </div>
          <ReturnToDiscord />
        </div>
      </PageContainer>
    )
  }

  if (captchaState === 'error' || error) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">
            {error ?? t('geetest_command_error', 'Verification failed. Please try again.')}
          </p>
          <Button onClick={() => setCaptchaState('loading')}>{t('retry', 'Retry')}</Button>
          <ReturnToDiscord />
        </div>
      </PageContainer>
    )
  }

  if (captchaState === 'verifying') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <LoadingSpinner size={32} />
        <p className="text-muted-foreground">{t('processing_verification')}</p>
      </div>
    )
  }

  if (captchaState === 'closed') {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {t('geetest_command_title', 'Complete Verification')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('geetest_command_desc', 'Please complete the security check to continue.')}
            </p>
          </div>
          <p className="text-muted-foreground">{t('captcha_closed')}</p>
          <Button onClick={launchCaptcha}>{t('launch_captcha')}</Button>
          <ReturnToDiscord />
        </div>
      </PageContainer>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="mb-2 flex max-w-xs flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-5 text-center shadow-sm">
        <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          {t('geetest_command_title', 'Complete Verification')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('geetest_command_desc', 'Please complete the security check to continue.')}
        </p>
      </div>
      <LoadingSpinner size={32} />
      <p className="text-muted-foreground">{t('loading_captcha')}</p>
      <div id="geetest-captcha" />
    </div>
  )
}
