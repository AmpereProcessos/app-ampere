"use client";

import AppRouterSidebar from "@/components/AppRouterSidebar";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();
	const [sidebarVisible, setSidebarVisible] = useState(false);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<div className="font-raleway bg-background flex min-h-screen w-screen max-w-full flex-col xl:min-h-screen">
					<Header toggleSidebar={() => setSidebarVisible((prev) => !prev)} />
					<div className="flex min-h-full grow">
						{sidebarVisible ? <AppRouterSidebar sidebarVisible={sidebarVisible} /> : null}
						<div
							style={{
								width: sidebarVisible ? "calc(100vw - 250px)" : "100%",
							}}
							data-expanded={!!sidebarVisible ? "true" : "false"}
							className={`${sidebarVisible ? "hidden lg:flex lg:flex-col" : "flex flex-col"} grow`}
						>
							{children}
							<Toaster />
						</div>
					</div>
				</div>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default ProvidersWrapper;
