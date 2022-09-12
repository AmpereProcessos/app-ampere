import "../styles/globals.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
function MyApp({ Component, pageProps }) {
  const [credentials, setCredentials] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  return (
    <DndProvider backend={HTML5Backend}>
      {credentials.nome ? (
        <div className="flex flex-col bg-[#fff] w-screen max-w-full xl:min-h-[100vh] min-h-[100vh]">
          <Header
            logout={() => {
              localStorage.removeItem("credentials");
              setCredentials({});
            }}
            credentials={credentials}
            toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          />
          <div className="flex min-h-[100%] grow">
            <Sidebar sidebarVisible={sidebarVisible} />
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
