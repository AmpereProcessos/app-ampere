import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmptyLogo from "../../utils/empty-logo.png";
import { signIn } from "next-auth/react";
function Auth() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });
  // function handleLogin() {
  //   axios.post("/api/auth/login", { email: user, password }).then((res) => {
  //     if (res.data.error) {
  //       setMessage(res.data.error);
  //     } else {
  //       if (res.data.credentials?.id) {
  //         let currentHour = new Date().getHours();
  //         let fixedDateInMS = new Date().setHours(currentHour + 3);
  //         localStorage.setItem(
  //           "credentials",
  //           JSON.stringify({
  //             ...res.data.credentials,
  //             maxSessionTime: new Date(fixedDateInMS).toISOString(),
  //           })
  //         );
  //         setCredentials(res.data.credentials);
  //         router.push("/");
  //       }
  //     }
  //   });
  // }
  async function handleSignIn(e) {
    e.preventDefault();
    if (user.trim().length == 0) {
      setMessage({
        text: "Por favor, preencha um email válido",
        color: "text-red-500",
      });
      return;
    } else if (password.trim().length == 0) {
      setMessage({
        text: "Por favor, preencha uma senha válida",
        color: "text-red-500",
      });
      return;
    } else {
      setMessage({
        text: "Aguarde um segundo enquanto validamos suas credenciais.",
        color: "text-[#15599a]",
      });
      let res = await signIn("credentials", {
        email: user,
        password: password,
        redirect: false,
      });
      if (res.status == 200) {
        setMessage({ text: "Redirecionando...", color: "text-green-500" });
        setTimeout(async () => {
          router.push("/");
        }, 500);
      } else {
        console.log(res);
        setMessage({ text: res.error, color: "text-red-500" });
      }
    }
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
                  placeholder="Email"
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
              <div className="flex items-center justify-start gap-2">
                <button
                  type="button"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={handleSignIn}
                >
                  Login
                </button>
                {message.text ? (
                  <p className={`text-lg text-center ${message.color}`}>
                    {message.text}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
