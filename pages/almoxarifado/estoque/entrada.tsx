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
import UpdateRegistriesCard from "@/components/identificador/estoque/UpdateRegistriesCard";

// function renderInputText(files: File | null) {
// 	if (!files)
// 		return (
// 			<p className="mb-2 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
// 				<span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
// 			</p>
// 		);

// 	return <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{files.name}</p>;
// }

// export type InputMaterialItem = { codigo: string | number; nome: string; preco: number; qtde: number; grandeza: string };
// async function readXML(file: File) {
// 	return new Promise<InputMaterialItem[]>((resolve, reject) => {
// 		const fileReader = new FileReader();
// 		fileReader.readAsText(file);
// 		fileReader.onload = async (e) => {
// 			if (!e.target || !e.target.result) {
// 				reject(new Error("Failed to read file"));
// 				return;
// 			}
// 			const xmlData = e.target.result as string;
// 			try {
// 				const result = await new Promise<any>((resolve, reject) => {
// 					xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
// 						if (err) {
// 							reject(err);
// 							return;
// 						}
// 						resolve(result);
// 					});
// 				});

// 				console.log("NF EXTRACTED DATA", result);
// 				const NFeItems = result.nfeProc.NFe.infNFe.det;
// 				let items: InputMaterialItem[] = [];

// 				if (Array.isArray(NFeItems)) {
// 					items = NFeItems.map((x: any, index) => {
// 						const itemInfo = x.prod;
// 						const nome = itemInfo.xProd;
// 						const qtde = itemInfo.qCom;
// 						const grandeza = itemInfo.uCom;
// 						const valor = itemInfo.vUnCom;
// 						const NCMCode = itemInfo.NCM;
// 						console.log(itemInfo.xProd);
// 						return {
// 							codigo: index,
// 							nome: nome,
// 							qtde: Number(qtde),
// 							grandeza: grandeza,
// 							preco: Number(valor),
// 						};
// 					});
// 				} else {
// 					const itemInfo = NFeItems.prod;
// 					const nome = itemInfo.xProd;
// 					const qtde = itemInfo.qCom;
// 					const grandeza = itemInfo.uCom;
// 					const valor = itemInfo.vUnCom;
// 					const NCMCode = itemInfo.NCM;
// 					items = [{ codigo: NCMCode || 1, nome: nome, qtde: Number(qtde), grandeza: grandeza, preco: Number(valor) }];
// 				}

// 				resolve(items);
// 			} catch (error) {
// 				reject(error);
// 			}
// 		};

// 		fileReader.onerror = (error) => {
// 			reject(error);
// 		};
// 	});
// }

// function MaterialsInput() {
// 	const { data: session, status } = useSession({ required: true });
// 	const { data: logs, isLoading, isError, isSuccess } = useMaterialLogsByType({ type: "ENTRADA" });
// 	const { data: materials } = useMaterials();
// 	const [fileHolder, setFileHolder] = useState<File | null>(null);
// 	const [itemsHolder, setItemsHolder] = useState<InputMaterialItem[]>([]);
// 	async function handleDataExtraction(file: File | null) {
// 		if (!file) return toast.error("Nenhum arquivo vinculado.");
// 		const items = await readXML(file);
// 		setItemsHolder(items);
// 	}
// 	if (status !== "authenticated") return <LoadingPage />;
// 	return (
// 		<div className="flex grow flex-col p-6">
// 			<div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
// 				<div className="flex w-full items-center justify-between">
// 					<div className="flex flex-col items-center gap-2 lg:flex-row">
// 						<p className="text-center text-2xl font-black uppercase text-[#15599a]">ENTRADA DE MATERIAIS</p>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="flex max-h-[300px] min-h-[200px] w-full flex-col rounded border border-gray-500">
// 				<h1 className="w-full rounded-bl rounded-br bg-gray-500 p-1 text-center font-bold text-white">ÚLTIMAS ENTRADAS</h1>
// 				<div className="flex w-full grow flex-wrap items-start justify-around gap-2 overflow-y-auto overscroll-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
// 					{isLoading ? <LoadingPage /> : null}
// 					{isError ? <ErrorComponent msg={"Erro ao buscar registros de alteração."} /> : null}
// 					{isSuccess ? logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} showMaterialName={true} />) : null}
// 				</div>
// 			</div>
// 			<h1 className="my-2 w-full text-start font-bold tracking-tighter">IDENTIFICAÇÃO DE MATERIAIS DA NOTA FISCAL</h1>
// 			<div className="relative flex w-full items-center justify-center">
// 				<label
// 					htmlFor="dropzone-file"
// 					className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
// 				>
// 					<div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
// 						<BiSolidCloudDownload color={"rgb(31,41,55)"} size={50} />

