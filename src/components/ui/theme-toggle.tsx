import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md',
        'text-muted-foreground transition-colors duration-200',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      aria-label="Toggle theme"
    >
      <Sun
        size={16}
        className="absolute transition-all duration-300 ease-out dark:opacity-0 dark:rotate-90 dark:scale-50"
      />
      <Moon
        size={16}
        className="absolute opacity-0 rotate-90 scale-50 transition-all duration-300 ease-out dark:opacity-100 dark:rotate-0 dark:scale-100"
      />
    </button>
  )
}
