import React, { useEffect } from "react";

function BancoDeOS({ credentials, setCredentials }) {
  function getOSS() {}
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.controller) {
        router.push("/");
      } else {
        getOSS();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.controller) {
          router.push("/");
        } else {
          getOSS();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <h1 className="font-bold text-lg text-[#fead61]">
        BANCO DE ORDENS DE SERVIÇO
      </h1>
    </div>
  );
}

export default BancoDeOS;
