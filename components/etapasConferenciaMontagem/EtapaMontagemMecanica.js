import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { BsFillSunFill } from "react-icons/bs";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/services/firebase/firebase-storage";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/methods/handlers";
import { createManyFileReferences } from "../../utils/methods/mutation/crm/file-references";

function EtapaMontagemMecanica({ session, next, order }) {
	const [checkMountStage, setCheckMountStage] = useState(false);
	const [inProgress, setInProgress] = useState(false);
	const [files, setFiles] = useState({});

	async function uploadFiles() {
		var holder;
		var links = [];
		try {
			if (files.fotoFixacaoQDG) {
				for (let i = 0; i < files.fotoFixacaoQDG.length; i++) {
					let file = files.fotoFixacaoQDG.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido.nome}/fotoFixacaoQDG${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;
					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO FIXAÇÃO DO QDG (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotoInfraEletrica) {
				for (let i = 0; i < files.fotoInfraEletrica.length; i++) {
					let file = files.fotoInfraEletrica.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido.nome}/fotoInfraEletrica${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO/FILMAGEM INFRA ELÉTRICA (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotoPlacaGeracaoDistribuida) {
				for (let i = 0; i < files.fotoPlacaGeracaoDistribuida.length; i++) {
					let file = files.fotoPlacaGeracaoDistribuida.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido.nome}/fotoPlacaGeracaoDistribuida${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO PLACA DE GERAÇÃO DISTRIBUÍDA (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			return links;
		} catch (error) {
			toast.dismiss();
			const msg = getErrorMessage(error);
			toast.error(msg);
			throw error;
		}
	}

	// Field and files insert validation
	function validateStage() {
		if (!checkMountStage) {
			toast.error("Por favor, preencha sobre a conferença dos procedimentos dessa etapa.");

			return false;
		}
		if (!files.fotoFixacaoQDG) {
			toast.error("Por favor, anexe foto(s) da fixação do QDG.");

			return false;
		}

		if (order?.detalhes.topologia == "INVERSOR" && !files.fotoInfraEletrica) {
			toast.error("Por favor, anexe fotos/filmagem que contemplem a infraestrutura elétrica (inversor, stringbox, conduletes e eletrodutos).");

			return false;
		}
		if (!files.fotoPlacaGeracaoDistribuida) {
			toast.error("Por favor, anexe uma foto da placa de geração distribuída.");

			return false;
		}

		return true;
	}
	// Finish stage
	async function goNextStage() {
		if (validateStage()) {
			setInProgress(true);
			const loadingToastId = toast.loading("Processando...");
			try {
				let links = await uploadFiles();
				const fileReferences = links.map((l) => ({
					titulo: l.title,
					categorias: ["SERVIÇOS"],
					formato: l.format,
					url: l.link,
					tamanho: l.size,
					idProjeto: order.projeto?.id,
					idOrdemServico: order._id,
					autor: { id: session?.user.id, nome: session?.user.nome, avatar_url: session?.user.avatar_url },
					dataInsercao: new Date().toISOString(),
				}));
				await createManyFileReferences({ info: fileReferences });

				// if (order.projeto?.id) await updateUser({ links: links, projectId: order.projeto.id })
				toast.dismiss(loadingToastId);
				toast.success("Arquivos enviados com sucesso !");
				setCookie(null, `STAGE-${order._id}`, "2");
				setInProgress(false);
				return next();
			} catch (error) {
				setInProgress(false);
				toast.dismiss(loadingToastId);
				const msg = getErrorMessage(error);
				toast.error(msg);
			}
		}
	}
	return (
		<div className="my-2 flex w-full flex-col">
			<div className="flex flex-col items-center justify-between bg-[#fead61] p-2 text-white">
				<h1 className="w-full text-center font-bold">ETAPA MONTAGEM MECÂNICA E INVERSORES</h1>
				<p className="text-xs font-bold italic text-gray-600">
					(OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO <strong className="text-[#15599a]">NOTECAM</strong>.)
				</p>
			</div>
			<div className="my-2 flex flex-col items-center gap-y-2 border-y border-gray-300 py-2">
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">DETERMINAR O LOCAL JUNTO COM O CLIENTE</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">ANTES DE COMEÇAR A MONTAGEM DOS INVERSORES FAZER INSPEÇÃO VISUAL PARA EVITAR QUE OS EQUIPAMENTOS MOLHEM OU PEGUEM SOL</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">OBSERVAR SE TEM CANO DE AGUA PRÓXIMO OU REGISTRO DE AGUA, SE EXISTE MONTAGEM E CANOS DE FIOS OU CABOS ELÉTRICOS TAMBÉM</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DO INVERSOR, STRING BOX E QUADRO DE DISTRIBUIÇÃO GERAL (QDG)</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">SEGUIR O ESQUEMA DE MONTAGEM DO PROJETO</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DOS CONDULETES E ELETRODUTOS</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">SEMPRE OBSERVAR SE OS ELETRODUTOS E CONDULETES, INVERSORES, STRING E QDG ESTÃO FICANDO BEM FIXADOS</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">SEMPRE UTILIZAR O NÍVEL DE MÃO</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						CONCLUINDO A MONTAGEM FAZER INSPEÇÃO VISUAL DE TODA A MONTAGEM, PARA GARANTIR QUE NÃO ESTEJA FALTANDO NADA, PRINCIPALMENTE PARAFUSO DE BOX RETO E ADESIVOS DA AMPÉRE
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DA PLACA DE AVISO DE GERAÇÃO DISTRIBUÍDA</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">TIRAR UMA FOTO E MANDA-LÁ NO GRUPO DO WHATSAPP DA EQUIPE TÉCNICA, RELATANDO A CONCLUSÃO DA SEGUNDA ETAPA</p>
				</div>
			</div>
			<div className="flex items-center justify-center gap-2">
				<label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
				<input type={"checkbox"} checked={checkMountStage} onChange={(e) => setCheckMountStage(e.target.checked)} />
			</div>
			<h1 className="mt-5  w-full text-center text-lg font-bold text-[#fead61]">FOTOS/FILMAGENS</h1>
			<div className="flex flex-wrap justify-center gap-2">
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S) DA FIXAÇÃO/MONTAGEM DO QUADRO DE DISTRIBUIÇÃO CA (OU QUADRO AUXILIAR)</label>
					<div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
						<div className="absolute">
							{files.fotoFixacaoQDG ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotoFixacaoQDG.length == 1 ? files.fotoFixacaoQDG[0].name : `${files.fotoFixacaoQDG[0].name}...`}
									</span>
								</div>
							) : (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
								</div>
							)}
						</div>
						<input
							onChange={(e) =>
								setFiles({
									...files,
									fotoFixacaoQDG: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".png, .jpeg, .pdf"
						/>
					</div>
				</div>
				{order.detalhes?.topologia == "INVERSOR" && (
					<>
						<div className="flex w-fit flex-col items-center">
							<label className="ml-2 text-center font-bold text-[#15599a]">FOTOs/FILMAGEM DA INFRAESTRUTURA ELÉTRICA (INVERSOR, STRINGBOX, CONDULETES, ELETRODUTOS)</label>
							<div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
								<div className="absolute">
									{files.fotoInfraEletrica ? (
										<div className="flex flex-col items-center">
											<i className="fa fa-folder-open fa-4x text-blue-700"></i>
											<span className="block text-center font-normal text-gray-400">
												{files.fotoInfraEletrica.length == 1 ? files.fotoInfraEletrica[0].name : `${files.fotoInfraEletrica[0].name}...`}
											</span>
										</div>
									) : (
										<div className="flex flex-col items-center">
											<i className="fa fa-folder-open fa-4x text-blue-700"></i>
											<span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
										</div>
									)}
								</div>
								<input
									onChange={(e) =>
										setFiles({
											...files,
											fotoInfraEletrica: e.target.files,
										})
									}
									className="h-full w-full opacity-0"
									type="file"
									multiple={true}
									accept=".png, .jpeg, .pdf, .mp4"
								/>
							</div>
						</div>
					</>
				)}
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTO DA FIXAÇÃO DA PLACA DE GERAÇÃO DISTRIBUÍDA</label>
					<div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
						<div className="absolute">
							{files.fotoPlacaGeracaoDistribuida ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotoPlacaGeracaoDistribuida.length == 1 ? files.fotoPlacaGeracaoDistribuida[0].name : `${files.fotoPlacaGeracaoDistribuida[0].name}...`}
									</span>
								</div>
							) : (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
								</div>
							)}
						</div>
						<input
							onChange={(e) =>
								setFiles({
									...files,
									fotoPlacaGeracaoDistribuida: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".png, .jpeg, .pdf"
						/>
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-center">
				<button
					onClick={goNextStage}
					className="rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out disabled:bg-gray-500 disabled:text-white disabled:opacity-70 hover:scale-105 hover:bg-[#15599a] hover:text-white"
				>
					PRÓXIMO
				</button>
			</div>
		</div>
	);
}

export default EtapaMontagemMecanica;
