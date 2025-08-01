import React from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../utils/images/signature-andrew.png";
import Logo from "../utils/images/logo-texto-azul-vertical.png";
import type { TServiceOrderDTO } from "@/utils/schemas/service-order";
import ObservationsDocumentBlock from "./identificador/ordensDeServico/ObservationsDocumentBlock";

type OSCorretivaPDFProps = {
	order: TServiceOrderDTO;
};
function OSCorretivaPDF({ order }: OSCorretivaPDFProps) {
	return (
		<div className="h-[29.7cm] w-[21cm]  p-4 px-12">
			<h1 className="mb-6 text-center text-xl font-bold">ORDEM DE SERVIÇO - {order.categoria}</h1>
			<div className="grid grid-cols-2">
				<div className="flex items-center justify-between">
					<Link href="/">
						<div className="flex items-center justify-center">
							<Image height={60} width={60} src={Logo} alt="Logo" />
						</div>
					</Link>
					<div className="pl-2">
						<p className="text-center font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
					</div>
				</div>
				<div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
					<div className="flex justify-between border-b border-black">
						<p className="pr-2 text-end text-xs">DATA DE ABERTURA</p>
						<p className="pr-2 text-center text-xs">{order.dataInsercao ? new Date(order.dataInsercao).toLocaleDateString("pt-br") : "-"}</p>
					</div>
				</div>
			</div>
			<div className="mt-4 border border-black">
				<h1 className="my-2 text-center font-bold">DADOS DO CLIENTE</h1>
				<div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
					<div className="grid-rows-3">
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Nome:</p>
							<p className="col-span-3 border border-black text-center text-xs">
								{order.projeto.identificador || ""} {order.favorecido.nome}
							</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Endereço:</p>
							<p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.endereco}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Telefone:</p>
							<p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.favorecido.contato}</p>
						</div>
					</div>
					<div className="grid-rows-3">
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Bairro:</p>
							<p className="col-span-3 border border-black text-center text-xs">{order.localizacao.bairro}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Número:</p>
							<p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.numeroOuIdentificador}</p>
						</div>
						<div className="grid grid-cols-4">
							<p className="text-xs font-semibold uppercase">Cidade:</p>
							<p className="col-span-3 border border-t-0 border-black text-center text-xs">
								{order.localizacao.uf}
								{order.localizacao.cidade}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-3 border border-black">
				<h1 className="my-2 text-center font-bold">DADOS DA INSTALAÇÃO</h1>
				<div className="flex h-full items-center justify-center">
					<div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
						<div className="grid grid-rows-4">
							<div className="row-span-2 grid grid-cols-5">
								<p className="col-span-2 text-center text-xs font-semibold uppercase">TIPO DA ESTRUTURA:</p>
								<p className="col-span-3 border border-black text-center text-xs">{order.detalhes.tipoEstrutura || "-"}</p>
							</div>
							<div className="row-span-2 grid grid-cols-5">
								<p className="col-span-2 text-center text-xs font-semibold uppercase">TIPO DE TELHA:</p>
								<p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.detalhes.tipoTelha ? order.detalhes.tipoTelha : "-"} </p>
							</div>
						</div>
						<div className="grid grid-rows-4">
							<div className="row-span-2 grid h-full grid-cols-4 items-center">
								<p className="col-span-2 text-center text-xs font-semibold uppercase">NºMÓDULOS</p>
								<div className="col-span-2 flex h-full w-full items-center justify-center border border-b-0 border-black px-2 text-center text-xs">
									<div>{order.equipamentos.modulos.qtde ? order.equipamentos.modulos.qtde : "-"}</div>
								</div>
							</div>
							<div className="row-span-2 grid h-full grid-cols-4 items-center">
								<p className="col-span-2 text-center text-xs font-semibold uppercase">TOPOLOGIA</p>
								<div className="col-span-2 flex h-full w-full items-center justify-center border border-black px-2 text-center text-xs">
									<div>{order.detalhes.topologia ? order.detalhes.topologia : "-"}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-3 border border-black p-1">
				<ObservationsDocumentBlock description={order.descricao} observations={order.observacoes} />
			</div>
			<div className="mt-3 border border-black px-4 pb-4">
				<h1 className="py-2 text-center font-bold">CONFERÊNCIA DOS CHECKLIST</h1>
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
						<div className="mt-2 flex items-center gap-x-2 uppercase">
							<p className="text-xs">Data execução:</p>
							<p>____/____/_____</p>
						</div>
					</div>
				</div>
				<div className="mt-1  grid grid-cols-2 items-end gap-x-4">
					<div className="flex flex-col">
						<p className="text-start text-xs">Autorizado por:</p>
						<div className="relative flex h-[40px] w-[150px] items-center justify-center text-center">
							<Image src={Assinatura} fill={true} alt="Assinatura" />
						</div>
						<hr className="border-t-2 border-black" />
						<p className="text-center text-xs">ASSINATURA DIRETOR DE ENGENHARIA</p>
					</div>
					<div className="flex flex-col">
						<p className="text-start text-xs">Realizado por:</p>
						<hr className="mt-12 border-t-2 border-black" />
						<p className="text-center text-xs">ASSINATURA TÉCNICO RESPONSÁVEL</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OSCorretivaPDF;
