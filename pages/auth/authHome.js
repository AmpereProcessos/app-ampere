import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmptyLogo from "../../utils/empty-logo.png";
import { signIn } from "next-auth/react";
function Auth() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({
    text: "",
    color: "",
  });
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
    <section className="h-screen grow">
      <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-2 items-center h-full">
        <div className="flex items-center justify-center">
          <Image src={EmptyLogo}></Image>
        </div>
        <form className="h-full w-full items-center lg:items-start flex flex-col justify-start lg:justify-center px-6 lg:px-0">
          <input
            type="text"
            className="form-control mb-6 block w-full md:w-[400px] lg:w-[400px] xl:w-[500px] px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-6 block w-full md:w-[400px] lg:w-[400px] xl:w-[500px] px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-col justify-center lg:flex-row items-center lg:justify-start gap-2">
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
    </section>
  );
}

export default Auth;
