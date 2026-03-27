import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GachaFiltersProps {
  selectedRarities: number[]
  onRaritiesChange: (rarities: number[]) => void
  nameSearch: string
  onNameSearchChange: (search: string) => void
}

const RARITIES = [5, 4, 3, 2]

export function GachaFilters({
  selectedRarities,
  onRaritiesChange,
  nameSearch,
  onNameSearchChange,
}: GachaFiltersProps) {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(nameSearch)

  // Debounce name search
  useEffect(() => {
    const timer = setTimeout(() => {
      onNameSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onNameSearchChange])

  function toggleRarity(rarity: number) {
    if (selectedRarities.includes(rarity)) {
      onRaritiesChange(selectedRarities.filter((r) => r !== rarity))
    } else {
      onRaritiesChange([...selectedRarities, rarity])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">{t('rarity_label')}</span>
        {RARITIES.map((rarity) => (
          <div key={rarity} className="flex items-center gap-1.5">
            <Checkbox
              id={`rarity-${rarity}`}
              checked={selectedRarities.includes(rarity)}
              onCheckedChange={() => toggleRarity(rarity)}
            />
            <Label htmlFor={`rarity-${rarity}`} className="cursor-pointer text-sm">
              {rarity}★
            </Label>
          </div>
        ))}
      </div>

      <div className="flex-1 min-w-50">
        <Input
          placeholder={t('search_by_name')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-8"
        />
      </div>
    </div>
  )
}