// 						{renderInputText(fileHolder)}
// 					</div>
// 					<input
// 						onChange={(e) => {
// 							const file = e.target.files ? e.target.files[0] : null;
// 							setFileHolder(file);
// 						}}
// 						id="dropzone-file"
// 						type="file"
// 						className="absolute h-full w-full opacity-0"
// 						accept=".xml"
// 					/>
// 				</label>
// 			</div>
// 			<div className="my-2 flex w-full items-center justify-end">
// 				<button
// 					type="button"
// 					onClick={() => handleDataExtraction(fileHolder)}
// 					className="rounded bg-gray-800 py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-900"
// 				>
// 					IDENTIFICAR
// 				</button>
// 			</div>
// 			<div className="flex w-full flex-col items-center gap-2">
// 				{itemsHolder.length > 0 ? (
// 					itemsHolder.map((item, index) => (
// 						<InputMaterialCard
// 							key={item.codigo}
// 							inputMaterial={item}
// 							materials={materials || []}
// 							clearMaterialHolder={() => {
// 								const currentItems = [...itemsHolder];
// 								currentItems.splice(index, 1);
// 								setItemsHolder(currentItems);
// 							}}
// 						/>
// 					))
// 				) : (
// 					<p className="text-center text-sm italic text-gray-500">Sem itens identificados...</p>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// export default MaterialsInput;

