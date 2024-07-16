'use client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SessionProvider } from 'next-auth/react'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from 'react-hot-toast'

function ProvidersWrapper({ children, session }: { children: React.ReactNode; session: any }) {
  const queryClient = new QueryClient()
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <div className="font-Inter flex min-h-[100vh] w-screen max-w-full  flex-col bg-[#fff] xl:min-h-[100vh]">
            <Header toggleSidebar={() => setSidebarVisible((prev) => !prev)} />
            <div className="flex min-h-[100%] grow">
              {sidebarVisible ? <Sidebar sidebarVisible={sidebarVisible} /> : null}
              <div
                style={{
                  width: sidebarVisible ? 'calc(100vw - 250px)' : '100%',
                }}
                data-expanded={!!sidebarVisible ? 'true' : 'false'}
                className={`${sidebarVisible ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'} grow`}
              >
                {children}
                <Toaster />
              </div>
            </div>
          </div>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default ProvidersWrapper
