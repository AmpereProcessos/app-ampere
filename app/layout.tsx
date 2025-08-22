import '@/styles/globals.css'
import type { Metadata } from 'next'
import ProvidersWrapper from './Providers/ProvidersWrapper'
import AppRouterHead from '@/components/Head/AppRouterHead'

export const metadata: Metadata = {
  title: 'App Ampère',
  description: 'Bem vindo ao App Ampère !',
}
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <AppRouterHead />
      <body>
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  )
}
