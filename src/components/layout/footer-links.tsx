import { useTranslation } from 'react-i18next'
import { PRIVACY_POLICY_URL, getAccountSecurityUrl } from '@/lib/constants'

interface FooterLinksProps {
  className?: string
}

/**
 * Renders Privacy Policy and Account Security documentation links.
 * The docs link is locale-aware — it points to the translated docs page
 * when the user's current language is supported, otherwise falls back to English.
 */
export function FooterLinks({ className }: FooterLinksProps) {
  const { t, i18n } = useTranslation()
  const accountSecurityUrl = getAccountSecurityUrl(i18n.language)

  return (
    <div className={className}>
      <a
        href={PRIVACY_POLICY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
      >
        {t('privacy_policy', 'Privacy Policy')}
      </a>
      <span className="text-xs text-muted-foreground/50 mx-1.5">
        {t('footer_links_separator', '·')}
      </span>
      <a
        href={accountSecurityUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
      >
        {t('account_security_docs', 'Account Security')}
      </a>
    </div>
  )
}
