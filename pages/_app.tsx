import '../styles/globals.css'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/Sidebar'
import { cn } from '@/lib/utils'
import { SessionProvider } from '@/components/providers/SessionProvider'
import AppHead from '@/components/Head/index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Raleway } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

// If loading a variable font, you don't need to specify the font weight
const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['cyrillic', 'cyrillic-ext'],
})

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  const queryClient = new QueryClient()
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <>
      <SessionProvider>
        <AppHead />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <DndProvider backend={HTML5Backend}>
              <div className={cn(`bg-background flex min-h-screen w-screen max-w-full flex-col xl:min-h-screen ${raleway.variable}`)}>
                <Header toggleSidebar={() => setSidebarVisible((prev) => !prev)} />
                <div className="flex min-h-full grow">
                  {sidebarVisible ? <Sidebar sidebarVisible={sidebarVisible} /> : null}
                  <div
                    style={{
                      width: sidebarVisible ? 'calc(100vw - 250px)' : '100%',
                    }}
                    data-expanded={!!sidebarVisible ? 'true' : 'false'}
                    className={`${sidebarVisible ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'} grow`}
                  >
                    <Component sidebarVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible((prev) => !prev)} {...pageProps} />
                    <Toaster />
                  </div>
                </div>
              </div>
            </DndProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
