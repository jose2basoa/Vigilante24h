import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vigilante 24h - Proteção Contínua',
  description: 'App de gravação contínua para proteção de motoristas. Grave, visualize e salve trechos importantes com detecção automática de impactos.',
  keywords: 'dashcam, segurança, gravação, motorista, proteção, vigilante',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}