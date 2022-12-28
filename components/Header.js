import React, { useContext, useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/felizAnoNovo.png";
import AlertVolts from "../utils/alertVolts-svg.svg";
import SleepVolts from "../utils/sleepVolts-svg.svg";
import { BiLogIn } from "react-icons/bi";
import { TbPresentationAnalytics } from "react-icons/tb";
import {
  MdNotificationsNone,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import axios from "axios";
import NotificationModal from "./NotificationModal";
import { AppContext } from "../context/AppContext";
function Header({ toggleSidebar }) {
  const { setCredentials, credentials, notificacoes, getNotificacoes } =
    useContext(AppContext);
  const router = useRouter();
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  let unreadArr = notificacoes
    ? notificacoes.filter((x) => x.lido == false)
    : 0;
  console.log(unreadArr.length);
  const [unreadCount, setUnreadCount] = useState(unreadArr.length);
  console.log(unreadCount);
  {
    /**   useEffect(() => {
    axios
      .get("https://testefunctionsbeto.azurewebsites.net/api/frases-api")
      .then((res) => setFrase(res.data.texto));
  }, []);*/
  }
  function logout() {
    setCredentials(null);
    localStorage.removeItem("credentials");
    router.push("/auth/authHome");
  }
  function updateNotifications(id) {
    axios
      .put("/api/notificacoes/1", {
        id: id,
      })
      .then((res) => getNotificacoes(credentials._id));
  }
  useEffect(() => {
    let unreadArr = notificacoes
      ? notificacoes.filter((x) => x.lido == false)
      : 0;
    setUnreadCount(unreadArr.length);
  }, [notificacoes]);
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
        <div className="flex cursor-pointer items-center justify-center h-[50px]">
          <Image
            height={"50px"}
            width={"183px"}
            src={WhiteLogo}
            objectFit="fill"
          />
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
          {unreadCount > 0 ? (
            <div className="flex items-center w-[25px] h-[22px] ml-2">
              <Image src={AlertVolts} />
            </div>
          ) : (
            <div className="flex items-center w-[25px] h-[22px] ml-2">
              <Image src={SleepVolts} />
            </div>
          )}
          {unreadCount > 0 && (
            <p className="bg-red-500 rounded-full font-bold w-[20px] h-[20px] text-xs text-center">
              {unreadCount}
            </p>
          )}
        </div>
        {credentials.manager && (
          <Link href="/admin/reports">
            <TbPresentationAnalytics
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
      {notificationIsOpen && <NotificationModal />}
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
