import React, { useContext, useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import HeaderSVG from "../utils/HeaderSVG.svg";
import { useRouter } from "next/router";
import WhiteLogo from "../utils/whiteLogoHD.png";
import AlertVolts from "../utils/alertVolts-svg.svg";
import SleepVolts from "../utils/sleepVolts-svg.svg";
import { BiLogIn } from "react-icons/bi";
import { TbPresentationAnalytics } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import {
  MdNotificationsNone,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import axios from "axios";
import NotificationModal from "./NotificationModal";

import { signOut, useSession } from "next-auth/react";
import { AppContext } from "../context/AppContext";
import ConfigDropDown from "./ConfigDropDown";
function Header({ toggleSidebar }) {
  const { notificacoes } = useContext(AppContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [configDropDown, setConfigDropDown] = useState(false);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  let unreadArr = notificacoes
    ? notificacoes.filter((x) => x.lido == false)
    : 0;
  const [unreadCount, setUnreadCount] = useState(unreadArr.length);
  {
    /**   useEffect(() => {
    axios
      .get("https://testefunctionsbeto.azurewebsites.net/api/frases-api")
      .then((res) => setFrase(res.data.texto));
  }, []);*/
  }
  function logout() {
    signOut();
  }
  function updateNotifications(id) {
    axios
      .put("/api/notificacoes/1", {
        id: id,
      })
      .then((res) => getNotificacoes(session.user.id));
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
  if (status == "loading" || status == "unauthenticated") return null;
  return (
    <div className="w-full sticky z-[1] top-0 bg-[#fff] grid grid-cols-3 items-center px-3 lg:px-12 h-[70px] border-b border-gray-200">
      {/* <div className="absolute w-full h-full -z-20">
        <Image src={HeaderSVG} layout="responsive" />
      </div> */}

      <div className="flex items-center gap-x-2">
        <FaBars
          onClick={toggleSidebar}
          style={{ fontSize: "23px", color: "#15599a", cursor: "pointer" }}
        />
      </div>

      <div className="flex cursor-pointer items-center justify-center h-[50px]">
        <Link href="/">
          <Image
            height={"50px"}
            width={"50px"}
            src={WhiteLogo}
            objectFit="fill"
          />
        </Link>
      </div>

      <div className="flex justify-end items-center">
        <p className="hidden lg:block">
          Seja bem vindo,{" "}
          <strong className="text-[#15599a]">{session?.user.name}</strong> !
        </p>
        {session.user.image ? (
          <div className="relative w-[40px] h-[40px] ml-2">
            <Image
              style={{ borderRadius: "100%", cursor: "pointer" }}
              src={session.user.image}
              alt="USUÁRIO"
              title="CONFIGURAÇÕES"
              fill={true}
              layout={"fill"}
              onClick={() => setConfigDropDown((prev) => !prev)}
            />
          </div>
        ) : (
          <div className="ml-2 rounded-full relative w-[40px] h-[40px] bg-gray-600 flex items-center justify-center cursor-pointer">
            <FaUser
              alt="USUÁRIO"
              title="CONFIGURAÇÕES"
              onClick={() => setConfigDropDown((prev) => !prev)}
              style={{ color: "white", fontSize: "15px" }}
            />
          </div>
        )}
        {configDropDown && (
          <ConfigDropDown
            closeConfigDropDown={() => setConfigDropDown(false)}
            setNotificationIsOpen={setNotificationIsOpen}
          />
        )}
        <div className="text-[#fead61] hover:text-orange-500 hover:scale-105 duration-500 ease-in-out">
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

        <div
          onClick={() => setNotificationIsOpen(!notificationIsOpen)}
          className="hidden:flex cursor-pointer items-center"
        >
          {unreadCount > 0 ? (
            <div className="flex items-center justify-center">
              <div className="hidden lg:flex items-center w-[25px] h-[22px] ml-2 hover:scale-105 duration-500 ease-in-out">
                <Image src={AlertVolts} />
              </div>
              <p className="hidden lg:flex mb-2 items-center justify-center bg-red-500 rounded-full font-bold w-[20px] h-[20px] text-xs text-center">
                {unreadCount}
              </p>
            </div>
          ) : (
            <div className="hidden lg:flex items-center w-[25px] h-[22px] ml-2 hover:scale-105 duration-500 ease-in-out">
              <Image src={SleepVolts} />
            </div>
          )}
        </div>
        {session?.user.manager && (
          <div className="hidden lg:block">
            <Link href="/admin/relatorioAdministrativo">
              <TbPresentationAnalytics
                style={{
                  fontSize: "25px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "#fead61",
                }}
              />
            </Link>
          </div>
        )}
      </div>
      {notificationIsOpen && (
        <NotificationModal setNotificationIsOpen={setNotificationIsOpen} />
      )}
    </div>
  );
}

export default Header;
