import xml2js from "xml2js";
import React, { useState, type ChangeEvent } from "react";
import { BiSolidCloudDownload } from "react-icons/bi";
import { formatDecimalPlaces, formatLongString, formatToMoney } from "@/utils/constants";
import toast from "react-hot-toast";
import { Box, Check, DollarSign, IdCard, MapIcon, MapPin, Ruler, User, X, Link, MoveRight, ReceiptCent } from "lucide-react";
import { formatLocation, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { Item } from "@radix-ui/react-dropdown-menu";
import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import { cn } from "@/lib/utils";
import { isEmpty } from "@/utils/methods/shared";
import type { TMaterialEntranceInput } from "@/pages/api/almoxarifado/estoque";
import { useMutation } from "@tanstack/react-query";
import { handleMultipleMaterialEntrance } from "@/utils/methods/mutation/materials";
import { getErrorMessage } from "@/utils/methods/handlers";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMaterialLogsByType } from "@/utils/methods/query/materials";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import UpdateRegistriesCard from "@/components/identificador/estoque/blocos/UpdateRegistriesCard";

export default function NewMaterialsEntrance() {
	const [infoHolder, setInfoHolder] = useState<TMaterialEntranceInput | null>(null);

	function updateItem({ index, changes }: { index: number; changes: Partial<TMaterialEntranceInput["itens"][number]> }) {
		setInfoHolder((prev) => (prev ? { ...prev, itens: prev.itens.map((item, idx) => (idx === index ? { ...item, ...changes } : item)) } : null));
	}
	async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		const file = files ? files[0] || null : null;
		console.log("FILES", file);

		if (!file) {
			setInfoHolder(null);
			return toast.error("Nenhum arquivo vinculado.");
		}

		const fileReader = new FileReader();

		const xmlExtracted = await new Promise<string>((resolve, reject) => {
			fileReader.onload = (e) => {
				if (!e.target || !e.target.result) {
					reject(new Error("Failed to read file"));
					return;
				}
				resolve(e.target.result as string);
			};
			fileReader.onerror = (error) => reject(error);
			fileReader.readAsText(file);
		});

		const resultExtracted = await new Promise<any>((resolve, reject) => {
			xml2js.parseString(xmlExtracted, { explicitArray: false }, (err, parsedResult) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(parsedResult);
			});
		});

		const NFId = resultExtracted.nfeProc.NFe.infNFe.$.Id.split("NFe")[1];
		const NFEmissor = resultExtracted.nfeProc.NFe.infNFe.emit;
		const NFDestinatario = resultExtracted.nfeProc.NFe.infNFe.dest;
		const NFItens = Array.isArray(resultExtracted.nfeProc.NFe.infNFe.det) ? resultExtracted.nfeProc.NFe.infNFe.det : [resultExtracted.nfeProc.NFe.infNFe.det];

		const NFData: TMaterialEntranceInput = {
			idNF: NFId,
			destinatario: {
				nome: NFDestinatario?.xNome,
				cpfCnpj: formatToCPForCNPJ(NFDestinatario?.CNPJ || ""),
				localizacao: {
					cep: NFDestinatario?.enderDest.CEP,
					uf: NFDestinatario?.enderDest.UF,
					cidade: NFDestinatario?.enderDest.xMun,
					bairro: NFDestinatario?.enderDest.xBairro,
					endereco: NFDestinatario?.enderDest.xLgr,
					numeroOuIdentificador: NFDestinatario?.enderDest.nro,
				},
			},
			emissor: {
				nome: NFEmissor?.xNome,
				cpfCnpj: formatToCPForCNPJ(NFEmissor?.CNPJ || ""),
				localizacao: {
					cep: NFEmissor?.enderEmit.CEP,
					uf: NFEmissor?.enderEmit.UF,
					cidade: NFEmissor?.enderEmit.xMun,
					bairro: NFEmissor?.enderEmit.xBairro,
					endereco: NFEmissor?.enderEmit.xLgr,
					numeroOuIdentificador: NFEmissor?.enderEmit.nro,
				},
			},
			itens: (NFItens as any[]).map((item, index) => {
				const itemQty = Number(item.prod.qCom);
				const itemUnitValue = Number(item.prod.vUnCom);
				const itemTotalValue = itemQty * itemUnitValue;
				const itemDiscount = Number(item.prod.vDesc) || 0;
				const itemTotalValueWithDiscount = itemTotalValue - itemDiscount;
				const itemUnitValueWithDiscount = itemTotalValueWithDiscount / itemQty;
				return {
					index: index.toString(),
					ncm: item.prod.NCM || "SEM NCM",
					nome: item.prod.xProd || "SEM DESCRIÇÃO",
					quantidade: itemQty,
					unidade: item.prod.uCom || "SEM UNIDADE",
					valorUnitario: itemUnitValueWithDiscount,
					valorTotal: itemTotalValueWithDiscount,
				};
			}),
			valorTotal: Number(resultExtracted.nfeProc.NFe.infNFe.total.ICMSTot.vNF),
		};
		setInfoHolder(NFData);
		toast.success("Nota fiscal lida com sucesso !");
	}
	const { mutate, isPending } = useMutation({
		mutationKey: ["multiple-materials-entrance"],
		mutationFn: handleMultipleMaterialEntrance,
		onSuccess: (data) => {
			toast.success(data);
			setInfoHolder(null);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
	return (
		<div className="w-full flex flex-col grow p-6 gap-12">
			<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
				<p className="text-start text-2xl font-black uppercase text-[#15599a] w-full">ENTRADA DE MATERIAIS</p>
			</div>
			<div className="w-full flex flex-col gap-3">
				<div className="flex flex-col items-center justify-center gap-1">
					<p className="w-full text-2xl font-bold uppercase">CADASTRO DE NOTA FISCAL</p>
					<p className="w-full text-sm italic text-gray-500">Anexe a nota fiscal para iniciar o procedimento de entrada de materiais.</p>
				</div>
				<label htmlFor="dropzone-file" className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg  border-2 border-dashed">
					<div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
						<BiSolidCloudDownload color={"rgb(31,41,55)"} size={50} />
						{infoHolder ? (
							<div className="w-full flex items-center justify-center gap-1">
								<Check />
								<p className="text-primary text-sm font-medium">NF ({infoHolder.idNF}) anexada com sucesso !</p>
							</div>
						) : (
							<p className="text-primary text-sm font-medium">Clique aqui para anexar o arquivo XML.</p>
						)}
					</div>
					<input onChange={(e) => handleFileInputChange(e)} id="dropzone-file" type="file" className="absolute h-full w-full opacity-0" accept=".xml" />
				</label>
				{infoHolder ? (
					<div className="w-full bg-[#fff] dark:bg-[#121212] flex flex-col gap-3 p-3 shadow-lg border border-primary rounded">
						<div className="flex items-center gap-1 self-center px-2 py-1 rounded-lg bg-primary text-primary-foreground">
							<ReceiptCent className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="w-full text-center tracking-tight">
								NOTA <strong>{infoHolder.idNF}</strong>
							</h1>
						</div>

						<div className="w-full flex flex-col gap-1">
							<h1 className="w-full text-start text-xs tracking-tight text-primary/50">EMISSOR</h1>
							<div className="w-full flex items-center gap-4 gap-y-2 flex-wrap">
								<div className="flex items-center gap-1">
									<User className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">{infoHolder.emissor.nome || "NOME DO EMISSOR NÃO ENCONTRADO"}</p>
								</div>
								<div className="flex items-center gap-1">
									<IdCard className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">{infoHolder.emissor.cpfCnpj || "CNPJ DO EMISSOR NÃO ENCONTRADO"}</p>
								</div>
								<div className="flex items-center gap-1">
									<MapPin className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">
										{formatLocation({
											location: {
												cep: infoHolder.emissor.localizacao.cep,
												uf: infoHolder.emissor.localizacao.uf || "",
												cidade: infoHolder.emissor.localizacao.cidade || "",
												bairro: infoHolder.emissor.localizacao.bairro,
												endereco: infoHolder.emissor.localizacao.endereco,
												numeroOuIdentificador: infoHolder.emissor.localizacao.numeroOuIdentificador,
											},
											includeCEP: true,
											includeCity: true,
											includeUf: true,
										})}
									</p>
								</div>
							</div>
						</div>
						<div className="w-full flex flex-col gap-1">
							<h1 className="w-full text-start text-xs tracking-tight text-primary/50">DESTINATÁRIO</h1>
							<div className="w-full flex items-center gap-4 gap-y-2 flex-wrap">
								<div className="flex items-center gap-1">
									<User className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">{infoHolder.destinatario.nome || "NOME DO DESTINATÁRIO NÃO ENCONTRADO"}</p>
								</div>
								<div className="flex items-center gap-1">
									<IdCard className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">{infoHolder.destinatario.cpfCnpj || "CNPJ DO DESTINATÁRIO NÃO ENCONTRADO"}</p>
								</div>
								<div className="flex items-center gap-1">
									<MapPin className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-sm tracking-tight text-primary font-bold">
										{formatLocation({
											location: {
												cep: infoHolder.destinatario.localizacao.cep,
												uf: infoHolder.destinatario.localizacao.uf || "",
												cidade: infoHolder.destinatario.localizacao.cidade || "",
												bairro: infoHolder.destinatario.localizacao.bairro,
												endereco: infoHolder.destinatario.localizacao.endereco,
												numeroOuIdentificador: infoHolder.destinatario.localizacao.numeroOuIdentificador,
											},
											includeCEP: true,
											includeCity: true,
											includeUf: true,
										})}
									</p>
								</div>
							</div>
						</div>
						<div className="w-full flex flex-col gap-1">
							<h1 className="w-full text-start text-xs tracking-tight text-primary/50">ITENS</h1>
							<div className="w-full flex flex-col gap-3">
								{infoHolder.itens.map((item, index) => (
									<NewMaterialsEntranceItemCard key={item.index} item={item} updateItem={(changes) => updateItem({ index, changes })} />
								))}
							</div>
						</div>
						<div className="w-full flex items-center justify-end">
							<LoadingButton loading={isPending} onClick={() => mutate({ input: infoHolder })}>
								REALIZAR ENTRADA DOS MATERIAIS
							</LoadingButton>
						</div>
					</div>
				) : null}
			</div>
			<UpdatesBlock />
		</div>
	);
}

type TNewMaterialsEntranceItemCardProps = {
	item: TMaterialEntranceInput["itens"][number];
	updateItem: (changes: Partial<TMaterialEntranceInput["itens"][number]>) => void;
};
function NewMaterialsEntranceItemCard({ item, updateItem }: TNewMaterialsEntranceItemCardProps) {
	function getNewPrice({
		previousQty,
		previousPrice,
		inputQty,
		inputPrice,
	}: {
		previousQty: number;
		previousPrice: number;
		inputQty: number;
		inputPrice: number;
	}) {
		// Doing weighted average
		const newPrice = (previousQty * previousPrice + inputQty * inputPrice) / (previousQty + inputQty);
		return newPrice;
	}
	return (
		<div className="w-full flex flex-col gap-2 p-2 rounded-lg border border-primary/50">
			<div className="w-full flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<h1 className="font-bold text-xs tracking-tight">{item.nome}</h1>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<DollarSign className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm tracking-tight font-medium">
								{formatToMoney(item.valorUnitario)} / {item.unidade}
							</p>
						</div>
						<div className="flex items-center gap-1">
							<Box className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm tracking-tight font-medium">
								{formatDecimalPlaces(item.quantidade)} {item.unidade}
							</p>
						</div>
					</div>
				</div>
				<MaterialSelector
					initialMaterialState={{ materialId: item.material?.id || null, materialName: item.material?.nome || "" }}
					vinculateMaterial={(mat) =>
						updateItem({
							material: {
								id: mat._id,
								nome: mat.nome,
								unidade: mat.grandeza || "UN",
								quantidadeAtual: mat.qtde,
								valorUnitarioAtual: mat.preco,
							},
						})
					}
					unvinculateMaterial={() => updateItem({ material: undefined })}
					renderSelectedMaterial={({ selectedMaterial, handleMaterialUnvinculation }) => (
						<div className="flex w-fit items-center gap-2 self-center rounded-lg px-2 py-1">
							<h1 className="text-[0.65rem] font-medium tracking-tight text-primary">{selectedMaterial.nome}</h1>
							<div className="flex items-center gap-1">
								<Box width={15} height={15} />
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
									{selectedMaterial.qtde} {selectedMaterial.grandeza}
								</h1>
							</div>
							<button
								type="button"
								onClick={() => handleMaterialUnvinculation()}
								className={cn("group flex items-center justify-center rounded-full bg-green-600 p-1 text-xs font-medium text-white duration-300 ease-in-out hover:bg-gray-500")}
							>
								<div className="block duration-300 animate-out group-hover:hidden">
									<Link size={12} />
								</div>
								<div className="hidden duration-300 animate-in group-hover:block">
									<X size={12} />
								</div>
							</button>
						</div>
					)}
					renderUnselectedMaterial={({ setOpen }) => (
						<button type="button" onClick={() => setOpen(true)} className="flex w-fit items-center gap-1 self-center rounded hover:bg-cyan-300 px-2 py-1 transition-colors">
							<Link size={12} />
							<h1 className="text-[0.7rem] font-medium tracking-tight">VINCULAR UM ATIVO</h1>
						</button>
					)}
				/>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className={"flex w-full flex-col gap-1 lg:w-1/2"}>
					<label htmlFor={"qty-price"} className={"font-sans text-[0.6rem] font-bold  tracking-tight text-[#353432]"}>
						QUANTIDADE DE ENTRADA
					</label>
					<input
						id={"qty-price"}
						value={!isEmpty(item.quantidade) ? item.quantidade?.toString() : ""}
						onChange={(e) => updateItem({ quantidade: Number(e.target.value) })}
						name="qty-price"
						type="number"
						className="rounded-lg border border-gray-300 p-1 text-center text-[0.6rem] tracking-tight text-gray-500 shadow-sm outline-none placeholder:italic"
					/>
				</div>
				<div className={"flex w-full flex-col gap-1 lg:w-1/2"}>
					<label htmlFor={"input-price"} className={"font-sans text-[0.6rem] font-bold  tracking-tight text-[#353432]"}>
						PREÇO DE ENTRADA
					</label>
					<input
						id={"input-price"}
						value={!isEmpty(item.valorUnitario) ? item.valorUnitario?.toString() : ""}
						onChange={(e) => updateItem({ valorUnitario: Number(e.target.value) })}
						name="input-price"
						type="number"
						className="rounded-lg border border-gray-300 p-1 text-center text-[0.6rem] tracking-tight text-gray-500 shadow-sm outline-none placeholder:italic"
					/>
				</div>
			</div>
			{item.material ? (
				<div className="mt-2 flex flex-col gap-2 rounded border border-primary/30 bg-secondary/50 p-3">
					<h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-gray-500 lg:text-xs">ATUALIZAÇÕES</h1>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-1">
							<Box className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
								{formatDecimalPlaces(item.material.quantidadeAtual)} {item.material.unidade || "UN"}
							</p>
							<MoveRight className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
								{formatDecimalPlaces(item.material.quantidadeAtual + item.quantidade)} {item.material.unidade || "UN"}
							</p>
						</div>
						<div className="flex items-center gap-1">
							<DollarSign className="w" />
							<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formatToMoney(item.material.valorUnitarioAtual)}</p>
							<MoveRight className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
								{formatToMoney(
									getNewPrice({
										previousPrice: item.material.valorUnitarioAtual,
										previousQty: item.material.quantidadeAtual,
										inputPrice: item.valorUnitario,
										inputQty: item.quantidade,
									}),
								)}
							</p>
						</div>
					</div>
					{item.material.unidade && item.material.unidade !== item.unidade ? (
						<p className="rounded border-orange-500 bg-orange-100 p-1 py-2 text-center text-[0.7rem] font-medium text-orange-500">
							Oops, notamos uma divergência nas grandezas. O material atual está em <strong>{item.material.unidade || "UN"}</strong> , e a entrada está em <strong>{item.unidade}</strong>.
							Verifique as informações e, se necessário, faça ajustes de quantidade e preço.
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}

function UpdatesBlock() {
	const { data: logs, isLoading, isError, isSuccess } = useMaterialLogsByType({ type: "ENTRADA" });
	return (
		<div className="w-full bg-[#fff] dark:bg-[#121212] flex flex-col gap-3 p-3 shadow-lg border border-primary rounded">
			<div className="flex items-center gap-1 self-center px-2 py-1 rounded-lg bg-primary text-primary-foreground">
				<h1 className="w-full text-center tracking-tight">ÚLTIMAS ALTERAÇÕES</h1>
			</div>
			<div className="flex w-full grow flex-wrap items-start justify-around gap-2 overflow-y-auto overscroll-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar registros de alteração."} /> : null}
				{isSuccess ? logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} showMaterialName={true} />) : null}
			</div>
		</div>
	);
}
