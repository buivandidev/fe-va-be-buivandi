import type { Metadata } from 'next'
import { Be_Vietnam_Pro, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { env } from '@/lib/config/environment'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: env.appName,
  description: 'Nền tảng tích hợp dịch vụ công trực tuyến và tin tức dân sinh',
  keywords: ['dịch vụ công', 'phường xã', 'chính quyền điện tử', 'tin tức'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: env.appName,
    description: 'Nền tảng tích hợp dịch vụ công trực tuyến',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${ibmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
