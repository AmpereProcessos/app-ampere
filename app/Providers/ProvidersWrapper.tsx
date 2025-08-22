'use client'

import { SessionProvider } from '@/components/providers/SessionProvider'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from 'react-hot-toast'

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <>
      <SessionProvider>
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
