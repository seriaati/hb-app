import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { GachaBannerType } from '@/api/types'

interface GachaBannerTabsProps {
  bannerTypes: GachaBannerType[]
  currentBannerType: number
  onBannerTypeChange: (bannerType: number) => void
}

export function GachaBannerTabs({
  bannerTypes,
  currentBannerType,
  onBannerTypeChange,
}: GachaBannerTabsProps) {
  return (
    <Tabs
      value={String(currentBannerType)}
      onValueChange={(v) => onBannerTypeChange(Number(v))}
    >
      <TabsList className="flex-wrap h-auto gap-1">
        {bannerTypes.map((bt) => (
          <TabsTrigger key={bt.id} value={String(bt.id)}>
            {bt.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
