import "../styles/globals.css";

import AppHead from "@/components/Head/index";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/layout/Header";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Html } from "next/document";
import { Raleway } from "next/font/google";
import { useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

import { Toaster } from "react-hot-toast";

// If loading a variable font, you don't need to specify the font weight
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  const queryClient = new QueryClient();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  console.log("TESTING");
  return (
    <>
      <AppHead />
      <QueryClientProvider client={queryClient}>
        <ConvexClientProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main
                className={cn(
                  "bg-background flex min-h-screen w-screen max-w-full flex-col xl:min-h-screen",
                  raleway.variable,
                  raleway.className,
                )}
              >
                <Header toggleSidebar={() => setSidebarVisible((prev) => !prev)} />
                <div className="flex min-h-full grow">
                  {sidebarVisible ? <Sidebar sidebarVisible={sidebarVisible} /> : null}
                  <div
                    style={{
                      width: sidebarVisible ? "calc(100vw - 250px)" : "100%",
                    }}
                    data-expanded={sidebarVisible ? "true" : "false"}
                    className={`${sidebarVisible ? "hidden lg:flex lg:flex-col" : "flex flex-col"} grow`}
                  >
                    <Component
                      sidebarVisible={sidebarVisible}
                      toggleSidebar={() => setSidebarVisible((prev) => !prev)}
                      {...pageProps}
                    />
                    <Toaster />
                  </div>
                </div>
              </main>
            </ThemeProvider>
          </NuqsAdapter>
        </ConvexClientProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
