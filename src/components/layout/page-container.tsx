import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageSelector } from '@/components/ui/language-selector'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  return (
    <div className="relative min-h-screen bg-background bg-texture text-foreground">
      {/* Controls — fixed top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div
        className={cn(
          'mx-auto w-full px-4 py-10',
          narrow ? 'max-w-md' : 'max-w-2xl',
          className,
        )}
      >
        <div className="page-enter">
          {children}
        </div>
      </div>
    </div>
  )
}
