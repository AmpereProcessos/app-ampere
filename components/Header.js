import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/whitelogo.png";
import { BiLogIn } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
function Header({ toggleSidebar, credentials, logout }) {
  const router = useRouter();
  const [frase, setFrase] = useState("");
  {
    /**   useEffect(() => {
    axios
      .get("https://testefunctionsbeto.azurewebsites.net/api/frases-api")
      .then((res) => setFrase(res.data.texto));
  }, []);*/
  }

  if (
    router.pathname.includes("pdf") ||
    router.pathname.includes("publico") ||
    router.pathname.includes("ordemDeServico") ||
    router.pathname.includes("auth")
  )
    return null;
  return (
    <div className="w-full sticky z-[1] top-0 bg-[#fff] grid grid-cols-3 items-center px-12 h-[70px] border-b border-gray-200">
      <div className="flex items-center gap-x-2">
        <FaBars
          onClick={toggleSidebar}
          style={{ fontSize: "23px", color: "#15599a", cursor: "pointer" }}
        />
        {/*<p className="hidden lg:block font-bold ml-12 italic font-raleway w-[450px]">
          "{frase}" - Matheus Oliveira
  </p>*/}
      </div>
      <Link href="/">
        <div className="flex cursor-pointer items-center justify-center">
          <Image width={"65px"} height={"65px"} src={WhiteLogo} />
        </div>
      </Link>
      <div className="hidden lg:flex justify-end items-center">
        <p>
          Seja bem vindo,{" "}
          <strong className="text-[#15599a]">{credentials?.nome}</strong> !
        </p>
        <BiLogIn
          onClick={logout}
          style={{
            fontSize: "25px",
            marginLeft: "10px",
            cursor: "pointer",
            color: "#fead61",
          }}
        />
      </div>
    </div>
  );
}

export default Header;
{
  /*
        {credentials.manager && (
          <Link href="/admin/users">
            <MdAdminPanelSettings
              style={{
                fontSize: "25px",
                marginLeft: "10px",
                cursor: "pointer",
                color: "#fead61",
              }}
            />
          </Link>
        )} */
}
