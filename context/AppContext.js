import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Router from "next/router";
export const AppContext = createContext();

export function AppProvider({ children, pathname }) {
  const [credentials, setCredentials] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  function getUsers() {
    axios.get("/api/auth/user").then((res) => {
      setUsers(res.data);
    });
  }
  useEffect(() => {
    if (!credentials) {
      var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
      if (storedCredentials != null) {
        setCredentials(storedCredentials);
        getUsers();
      } else {
        if (!window.location.pathname.includes("publico"))
          Router.push("/auth/authHome");
      }
    } else {
      getUsers();
    }
    setLoaded(true);
  }, []);
  return (
    <AppContext.Provider value={{ credentials, setCredentials, users }}>
      {loaded
        ? credentials ||
          window.location.pathname.includes("/auth/authHome") ||
          window.location.pathname.includes("publico")
          ? children
          : false
        : false}
    </AppContext.Provider>
  );
}
AppProvider.getInitialProps = async (ctx) => {
  const { req, query, res, asPath, pathname } = ctx;
  console.log(pathname);
  return { pathname: pathname };
};
