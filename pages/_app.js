import "../styles/globals.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";
import axios from "axios";
import { AppContext, AppProvider } from "../context/AppContext";
import { SessionProvider } from "next-auth/react";
import AppHead from "../components/Head/index";
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [credentials, setCredentials] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (
      router.pathname.includes("pdf") ||
      router.pathname.includes("publico") ||
      router.pathname.includes("auth")
    ) {
      setSidebarVisible(false);
    }
  }, [router.pathname]);
  return (
    <>
      <SessionProvider session={session}>
        <AppHead />
        <DndProvider backend={HTML5Backend}>
          <AppProvider>
            <div className="flex flex-col bg-[#fff] w-screen max-w-full xl:min-h-[100vh] min-h-[100vh]">
              <Header
                credentials={credentials}
                notificacoes={notificacoes}
                toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
              />
              <div className="flex min-h-[100%] grow">
                {sidebarVisible && (
                  <Sidebar
                    sidebarVisible={sidebarVisible}
                    credentials={credentials}
                  />
                )}
                <div
                  className={`${
                    sidebarVisible
                      ? "hidden md:flex md:flex-col"
                      : "flex flex-col"
                  } grow w-full`}
                >
                  <Component
                    sidebarVisible={sidebarVisible}
                    toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
                    setCredentials={setCredentials}
                    credentials={credentials}
                    {...pageProps}
                  />
                </div>
              </div>
            </div>
          </AppProvider>
        </DndProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
