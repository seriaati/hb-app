import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <div
            className="rounded-xl px-6 py-5 text-sm max-w-md w-full"
            style={{
              background: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
              color: 'var(--destructive)',
              border: '1px solid color-mix(in oklch, var(--destructive) 25%, transparent)',
            }}
          >
            <p className="font-semibold mb-1">Something went wrong</p>
            <p className="text-xs opacity-80 break-words">{this.state.error.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
