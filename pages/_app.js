import "../styles/globals.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";
import axios from "axios";
function MyApp({ Component, pageProps }) {
  const [credentials, setCredentials] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const router = useRouter();
  function getNotificacoes(id) {
    axios
      .get(`/api/notificacoes/${id}`)
      .then((res) => setNotificacoes(res.data));
  }
  useEffect(() => {
    axios.get("/api/auth/user").then((res) => {
      setUsers(res.data);
    });
  }, []);
  useEffect(() => {
    if (Object.keys(credentials).length == 0) {
      var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
      if (storedCredentials != null) {
        getNotificacoes(storedCredentials._id);
        setCredentials(storedCredentials);
      }
    } else {
      getNotificacoes(credentials._id);
    }
    if (
      router.pathname.includes("pdf") ||
      router.pathname.includes("publico") ||
      router.pathname.includes("auth")
    )
      setSidebarVisible(false);
  }, [router.pathname]);
  return (
    <DndProvider backend={HTML5Backend}>
      <title>Sistema - Ampère Energias</title>
      {credentials != {} ? (
        <div className="flex flex-col bg-[#fff] w-screen max-w-full xl:min-h-[100vh] min-h-[100vh]">
          <Header
            logout={() => {
              localStorage.removeItem("credentials");
              router.push("/auth/authHome");
              setCredentials({});
            }}
            credentials={credentials}
            notificacoes={notificacoes}
            getNotificacoes={getNotificacoes}
            toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          />
          <div className="flex min-h-[100%] grow">
            {sidebarVisible && <Sidebar credentials={credentials} />}
            <div
              className={`${
                sidebarVisible ? "hidden md:flex md:flex-col" : "flex flex-col"
              } grow w-full`}
            >
              <Component
                users={users}
                sidebarVisible={sidebarVisible}
                toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
                setCredentials={setCredentials}
                credentials={credentials}
                {...pageProps}
              />
            </div>
          </div>
        </div>
      ) : (
        <Component
          users={users}
          sidebarVisible={sidebarVisible}
          toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          setCredentials={setCredentials}
          credentials={credentials}
          {...pageProps}
        />
      )}
    </DndProvider>
  );
}

export default MyApp;
