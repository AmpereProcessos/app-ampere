import React from "react";
import Image from "next/image";
import Logo from "../utils//images/logo-texto-azul-vertical.png";
import Assinatura from "../utils/images/signature-andrew.png";
import dayjs from "dayjs";

import { formatToMoney, margemLucro, taxaImposto } from "../utils/constants";
function LaudoSimplesUrbano({ analysis }) {
	function getAdditionalCostsSum(custos, addTaxes = false) {
		const sum = custos.reduce((acc, current) => {
			let total = 0;
			if (addTaxes) {
				total = current.total ? current.total / (1 - (margemLucro + taxaImposto)) : (current.qtde * current.custoUnitario) / (1 - (margemLucro + taxaImposto));
			} else {
				total = current.total ? current.total / (1 - margemLucro) : (current.qtde * current.custoUnitario) / (1 - margemLucro);
			}
			if (total) return acc + total;
			return acc;
		}, 0);
		return sum;
	}
	return (
		<div className="h-[29.7cm] w-[21cm]">
			<div className="flex h-full w-full flex-col">
				<div className="mt-2 flex w-full items-center justify-around border border-t-0 border-black py-2">
					<h1 className="font-bold uppercase text-[#15599a]">LAUDO COMERCIAL - URBANO</h1>
					<div className="h-[47px] w-[47px]">
						<Image style={{ width: "47px", height: "47px" }} src={Logo} />
					</div>
				</div>
				<div className="flex flex-col">
					<h1 className="border-x border-black bg-[#15599a] text-center text-sm font-bold text-white">INFORMAÇÕES DO CLIENTE</h1>
					<div className="flex">
						<div className="grid w-[60%] grid-rows-5">
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">CLIENTE</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.nome}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">REPRESENTANTE</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">ENDEREÇO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.endereco}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">BAIRRO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.bairro}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">DATA DA VISITA</p>
								<p className="border-r border-black p-1 text-center text-xs">{dayjs().format("DD/MM/YYYY")}</p>
							</div>
						</div>
						<div className="grid w-[40%] grid-rows-5">
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">TELEFONE</p>
								<p className="border-r border-black p-1 text-center text-xs">-</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">Nº DE PROJETO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.projeto.identificador || "N/A"}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">NÚMERO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.numeroOuIdentificador}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">MUNICÍPIO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.cidade}</p>
							</div>
							<div className="grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">TIPO DE SOLICITAÇÃO</p>
								<p className="border-r border-black p-1 text-center text-xs">{analysis.tipoSolicitacao}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<h1 className="bg-[#15599a] text-center text-sm font-bold text-white">EQUIPAMENTOS</h1>
					<div className="flex">
						<div className="flex h-full w-[20%] items-center justify-center bg-[#15599a] text-center font-bold text-white">DESCRIÇÃO DO SISTEMA FOTOVOLTAICO</div>
						<div className="flex w-[80%] flex-col">
							<h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">INVERSORES</h1>
							<div className="flex border border-b-0 border-black">
								<div className="flex w-[50%] flex-col">
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">TOPOLOGIA</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.detalhes.topologia}</p>
									</div>
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">QUANTIDADE</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.qtde}</p>
									</div>
								</div>
								<div className="flex w-[50%] flex-col">
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">MARCA DO INVERSOR</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.modelo}</p>
									</div>
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">POTÊNCIA</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.potencia}</p>
									</div>
								</div>
							</div>
							<h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">MÓDULOS FOTOVOLTÁICOS</h1>
							<div className="flex  border border-b-0 border-black">
								<div className="flex w-[50%] flex-col">
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">QUANTIDADE</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.qtde}</p>
									</div>
								</div>
								<div className="flex w-[50%] flex-col">
									<div className="grid grid-cols-2">
										<p className="bg-gray-200 p-1 text-center text-xs font-bold">POTÊNCIA</p>
										<p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.potencia}</p>
									</div>
								</div>
							</div>
							<div className="flex  border border-black">
								<p className="w-[50%] bg-gray-200 p-1 text-center text-xs font-bold">MARCA DOS MÓDULOS</p>
								<p className="w-[50%] p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.modelo}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4 flex flex-col">
					<h1 className="border border-black bg-[#15599a] text-center text-sm font-bold text-white">CUSTOS ADICIONAIS</h1>
					<div className="flex flex-col">
						<div className="grid grid-cols-10 border-b border-black bg-[#fead61]">
							<p className="col-span-3 border-r border-black p-1 text-center text-xs font-bold text-white">DESCRIÇÃO</p>
							<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">QUANTIDADE</p>
							<p className="col-span-1 border-r border-black p-1 text-center text-xs font-bold text-white">GRANDEZA</p>
							<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">VALOR</p>
							<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">TOTAL</p>
						</div>
						{analysis.custos?.length > 0 ? (
							analysis.custos.map((cost, index) => (
								<div key={`${cost.descricao}-${index}`} className="grid grid-cols-10 border-b border-black">
									<p className="col-span-3 border-r border-black p-1 text-center text-xs font-bold">{cost.descricao}</p>
									<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">{cost.qtde}</p>
									<p className="col-span-1 border-r border-black p-1 text-center text-xs font-bold">{cost.grandeza}</p>
									<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">{formatToMoney(cost.custoUnitario / (1 - margemLucro))}</p>
									<p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">
										{cost.total ? formatToMoney(cost.total / (1 - margemLucro)) : formatToMoney((cost.qtde * cost.custoUnitario) / (1 - margemLucro))}
									</p>
								</div>
							))
						) : (
							<div className="flex h-[50px] items-center justify-center border-b border-r border-black italic">SEM CUSTOS ADICIONAIS</div>
						)}
					</div>
					<div className="grid grid-cols-10">
						<div className="col-span-3 flex items-center justify-center border border-t-0 border-l-0 border-black bg-[#15599a] text-center font-bold text-white">
							VALOR PARA AJUSTE NA PROPOSTA COMERCIAL
						</div>
						<div className="col-span-7 flex h-full flex-col">
							<div className="grid grid-cols-7  border-b border-black">
								<div className="col-span-5 border-r border-black bg-[#fead61] p-1 text-center font-bold text-white">VALOR À VISTA</div>
								<div className="col-span-2 border-r border-black bg-[#fead61] p-1 text-center font-bold text-white">
									R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos).toFixed(2).replace(".", ",") : "-"}
								</div>
							</div>
							<div className="grid grid-cols-7  border-b border-black">
								<div className="col-span-5 border-r border-black bg-[#15599a] p-1 text-center font-bold text-white">VALOR FINANCIAMENTO</div>
								<div className="col-span-2 border-r border-black bg-[#15599a] p-1 text-center font-bold text-white">
									R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos, true).toFixed(2).replace(".", ",") : "-"}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-col">
					<h1 className="bg-[#15599a] text-center text-sm font-bold text-white">RESPOSTA DA VISITA TÉCNICA</h1>
					<div className="flex flex-col">
						<div className="grid grid-cols-2">
							<div className="col-span-2 grid grid-cols-2 border-b border-black">
								<p className="border-r border-black bg-[#fead61] py-1 text-center text-sm font-bold text-white">ESPAÇO PARA PROJETO</p>
								<p className="border-r border-black py-1 text-center text-sm font-bold">{analysis.conclusao.espaco ? "SIM" : "NÃO"}</p>
							</div>
							<div className="grid grid-rows-3">
								<div className="grid grid-cols-2 border-b border-black">
									<p className="border-r border-black bg-[#fead61] py-1 text-center text-sm font-bold text-white">PADRÃO</p>
									<p className="border-r border-black py-1 text-center text-sm font-bold">{analysis.conclusao.padrao ? analysis.conclusao.padrao : "-"}</p>
								</div>
								<div className="grid grid-cols-2 border-b border-black">
									<p className="border-r border-black bg-[#fead61] py-1 text-center text-sm font-bold text-white">ESTRUTURA DE INCLINAÇÃO</p>
									<p className="border-r border-black py-1 text-center text-sm font-bold">{analysis.conclusao.inclinacao ? analysis.conclusao.inclinacao : "-"}</p>
								</div>
							</div>
							<div className="grid grid-rows-3">
								<div className="grid grid-cols-2 border-b border-black">
									<p className="border-r border-black bg-[#fead61] py-1 text-center text-sm font-bold text-white">POSSUI SOMBRA?</p>
									<p className="border-r border-black py-1 text-center text-sm font-bold">{analysis.conclusao.sombreamento ? "É AFETADO" : "NÃO É AFETADO"}</p>
								</div>
								<div className="grid grid-cols-2 border-b border-black">
									<p className="border-r border-black bg-[#fead61] py-1 text-center text-sm font-bold text-white">ESTRUTURA CIVIL</p>
									<p className="border-r border-black py-1 text-center text-sm font-bold">{analysis.conclusao.estrutura ? analysis.conclusao.estrutura : "-"}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-col">
					<h1 className="border border-t-0 border-black bg-[#15599a] text-center font-bold text-white">CONCLUSÃO</h1>
					<div className="flex min-h-[60px] h-fit items-center justify-center border border-t-0 border-black p-2 text-center text-xs">
						{analysis.conclusao.observacoes ? analysis.conclusao.observacoes : "OBSERVAÇÕES NÃO PREENCHIDAS."}
					</div>
				</div>
				<div className="mt-2 grid grid-cols-2 gap-x-4">
					<div className="flex flex-col">
						<p className="ml-2 text-start text-xs">Autorizado por:</p>
						<div className="flex w-full items-center justify-center">
							<div className="flex w-[97px] items-center  justify-center text-center">
								<Image src={Assinatura} />
							</div>
						</div>

						<hr className="border-t-2 border-black" />
						<p className="text-center text-xs">ASSINATURA DIRETOR DE ENGENHARIA</p>
					</div>
					<div className="flex flex-col">
						<p className="ml-2 text-start text-xs">Realizado por:</p>
						<hr className="mt-8 border-t-2 border-black" />
						<p className="text-center text-xs">ASSINATURA TÉCNICO RESPONSÁVEL</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LaudoSimplesUrbano;
