import React, { useEffect, useRef } from "react";
import { FaUser, FaUserCircle, FaUsersCog } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "../components/providers/SessionProvider";
import { useRouter } from "next/navigation";
function ConfigDropDown({ closeConfigDropDown }) {
  const ref = useRef();
  const router = useRouter();
  const { session } = useSession({});

  function onClickOutside() {
    closeConfigDropDown();
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", (e) => handleClickOutside(e), true);
    return () => {
      document.removeEventListener("click", (e) => handleClickOutside(e), true);
    };
  }, [onClickOutside]);
  return (
    <div
      ref={ref}
      className="bg-background border-border fixed top-0 right-4 mt-12 flex w-40 flex-col rounded border py-1 shadow-lg"
    >
      {/* <Link href="/auth/perfil">
        <div className="flex items-center h-[50px] gap-2 cursor-pointer font-bold text-foreground  hover:bg-blue-200 w-full p-2 border-b border-border">
          <FaUserCircle style={{ fontSize: "25px" }} />
          <p className="text-sm self-center text-center">MEU USUÁRIO</p>
        </div>
      </Link> */}
      <div
        onClick={() => {
          router.push(`/auth/meuPerfil/${session.user.id}`);
        }}
        className="text-foreground border-border flex h-[50px] w-full cursor-pointer items-center gap-2 border-b p-2 font-bold hover:bg-blue-200"
      >
        <FaUser style={{ fontSize: "15px" }} />
        <p className="ml-4 self-center text-center text-sm">MEU PERFIL</p>
      </div>
      {/* <div
        onClick={() => {
          closeConfigDropDown()
          setNotificationIsOpen(true)
        }}
        className="flex h-[50px] w-full cursor-pointer items-center gap-2 border-b border-border  p-2 font-bold text-foreground hover:bg-blue-200 lg:hidden"
      >
        <MdNotifications style={{ fontSize: '25px' }} />
        <p className="self-center text-center text-sm">NOTIFICAÇÕES</p>
      </div> */}
      {session?.user.permissoes.usuarios.visualizar && (
        <Link href="/admin/usuarios">
          <div className="text-foreground border-border flex h-[50px] w-full cursor-pointer items-center gap-2 border-b p-2 font-bold hover:bg-blue-200">
            <FaUsersCog style={{ fontSize: "25px" }} />
            <p className="self-center text-center text-sm">CONTROLE DE USUÁRIOS</p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default ConfigDropDown;
