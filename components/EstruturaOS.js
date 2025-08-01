import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../utils/images/signature-andrew.png";
import Logo from "../utils/images/logo-texto-azul-vertical.png";
function EstruturaOSPDF({ info, observacoesOS, servicoExecutado }) {
	return (
		<div className="w-[21cm] h-[29.7cm]  p-4 px-12">
			<h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO DE ESTRUTURA</h1>
			<div className="grid grid-cols-2">
				<div className="flex justify-between items-center">
					<Link href="/obras">
						<div className="flex justify-center items-center">
							<Image height="60px" width="60px" src={Logo} />
						</div>
					</Link>
					<div className="pl-2">
						<p className="text-center font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
					</div>
				</div>
				<div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
					<div className="flex justify-between border-black border-b">
						<p className="text-xs text-end pr-2">DATA DE ABERTURA</p>
						<p className="text-xs text-center pr-2">{new Date().toLocaleDateString()}</p>
					</div>
				</div>
			</div>
			<div className="border border-black mt-4">
				<h1 className="text-center my-2 font-bold">DADOS DO CLIENTE</h1>
				<div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
					<div className="grid-rows-3">
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Nome:</p>
							<p className="text-xs col-span-3 text-center border border-black">
								({info.qtde}) {info.nomeDoContrato}
							</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Endereço:</p>
							<p className="text-xs col-span-3 text-center border border-black border-t-0">{info.logradouro}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Telefone:</p>
							<p className="text-xs col-span-3 text-center border border-black border-t-0">{info.telefone}</p>
						</div>
					</div>
					<div className="grid-rows-3">
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Bairro:</p>
							<p className="text-xs col-span-3 text-center border border-black">{info.bairro}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Número:</p>
							<p className="text-xs col-span-3 text-center border border-black border-t-0">{info.numeroResidencia}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Cidade:</p>
							<p className="text-xs col-span-3 text-center border border-black border-t-0">{info.cidade}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="border border-black mt-3">
				<h1 className="text-center my-2 font-bold">DADOS DA INSTALAÇÃO</h1>
				<div className="flex h-full items-center justify-center">
					<div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
						<div className="grid grid-rows-4">
							<div className="row-span-2 grid grid-cols-5">
								<p className="text-xs text-center col-span-2 font-semibold uppercase">TIPO DA ESTRUTURA:</p>
								<p className="text-xs col-span-3 text-center border border-black">{info.estruturaPersonalizada.tipo}</p>
							</div>
							<div className="row-span-2 grid grid-cols-5">
								<p className="text-xs text-center col-span-2 font-semibold uppercase">TIPO DE TELHA:</p>
								<p className="text-xs text-center col-span-3 border border-black border-t-0">{info.visitaTecnica?.tipoDaTelha ? info.visitaTecnica?.tipoDaTelha : "-"} </p>
							</div>
						</div>
						<div className="grid grid-rows-4">
							<div className="row-span-2 grid grid-cols-4 h-full items-center">
								<p className="text-xs col-span-2 text-center font-semibold uppercase">NºMÓDULOS</p>
								<div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black border-b-0">
									<div>{info.sistema.qtdeModulos ? info.sistema.qtdeModulos : "-"}</div>
								</div>
							</div>
							<div className="row-span-2 grid grid-cols-4 h-full items-center">
								<p className="text-xs col-span-2 text-center font-semibold uppercase">RESPONSABILIDADE</p>
								<div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black">
									<div>{info.estruturaPersonalizada?.respInstalacao ? info.estruturaPersonalizada?.respInstalacao : "-"}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="border border-black mt-3">
				<h1 className="text-center  font-bold pt-1">OBSERVAÇÕES DA OS</h1>
				<div className="flex flex-col justify-center min-h-[50px] items-center">
					{servicoExecutado}
					{observacoesOS ? (
						<div className={`${observacoesOS.length > 370 ? "text-xxs" : "text-xs"} px-2 my-2 font-bold text-center`}>
							{observacoesOS ? observacoesOS.split("/").map((string, index) => <li key={`${string}-${index.toString()}`}>{string}</li>) : false}
						</div>
					) : (
						<p className="my-2">SEM OBSERVAÇÕES DE OS</p>
					)}
				</div>
			</div>
			<div className="border border-black mt-3 px-4 pb-4">
				<h1 className="text-center font-bold py-2">CONFERÊNCIA DOS CHECKLIST</h1>
				<div className="grid grid-cols-2 pb-2">
					<div className="grid grid-rows-2">
						{/** 
             *             <div className="flex gap-x-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">TROCA DO RAMAL FEITA ?</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">RELIGAÇÃO DA ENERGIA FEITA ?</p>
            </div>
            */}
					</div>
					<div className="grid grid-rows-2">
						<div className="flex mt-2 gap-x-2 items-center uppercase">
							<p className="text-xs">Data execução:</p>
							<p>____/____/_____</p>
						</div>
					</div>
				</div>
				<div className="mt-1 grid gap-x-4 grid-cols-2">
					<div className="flex flex-col">
						<p className="text-xs text-start">Autorizado por:</p>
						<div className="w-[150px] flex justify-center  items-centertext-center">
							<Image src={Assinatura} />
						</div>
						<hr className="border-t-2 border-black" />
						<p className="text-xs text-center">ASSINATURA DIRETOR DE ENGENHARIA</p>
					</div>
					<div className="flex flex-col">
						<p className="text-xs text-start">Realizado por:</p>
						<hr className="mt-12 border-t-2 border-black" />
						<p className="text-xs text-center">ASSINATURA TÉCNICO RESPONSÁVEL</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EstruturaOSPDF;
