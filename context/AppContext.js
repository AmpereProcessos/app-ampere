import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { setCookie } from "nookies";
import Router from "next/router";
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [credentials, setCredentials] = useState(null);

  const isAuthenticated = !!credentials;

  useEffect(() => {}, []);
  async function signIn({ email, password }) {
    const { data } = await axios.post("/api/auth/login", {
      email,
      password,
    });
    setCookie(undefined, "credentials", data, {
      maxAge: 60 * 60 * 3, // 3 hours
    });
    setCredentials(data);
    Router.push("/");
  }
  console.log("AppContext", credentials);
  return (
    <AppContext.Provider value={{ isAuthenticated, signIn, credentials }}>
      {children}
    </AppContext.Provider>
  );
}
