import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/10mega.png";
import { BiLogIn } from "react-icons/bi";
import {
  MdNotificationsNone,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import axios from "axios";
import NotificationModal from "./NotificationModal";
function Header({
  toggleSidebar,
  credentials,
  logout,
  notificacoes,
  getNotificacoes,
}) {
  const router = useRouter();
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
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
      </div>
      <Link href="/">
        <div className="flex cursor-pointer items-center justify-center">
          <Image width={"60px"} height={"60px"} src={WhiteLogo} />
        </div>
      </Link>
      <div className="flex justify-end items-center">
        <p className="hidden lg:block">
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
        <div
          onClick={() => setNotificationIsOpen(!notificationIsOpen)}
          className="flex cursor-pointer"
        >
          {notificacoes.length > 0 ? (
            <MdOutlineNotificationsActive
              style={{
                fontSize: "25px",
                marginLeft: "10px",
                color: "red",
              }}
            />
          ) : (
            <MdNotificationsNone
              style={{
                fontSize: "25px",
                marginLeft: "10px",
                color: "#fead61",
              }}
            />
          )}
          {notificacoes.length > 0 && (
            <p className="bg-red-500 rounded-full font-bold w-[20px] h-[20px] text-xs text-center">
              {notificacoes.length}
            </p>
          )}
        </div>
      </div>
      {notificationIsOpen && (
        <NotificationModal
          notificacoes={notificacoes}
          getNotificacoes={getNotificacoes}
        />
      )}
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
