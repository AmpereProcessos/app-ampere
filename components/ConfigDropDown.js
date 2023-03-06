import React from "react";
import { FaUser, FaUserCircle, FaUsersCog } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdNotifications } from "react-icons/md";
import { useRouter } from "next/router";
function ConfigDropDown({ setNotificationIsOpen, closeConfigDropDown }) {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="fixed flex flex-col rounded  w-40 bg-[#fff] border border-gray-200 mt-12 right-4 top-0 shadow-lg py-1">
      {/* <Link href="/auth/perfil">
        <div className="flex items-center h-[50px] gap-2 cursor-pointer font-bold text-gray-600  hover:bg-blue-200 w-full p-2 border-b border-gray-200">
          <FaUserCircle style={{ fontSize: "25px" }} />
          <p className="text-sm self-center text-center">MEU USUÁRIO</p>
        </div>
      </Link> */}
      <div
        onClick={() => {
          router.push(`/auth/meuPerfil/${session.user.id}`);
        }}
        className="flex items-center h-[50px] gap-2 cursor-pointer font-bold text-gray-600  hover:bg-blue-200 w-full p-2 border-b border-gray-200"
      >
        <FaUser style={{ fontSize: "15px" }} />
        <p className="text-sm self-center text-center ml-4">MEU PERFIL</p>
      </div>
      <div
        onClick={() => {
          closeConfigDropDown();
          setNotificationIsOpen(true);
        }}
        className="flex lg:hidden items-center h-[50px] gap-2 cursor-pointer font-bold text-gray-600  hover:bg-blue-200 w-full p-2 border-b border-gray-200"
      >
        <MdNotifications style={{ fontSize: "25px" }} />
        <p className="text-sm self-center text-center">NOTIFICAÇÕES</p>
      </div>
      {session?.user.manager && (
        <Link href="/admin/usuarios">
          <div className="flex items-center h-[50px] gap-2 cursor-pointer font-bold text-gray-600 hover:bg-blue-200 w-full p-2 border-b border-gray-200">
            <FaUsersCog style={{ fontSize: "25px" }} />
            <p className="text-sm self-center text-center">
              CONTROLE DE USUÁRIOS
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default ConfigDropDown;
