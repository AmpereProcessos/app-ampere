import React, { useEffect, useRef } from "react";
import { FaUser, FaUserCircle, FaUsersCog } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdNotifications } from "react-icons/md";
import { useRouter } from "next/router";
function ConfigDropDown({ closeConfigDropDown }) {
	const ref = useRef();
	const router = useRouter();
	const { data: session } = useSession();

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
		<div ref={ref} className="fixed right-4 top-0 mt-12  flex w-40 flex-col rounded border border-gray-300 bg-[#fff] py-1 shadow-lg">
			{/* <Link href="/auth/perfil">
        <div className="flex items-center h-[50px] gap-2 cursor-pointer font-bold text-gray-600  hover:bg-blue-200 w-full p-2 border-b border-gray-300">
          <FaUserCircle style={{ fontSize: "25px" }} />
          <p className="text-sm self-center text-center">MEU USUÁRIO</p>
        </div>
      </Link> */}
			<div
				onClick={() => {
					router.push(`/auth/meuPerfil/${session.user.id}`);
				}}
				className="flex h-[50px] w-full cursor-pointer items-center gap-2 border-b  border-gray-300 p-2 font-bold text-gray-600 hover:bg-blue-200"
			>
				<FaUser style={{ fontSize: "15px" }} />
				<p className="ml-4 self-center text-center text-sm">MEU PERFIL</p>
			</div>
			{/* <div
        onClick={() => {
          closeConfigDropDown()
          setNotificationIsOpen(true)
        }}
        className="flex h-[50px] w-full cursor-pointer items-center gap-2 border-b border-gray-300  p-2 font-bold text-gray-600 hover:bg-blue-200 lg:hidden"
      >
        <MdNotifications style={{ fontSize: '25px' }} />
        <p className="self-center text-center text-sm">NOTIFICAÇÕES</p>
      </div> */}
			{session?.user.permissoes.usuarios.visualizar && (
				<Link href="/admin/usuarios">
					<div className="flex h-[50px] w-full cursor-pointer items-center gap-2 border-b border-gray-300 p-2 font-bold text-gray-600 hover:bg-blue-200">
						<FaUsersCog style={{ fontSize: "25px" }} />
						<p className="self-center text-center text-sm">CONTROLE DE USUÁRIOS</p>
					</div>
				</Link>
			)}
		</div>
	);
}

export default ConfigDropDown;
