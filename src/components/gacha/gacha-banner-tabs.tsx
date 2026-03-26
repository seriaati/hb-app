import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GachaBannerTabsProps {
  bannerTypes: number[]
  currentBannerType: number
  onBannerTypeChange: (bannerType: number) => void
  game: string
}

function getBannerLabel(bannerType: number, game: string): string {
  const labels: Record<string, Record<number, string>> = {
    genshin: {
      1: 'Permanent',
      2: 'Character',
      3: 'Weapon',
      11: 'Chronicled',
    },
    hkrpg: {
      1: 'Stellar',
      2: 'Character',
      6: 'Light Cone',
      7: 'Departure',
    },
    nap: {
      1: 'Standard',
      2: 'Exclusive',
      3: 'W-Engine',
      5: 'Bangboo',
    },
  }
  return labels[game]?.[bannerType] ?? `Banner ${bannerType}`
}

export function GachaBannerTabs({
  bannerTypes,
  currentBannerType,
  onBannerTypeChange,
  game,
}: GachaBannerTabsProps) {
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
