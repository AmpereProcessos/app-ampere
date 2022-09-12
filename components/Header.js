import React from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/whitelogo.png";
import { BiLogIn } from "react-icons/bi";
function Header({ toggleSidebar }) {
  const router = useRouter();
  if (router.pathname.includes("pdf")) return null;
  return (
    <div className="w-full bg-[#fff] grid grid-cols-3 items-center px-12 h-[70px] border-b border-gray-200">
      <FaBars
        onClick={toggleSidebar}
        style={{ fontSize: "23px", color: "#15599a", cursor: "pointer" }}
      />
      <Link href="/">
        <div className="flex cursor-pointer items-center justify-center">
          <Image width={"65px"} height={"65px"} src={WhiteLogo} />
        </div>
      </Link>
      <div className="flex justify-end items-center">
        <p>
          Seja bem vindo,{" "}
          <strong className="text-[#15599a]">Lucas Fernandes</strong> !
        </p>
        <BiLogIn
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
