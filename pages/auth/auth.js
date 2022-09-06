import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmptyLogo from "../../utils/empty-logo.png";
import axios from "axios";
function Auth({ setCredentials }) {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  function handleLogin() {
    axios.post("/api/auth", { user, password }).then((res) => {
      if (res.data.error) {
        setMessage(res.data.error);
      } else {
        if (res.data.credentials._id) {
          setCredentials(res.data.credentials);
          router.push("/");
        }
      }
    });
  }
  return (
    <section className="h-screen">
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="mr-4">
            <Image src={EmptyLogo}></Image>
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form>
              <div className="mb-6">
                <input
                  type="text"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Usuário"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center lg:text-left">
                <button
                  type="button"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </form>
            <div className="text-lg text-center text-red-500">
              {message && message}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
