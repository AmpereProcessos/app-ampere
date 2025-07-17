import Avatar from "@/components/utils/Avatar";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useCRMReferences } from "@/utils/methods/query/crm-references";
import Link from "next/link";
import React from "react";
import { AiFillThunderbolt, AiOutlineSafety } from "react-icons/ai";
import { BsCalendarPlus, BsCode } from "react-icons/bs";
import { FaIndustry, FaSolarPanel, FaUser } from "react-icons/fa";
import { TbTopologyFull } from "react-icons/tb";

type CRMReferencesBlockProps = {
	proposeId: string;
	opportunityId: string;
};
function CRMReferencesBlock({ proposeId, opportunityId }: CRMReferencesBlockProps) {
	const { data: references } = useCRMReferences({ proposeId, opportunityId });
	const propose = references?.propose;
	const opportunity = references?.opportunity;
	return (
		<div className="flex flex-col rounded-md border border-[#fead41] pb-2 shadow-lg">
			<span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#fead41] py-2 text-center font-bold text-white">REFERÊNCIAS CRM</span>
			<div className="flex w-full flex-col items-center gap-2 px-2">
				{opportunity ? (
					<div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 lg:w-[600px]">
						<h1 className="w-full rounded-tr-md rounded-tl-md bg-[#fead41] py-2 text-center text-sm font-black leading-none tracking-tight text-white">PROJETO</h1>
						<div className="flex w-full grow flex-col gap-1 p-4 pt-2">
							<Link href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${opportunityId}`}>
								<div className="w-full text-center text-sm font-black leading-none tracking-tight text-[#15599a] hover:text-cyan-500">
									<strong className="text-[#fead41]">({opportunity.identificador})</strong> {opportunity?.nome}
								</div>
							</Link>
							<div className="flex items-center justify-center gap-2">
								<BsCode />
								<h1 className="text-xs leading-none tracking-tight text-gray-500">{opportunity?._id}</h1>
							</div>
							<div className="mt-2 flex w-full items-center justify-between">
								<div className={`flex items-center gap-2`}>
									<BsCalendarPlus />
									<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(opportunity.dataInsercao)}</p>
								</div>
								<div className="flex items-center justify-center gap-2">
									<Avatar fallback={"U"} height={25} width={25} url={opportunity.responsavel?.avatar_url || undefined} />
									<p className="text-xs font-medium text-gray-500">{opportunity.responsavel?.nome}</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
				{propose ? (
					<div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 lg:w-[600px]">
						<h1 className="w-full rounded-tr-md rounded-tl-md bg-[#fead41] py-2 text-center text-sm font-black leading-none tracking-tight text-white">PROPOSTA</h1>
						<div className="flex w-full grow flex-col gap-1 p-4 pt-2">
							<div className="flex w-full items-center justify-between gap-2">
								<Link href={`https://crm.ampereenergias.com.br/comercial/proposta/${proposeId}`}>
									<a className="text-center text-sm font-black leading-none tracking-tight text-[#15599a] hover:text-cyan-500">{propose?.nome}</a>
								</Link>
								<div className="flex items-center gap-2">
									<h1 className="min-w-fit rounded-full bg-gray-800 px-2 py-1 text-[0.58rem] font-medium text-white lg:text-xs">{formatToMoney(propose.valorProposta || 0)}</h1>
									<div className="flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-1 text-white">
										<AiFillThunderbolt />
										<h1 className="text-[0.58rem] font-medium lg:text-xs">{formatDecimalPlaces(propose.potenciaPico || 0)} kWp</h1>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-center gap-2">
								<BsCode />
								<h1 className="text-xs leading-none tracking-tight text-gray-500">{proposeId}</h1>
							</div>
							{propose.kit ? (
								<>
									<h1 className="text-xs font-medium leading-none tracking-tight text-gray-500">EQUIPAMENTOS</h1>
									{propose.kit.inversores.map((inverter, index) => (
										<div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-2">
											<div className="flex w-full items-center justify-between gap-2">
												<div className="flex  items-center gap-1">
													<div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
														<TbTopologyFull size={25} />
													</div>
													<p className="text-[0.65rem] font-medium leading-none tracking-tight lg:text-xs">
														<strong className="text-[#FF9B50]">{inverter.qtde}</strong> x {inverter.modelo}
													</p>
												</div>
												<h1 className="min-w-fit rounded-full bg-gray-800 px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">INVERSOR</h1>
											</div>

											<div className="mt-1 flex w-full items-center justify-end gap-2 pl-2">
												<div className="flex items-center gap-1">
													<FaIndustry size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{inverter.fabricante}</p>
												</div>
												<div className="flex items-center gap-1">
													<AiFillThunderbolt size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{inverter.potenciaNominal} W</p>
												</div>
												<div className="flex items-center gap-1">
													<AiOutlineSafety size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{inverter.garantia} ANOS</p>
												</div>
											</div>
										</div>
									))}
									{propose.kit.modulos.map((module, index) => (
										<div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-2">
											<div className="flex w-full items-center justify-between gap-2">
												<div className="flex  items-center gap-1">
													<div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
														<FaSolarPanel size={25} />
													</div>
													<p className="text-[0.65rem] font-medium leading-none tracking-tight lg:text-xs">
														<strong className="text-[#FF9B50]">{module.qtde}</strong> x {module.modelo}
													</p>
												</div>
												<h1 className="min-w-fit rounded-full bg-gray-800 px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">MÓDULOS</h1>
											</div>
											<div className="mt-1 flex w-full items-center justify-end gap-2 pl-2">
												<div className="flex items-center gap-1">
													<FaIndustry size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{module.fabricante}</p>
												</div>
												<div className="flex items-center gap-1">
													<AiFillThunderbolt size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{module.potencia} W</p>
												</div>
												<div className="flex items-center gap-1">
													<AiOutlineSafety size={12} />
													<p className="text-[0.58rem] font-thin text-gray-500 lg:text-[0.65rem]">{module.garantia} ANOS</p>
												</div>
											</div>
										</div>
									))}
								</>
							) : null}
							<div className="mt-2 flex w-full items-center justify-between">
								<div className={`flex items-center gap-2`}>
									<BsCalendarPlus />
									<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(propose.dataInsercao)}</p>
								</div>
								<div className="flex items-center justify-center gap-2">
									<Avatar fallback={"U"} height={25} width={25} url={propose.autor?.avatar_url || undefined} />
									<p className="text-xs font-medium text-gray-500">{propose.autor?.nome}</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default CRMReferencesBlock;
