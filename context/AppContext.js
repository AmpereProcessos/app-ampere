import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
export const AppContext = createContext();

export function AppProvider({ children, pathname }) {
  const router = useRouter();
  const [credentials, setCredentials] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  function getUsers() {
    axios.get("/api/auth/user").then((res) => {
      setUsers(res.data);
    });
  }
  function getNotificacoes(id) {
    axios
      .get(`/api/notificacoes/${id}`)
      .then((res) => setNotificacoes(res.data));
  }
  useEffect(() => {
    if (!credentials) {
      var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
      if (storedCredentials != null) {
        setCredentials(storedCredentials);
        getUsers();
        getNotificacoes(storedCredentials._id);
      } else {
        if (!window.location.pathname.includes("publico"))
          Router.push("/auth/authHome");
      }
    } else {
      getNotificacoes(credentials._id);
      getUsers();
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (credentials) {
      getNotificacoes(credentials._id);
    }
  }, [router.pathname]);
  return (
    <AppContext.Provider
      value={{
        credentials,
        setCredentials,
        users,
        notificacoes,
        getNotificacoes,
      }}
    >
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
