import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono-geist',
})

export const metadata: Metadata = {
  title: 'AURORA — Offline-First City Discovery',
  description:
    'Discover attractions, food, culture and events around Dubai, then auto-build your perfect day. Works fully offline, no account needed.',
  generator: 'v0.app',
  applicationName: 'AURORA',
  appleWebApp: {
    capable: true,
    title: 'AURORA',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${jakarta.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