const NFData = {
	nfeProc: {
		$: {
			versao: "4.00",
			xmlns: "http://www.portalfiscal.inf.br/nfe",
		},
		NFe: {
			$: {
				xmlns: "http://www.portalfiscal.inf.br/nfe",
			},
			infNFe: {
				$: {
					versao: "4.00",
					Id: "NFe31250407602070000169550010000599881350304070",
				},
				ide: {
					cUF: "31",
					cNF: "35030407",
					natOp: "Venda merc adq/rec terc ST",
					mod: "55",
					serie: "1",
					nNF: "59988",
					dhEmi: "2025-04-08T16:31:02-03:00",
					dhSaiEnt: "2025-04-08T16:31:02-03:00",
					tpNF: "1",
					idDest: "1",
					cMunFG: "3134202",
					tpImp: "1",
					tpEmis: "1",
					cDV: "0",
					tpAmb: "1",
					finNFe: "1",
					indFinal: "1",
					indPres: "0",
					procEmi: "0",
					verProc: "4.30b158",
				},
				emit: {
					CNPJ: "07602070000169",
					xNome: "SANTA RITA EMBALAGENS LTDA",
					xFant: "EMBALAGENS TIJUCANA",
					enderEmit: {
						xLgr: "RUA TRINTA E SEIS",
						nro: "1174",
						xCpl: "LOJA",
						xBairro: "CENTRO",
						cMun: "3134202",
						xMun: "ITUIUTABA",
						UF: "MG",
						CEP: "38302008",
						cPais: "1058",
						xPais: "Brasil",
						fone: "03432717100",
					},
					IE: "3423815120009",
					CRT: "3",
				},
				dest: {
					CNPJ: "27901968000145",
					xNome: "AMPERE ENERGIAS",
					enderDest: {
						xLgr: "RUA 9",
						nro: "233",
						xCpl: "COM 26 E 28",
						xBairro: "CENTRO",
						cMun: "3134202",
						xMun: "ITUIUTABA",
						UF: "MG",
						CEP: "38307064",
						cPais: "1058",
						xPais: "Brasil",
						fone: "3437007001",
					},
					indIEDest: "1",
					IE: "0029802240087",
				},
				det: {
					$: {
						nItem: "1",
					},
					prod: {
						cProd: "10552",
						cEAN: "SEM GTIN",
						xProd: "TOALHA PAPEL MAX CLEAN BRANCO LUXO 20X21",
						NCM: "48182000",
						CEST: "2004500",
						cBenef: "",
						CFOP: "5405",
						uCom: "PT",
						qCom: "6",
						vUnCom: "19.9",
						vProd: "119.40",
						cEANTrib: "SEM GTIN",
						uTrib: "PT",
						qTrib: "6",
						vUnTrib: "19.9",
						vDesc: "11.40",
						indTot: "1",
						xPed: "502167",
						nItemPed: "1",
					},
					imposto: {
						vTotTrib: "36.27",
						ICMS: {
							ICMS60: {
								orig: "0",
								CST: "60",
								vBCSTRet: "0.00",
								pST: "0.0000",
								vICMSSubstituto: "0.00",
								vICMSSTRet: "0.00",
								pRedBCEfet: "0.00",
								vBCEfet: "0.00",
								pICMSEfet: "0.00",
								vICMSEfet: "0.00",
							},
						},
						IPI: {
							cEnq: "999",
							IPITrib: {
								CST: "99",
								vBC: "0.00",
								pIPI: "0.00",
								vIPI: "0.00",
							},
						},
						PIS: {
							PISAliq: {
								CST: "01",
								vBC: "108.00",
								pPIS: "1.6500",
								vPIS: "1.78",
							},
						},
						COFINS: {
							COFINSAliq: {
								CST: "01",
								vBC: "108.00",
								pCOFINS: "7.6000",
								vCOFINS: "8.21",
							},
						},
					},
					infAdProd: "Val. aprox. tributos: R$16.83 (15.58% Fed Nac) R$19.44 (18.00% Est)",
				},
				total: {
					ICMSTot: {
						vBC: "0.00",
						vICMS: "0.00",
						vICMSDeson: "0.00",
						vFCP: "0.00",
						vBCST: "0.00",
						vST: "0.00",
						vFCPST: "0.00",
						vFCPSTRet: "0.00",
						vProd: "119.40",
						vFrete: "0.00",
						vSeg: "0.00",
						vDesc: "11.40",
						vII: "0.00",
						vIPI: "0.00",
						vIPIDevol: "0.00",
						vPIS: "1.78",
						vCOFINS: "8.21",
						vOutro: "0.00",
						vNF: "108.00",
						vTotTrib: "36.27",
					},
				},
				transp: {
					modFrete: "9",
					vol: {
						qVol: "6",
					},
				},
				cobr: {
					fat: {
						nFat: "59988",
						vOrig: "108.00",
						vDesc: "0.00",
						vLiq: "108.00",
					},
					dup: {
						nDup: "001",
						dVenc: "2025-04-08",
						vDup: "108.00",
					},
				},
				pag: {
					detPag: {
						indPag: "0",
						tPag: "01",
						vPag: "108.00",
					},
				},
				infAdic: {
					infCpl: "MAQ CART, Total aproximado de tributos da nota: R$16.83 (15.58% Fed Nac) R$19.44 (18.00% Est) Fonte tributaria: IBPT",
				},
				infRespTec: {
					CNPJ: "26314062000161",
					xContato: "Fabio Tulio Felippe",
					email: "marketing@sankhya.com.br",
					fone: "3432390700",
				},
			},
			Signature: {
				$: {
					xmlns: "http://www.w3.org/2000/09/xmldsig#",
				},
				SignedInfo: {
					CanonicalizationMethod: {
						$: {
							Algorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
						},
					},
					SignatureMethod: {
						$: {
							Algorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
						},
					},
					Reference: {
						$: {
							URI: "#NFe31250407602070000169550010000599881350304070",
						},
						Transforms: {
							Transform: [
								{
									$: {
										Algorithm: "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
									},
								},
								{
									$: {
										Algorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
									},
								},
							],
						},
						DigestMethod: {
							$: {
								Algorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
							},
						},
						DigestValue: "NnLP6TdQwHs7El+7t5JsIq8Dm+k=",
					},
				},
				SignatureValue:
					"ecYTALrqI1aoGGYE4vR0ctFlSbSPy0NI/yMlwxYs9IgfMu2JPuiHIvWFNPuPU/Me21I1Fw7npHp7QjhqMd+Lrl/kAdgbDHBPfGORPVsR4gZJiDspt1DkDvdZbzx1ETzNUq2KVuyGxV0BQGQupJDv9SpWvG7II0wr0z5G6TAOcOBNTNEZXDa+HQjPeSnQkrOLsY4wDLy/79g1lq1GKC+YxFk9u4GEArNfLHmJzjQRLIdZkPfqSovP5pKPqz1xbTHM1C/f5qPs6yKxslFi5dVKz9JdIdiATZUnU665EMVw55asTJ77NPpiihMUKFuoL3t/nU69k1lZpN6UiEYD2JVb8A==",
				KeyInfo: {
					X509Data: {
						X509Certificate:
							"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",
					},
				},
			},
		},
		protNFe: {
			$: {
				versao: "4.00",
			},
			infProt: {
				tpAmb: "1",
				verAplic: "W-3.2.83",
				chNFe: "31250407602070000169550010000599881350304070",
				dhRecbto: "2025-04-08T16:31:03-03:00",
				nProt: "131256581088347",
				digVal: "NnLP6TdQwHs7El+7t5JsIq8Dm+k=",
				cStat: "100",
				xMotivo: "Autorizado o uso da NF-e",
			},
		},
	},
};

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
			<div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
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
						className="rounded-lg border border-gray-200 p-1 text-center text-[0.6rem] tracking-tight text-gray-500 shadow-sm outline-none placeholder:italic"
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
						className="rounded-lg border border-gray-200 p-1 text-center text-[0.6rem] tracking-tight text-gray-500 shadow-sm outline-none placeholder:italic"
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
