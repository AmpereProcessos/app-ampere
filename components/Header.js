import React from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/whitelogo.png";
import { BiLogIn } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
function Header({ toggleSidebar, credentials, logout }) {
  const router = useRouter();
  if (router.pathname.includes("pdf") || router.pathname.includes("publico"))
    return null;
  return (
    <div className="w-full sticky top-0 bg-[#fff] grid grid-cols-3 items-center px-12 h-[70px] border-b border-gray-200">
      <FaBars
        onClick={toggleSidebar}
        style={{ fontSize: "23px", color: "#15599a", cursor: "pointer" }}
      />
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
        )}
      </div>
    </div>
  );
}

export default Header;
