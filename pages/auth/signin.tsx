import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmptyLogo from "../../utils/images/logo-texto-branco.png";
import { signIn } from "next-auth/react";
import { AiFillThunderbolt } from "react-icons/ai";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/methods/handlers";
function Auth() {
	const router = useRouter();

	const [credentials, setCredentials] = useState<{ email: string; password: string }>({
		email: "",
		password: "",
	});
	async function handleSignIn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		const loadingToastId = toast.loading("Processando...");
		try {
			if (credentials.email.trim().length == 0) return toast.error("Preencha o campo de email...");
			if (credentials.password.trim().length == 0) return toast.error("Preencha o campo de senha...");
			const signInResponse = await signIn("credentials", {
				email: credentials.email,
				password: credentials.password,
				redirect: false,
			});
			toast.dismiss();
			if (!signInResponse) return toast.error("Erro ao tentar autenticação.");
			if (!signInResponse?.ok) return toast.error(signInResponse?.error || "Erro ao tentar autenticação.");
			return router.push("/");
		} catch (error) {
			toast.dismiss(loadingToastId);
			const msg = getErrorMessage(error);
			return toast.error(msg);
		}

		// if (res.status == 200) {
		//   setMessage({ text: 'Redirecionando...', color: 'text-green-500' })
		//   setTimeout(async () => {
		//     router.push('/')
		//   }, 500)
		// } else {
		//   console.log(res)
		//   setMessage({ text: res.error, color: 'text-red-500' })
		// }
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center bg-[#15599a] p-3 lg:flex-row">
			<div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-2/3 lg:px-4 lg:py-6">
				<Image src={EmptyLogo} width={450} height={450} alt="Logo Ampère" />
				{/* <h1 className="w-full text-center text-2xl font-black text-white lg:text-5xl">Sistema Ampère Energias</h1> */}
				<h1 className="w-full text-center font-raleway text-xl font-black text-white lg:text-3xl">
					A ENERGIA QUE MOVE O MUNDO <strong className="text-[#fead41]">VEM DE VOCÊ !</strong>
				</h1>
			</div>
			<div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-10 lg:w-1/3">
				<div className="font-Inter flex w-full items-center justify-center gap-2">
					<h1 className="text-3xl font-black text-cyan-500">Seja bem vindo !</h1>
					<AiFillThunderbolt size={27} color="#fead41" />
				</div>
				<div className="flex w-full  grow flex-col items-center justify-center">
					<h1 className="font-Inter mt-4 w-full text-start text-xl font-bold leading-none tracking-tight">Faça aqui o seu login</h1>
					<div className="mt-4 w-full">
						<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
							Email
						</label>
						<input
							value={credentials.email}
							onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
							type="text"
							name="email"
							id="email"
							className="block w-full rounded-lg  border border-gray-300 p-2.5 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
							placeholder="seuemail@email.com"
						/>
					</div>
					<div className="mt-4 w-full">
						<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
							Senha
						</label>
						<input
							value={credentials.password}
							onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							className="block w-full rounded-lg  border border-gray-300 p-2.5 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
						/>
					</div>
					<div className="mt-3 flex w-full items-center justify-end">
						<button onClick={(e) => handleSignIn(e)} className="rounded-md border border-black px-6 py-2 font-medium duration-300 ease-in-out hover:bg-black hover:text-white">
							Entrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Auth;
