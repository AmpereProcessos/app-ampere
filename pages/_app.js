import '../styles/globals.css'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/router'

import { SessionProvider } from 'next-auth/react'
import AppHead from '../components/Head/index'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'
import { cn } from '../lib/utils'
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  const queryClient = new QueryClient()
  const [sidebarVisible, setSidebarVisible] = useState(false)

  // useEffect(() => {
  //   if (router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')) {
  //     setSidebarVisible(false)
  //   }
  // }, [router.pathname])
  return (
    <>
      <SessionProvider session={session}>
        <AppHead />
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={HTML5Backend}>
            <div className={`flex min-h-[100vh] w-screen max-w-full flex-col bg-[#fff] font-[Inter] xl:min-h-[100vh] ${inter.className}`}>
              <Header toggleSidebar={() => setSidebarVisible((prev) => !prev)} />
              <div className="flex min-h-[100%] grow ">
                {sidebarVisible ? <Sidebar sidebarVisible={sidebarVisible} /> : null}
                <div
                  style={{
                    width: sidebarVisible ? 'calc(100vw - 250px)' : '100%',
                  }}
                  data-expanded={!!sidebarVisible ? 'true' : 'false'}
                  className={cn('flex grow flex-col', {
                    'hidden lg:flex': sidebarVisible,
                  })}
                >
                  <Component sidebarVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible((prev) => !prev)} {...pageProps} />
                  <Toaster />
                </div>
              </div>
            </div>
          </DndProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
