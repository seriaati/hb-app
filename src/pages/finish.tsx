import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAvailableAccounts, useSubmitAccounts } from '@/hooks/use-accounts'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { AccountCard } from '@/components/accounts/account-card'
import { PageContainer } from '@/components/layout/page-container'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { Button } from '@/components/ui/button'

export function FinishPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data, isLoading, error } = useAvailableAccounts()
  const submitAccounts = useSubmitAccounts()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (data?.status === 'device_info_required') {
      navigate('/device-info', { replace: true })
      return
    }
    if (data?.accounts) {
      setSelected(new Set(data.accounts.map((a) => `${a.game}_${a.uid}`)))
    }
  }, [data, navigate])

  function toggleAccount(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleSubmit() {
    submitAccounts.mutate(
      { selected_accounts: Array.from(selected) },
      {
        onSuccess: (result) => {
          handleLoginFlowResponse(result, navigate)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : t('failed_to_save_accounts'))
        },
      },
    )
  }

  if (isLoading) return <LoadingSpinner fullPage />

  if (error) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
              color: 'var(--destructive)',
              border: '1px solid color-mix(in oklch, var(--destructive) 25%, transparent)',
            }}
          >
            {error instanceof Error ? error.message : t('failed_to_load_accounts')}
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            {t('go_home')}
          </Button>
        </div>
      </PageContainer>
    )
  }

  const accounts = data?.accounts ?? []

  return (
    <PageContainer narrow>
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('select_accounts_title')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('select_accounts_desc')}
          </p>
        </div>

        {/* Account list */}
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'var(--muted)' }}
            >
              🎮
            </div>
            <p className="text-sm text-muted-foreground">{t('no_accounts_found')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {accounts.map((account) => {
              const key = `${account.game}_${account.uid}`
              return (
                <AccountCard
                  key={key}
                  account={account}
                  checked={selected.has(key)}
                  onCheckedChange={(checked) => toggleAccount(key, checked)}
                />
              )
            })}
          </div>
        )}

        {/* Selection controls */}
        {accounts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(new Set(accounts.map((a) => `${a.game}_${a.uid}`)))}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {t('select_all')}
            </button>
            <span className="text-border">·</span>
            <button
              onClick={() => setSelected(new Set())}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {t('deselect_all')}
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              {t('selected_count', {
                selected: selected.size,
                total: accounts.length,
              })}
            </span>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={submitAccounts.isPending || selected.size === 0}
          className="w-full h-10 font-semibold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {submitAccounts.isPending
            ? t('saving')
            : selected.size === 1
              ? t('add_accounts_button', { count: selected.size })
              : t('add_accounts_button_plural', { count: selected.size })}
        </Button>
      </div>
    </PageContainer>
  )
}
