import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Router from "next/router";
export const AppContext = createContext();

export function AppProvider({ children, pathname }) {
  const [credentials, setCredentials] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!credentials) {
      var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
      if (storedCredentials != null) {
        setCredentials(storedCredentials);
      } else {
        if (!window.location.pathname.includes("publico"))
          Router.push("/auth/authHome");
      }
    } else {
      return;
    }
    setLoaded(true);
  }, []);
  return (
    <AppContext.Provider value={{ credentials, setCredentials }}>
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
