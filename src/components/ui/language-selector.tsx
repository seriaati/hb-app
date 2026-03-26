import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUPPORTED_LOCALES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

interface LanguageSelectorProps {
  className?: string
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  // useTranslation() subscribes to language changes, so this component
  // re-renders whenever i18n.changeLanguage() resolves.
  const { i18n } = useTranslation()

  const currentLocale =
    SUPPORTED_LOCALES.find((l) => l.value === i18n.language) ??
    SUPPORTED_LOCALES.find((l) => l.value === 'en-US')!

  return (
    <Select
      value={i18n.language}
      onValueChange={(value) => {
        if (value) i18n.changeLanguage(value)
      }}
    >
      <SelectTrigger
        className={cn(
          'h-8 gap-1.5 border-0 bg-transparent px-2 text-muted-foreground',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        aria-label="Select language"
      >
        <Languages size={16} className="shrink-0" />
        <span className="text-sm">{currentLocale.nativeLabel}</span>
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false} className="min-w-52">
        {SUPPORTED_LOCALES.map((locale) => (
          <SelectItem key={locale.value} value={locale.value} className="pr-10">
            <span className="font-medium">{locale.nativeLabel}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
