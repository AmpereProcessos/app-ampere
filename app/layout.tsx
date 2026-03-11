import "@/styles/globals.css";
import AppRouterHead from "@/components/Head/AppRouterHead";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ProvidersWrapper from "./Providers/ProvidersWrapper";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});
export const metadata: Metadata = {
  title: "App Ampère",
  description: "Bem vindo ao App Ampère !",
};
export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  console.log(session.user?.visualizacao.tipo);
  if (session.user?.visualizacao.tipo === "EXECUÇÃO") return redirect("/ordens-de-servico/roteiro");
  return (
    <html lang="pt-BR" className={raleway.variable}>
      <AppRouterHead />
      <body>
        <NuqsAdapter>
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}
