import React, { useContext, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useRouter } from "next/router";

import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import GeralSidebar from "./SidebarOptions/GeralSidebar";
import ObrasSidebar from "./SidebarOptions/ObrasSidebar";
import VendedorSidebar from "./SidebarOptions/VendedorSidebar";

const sidebar = {
  hidden: {
    x: "-45%",
    opacity: 0.3,
  },
  visible: {
    x: "0",
    opacity: 1,
  },
};

type SidebarProps = {
  sidebarVisible: boolean;
};
function Sidebar({ sidebarVisible }: SidebarProps) {
  const router = useRouter();
  const publicOrDocumentPath =
    router.pathname.includes("pdf") ||
    router.pathname.includes("publico") ||
    router.pathname.includes("auth");
  const { session, status } = useSession();

  if (status !== "authenticated" || publicOrDocumentPath) return null;
  return (
    <AnimatePresence>
      <motion.div
        variants={sidebar}
        initial="hidden"
        animate={sidebarVisible ? "visible" : "hidden"}
        style={{ maxHeight: "calc(100vh - 70px)" }}
        className="overscroll-y bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 border-border sticky top-[70px] flex w-full flex-col overflow-y-auto border-r px-2 py-4 lg:w-[250px]"
      >
        {session.user?.visualizacao.tipo === "OPERACIONAL" ? (
          <GeralSidebar session={session} />
        ) : null}
        {/* {session.user?.visualizacao.tipo === "EXECUÇÃO" ? <ObrasSidebar technicalTeam={session.user?.visualizacao.referencia} /> : null} */}
      </motion.div>
    </AnimatePresence>
  );
}

export default Sidebar;
