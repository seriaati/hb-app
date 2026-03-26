import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  fullPage?: boolean
  className?: string
  size?: number
}

export function LoadingSpinner({ fullPage = false, className, size = 24 }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: '0.9s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="28 56"
          className="text-accent"
        />
      </svg>
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background bg-texture">
        {spinner}
        <p className="text-xs tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading
        </p>
      </div>
    )
  }

  return spinner
}
