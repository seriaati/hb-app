import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { router } from './router'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}
