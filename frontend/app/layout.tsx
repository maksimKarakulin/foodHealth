import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Health App',
  description: 'Modern Food Health Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white")}>
        <AuthProvider>
          <ErrorBoundary>
            <main className="container mx-auto px-4 py-10">
              {children}
            </main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
