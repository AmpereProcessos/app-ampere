import "@/styles/globals.css";
import AppRouterHead from "@/components/Head/AppRouterHead";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ProvidersWrapper from "./Providers/ProvidersWrapper";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});
export const metadata: Metadata = {
  title: "App Ampère",
  description: "Bem vindo ao App Ampère !",
};
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // next-themes sets the theme class on <html> before hydration
    <html lang="pt-BR" className={raleway.variable} suppressHydrationWarning>
      <AppRouterHead />
      <body>
        <NuqsAdapter>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}
