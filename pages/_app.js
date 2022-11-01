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
function MyApp({ Component, pageProps }) {
  const [credentials, setCredentials] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(credentials).length == 0) {
      var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
      if (storedCredentials == null) {
        router.push("/auth/authHome");
      } else {
        setCredentials(storedCredentials);
      }
    }
  }, [Component]);
  console.log(credentials);
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
            toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          />
          <div className="flex min-h-[100%] grow">
            {sidebarVisible && <Sidebar credentials={credentials} />}
            <div className="flex flex-col grow w-full">
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
      ) : (
        <Component
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
