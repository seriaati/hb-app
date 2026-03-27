import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GachaBannerTabsProps {
  bannerTypes: number[]
  currentBannerType: number
  onBannerTypeChange: (bannerType: number) => void
  game: string
}

export function GachaBannerTabs({
  bannerTypes,
  currentBannerType,
  onBannerTypeChange,
  game,
}: GachaBannerTabsProps) {
  const { t } = useTranslation()

  function getBannerLabel(bannerType: number, game: string): string {
    const labels: Record<string, Record<number, string>> = {
      genshin: {
        1: t('web.gacha_banner_permanent'),
        2: t('web.gacha_banner_character'),
        3: t('web.gacha_banner_weapon'),
        11: t('web.gacha_banner_chronicled'),
      },
      hkrpg: {
        1: t('web.gacha_banner_stellar'),
        2: t('web.gacha_banner_character'),
        6: t('web.gacha_banner_light_cone'),
        7: t('web.gacha_banner_departure'),
      },
      nap: {
        1: t('web.gacha_banner_standard'),
        2: t('web.gacha_banner_exclusive'),
        3: t('web.gacha_banner_w_engine'),
        5: t('web.gacha_banner_bangboo'),
      },
    }
    return labels[game]?.[bannerType] ?? t('web.gacha_banner_fallback', { type: bannerType })
  }

  return (
    <Tabs
      value={String(currentBannerType)}
      onValueChange={(v) => onBannerTypeChange(Number(v))}
    >
      <TabsList className="flex-wrap h-auto gap-1">
        {bannerTypes.map((bt) => (
          <TabsTrigger key={bt} value={String(bt)}>
            {getBannerLabel(bt, game)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
