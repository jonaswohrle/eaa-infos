import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PortalShell } from '@/components/portal-shell'
import { hidePocUsers } from '@/flags'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'EAA Infos — Enterprise Agents & Apps',
    template: '%s · EAA Infos',
  },
  description:
    'The case for giving AI-built applications a governed home: the target operating model, how the alternatives compare across the lifecycle, and a reusable business case.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const shouldHidePocUsers = await hidePocUsers()
  const hiddenStepKeys = shouldHidePocUsers ? ['poc-users'] : []

  return (
    <html lang="en" className={`light ${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased">
        <PortalShell hiddenStepKeys={hiddenStepKeys}>{children}</PortalShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
