import React, { useState } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/services/firebase/firebase-storage";
import { getErrorMessage } from "../../utils/methods/handlers";
import { createManyFileReferences } from "../../utils/methods/mutation/crm/file-references";

import toast from "react-hot-toast";
function EtapaTelhado({ session, next, order }) {
	const [checkRoofStage, setCheckRoofStage] = useState(false);
	const [inProgress, setInProgress] = useState(false);
	const [files, setFiles] = useState({});

	function validateStage() {
		if (!checkRoofStage) {
			toast.error("Por favor, preencha a sobre a execução das conferências.");

			return false;
		}
		if (!files.fotoEtiquetaModulos) {
			toast.error("Por favor, anexe as fotos das etiquetas dos módulos.");

			return false;
		}
		if (!files.fotoEtiquetaInversores) {
			toast.error("Por favor, anexe foto(s) das etiquetas dos micros/inversores");

			return false;
		}
		if (!files.filmagemTelhadoPorCima) {
			toast.error("Por favor, anexe uma filmagem do telhado por cima.");

			return false;
		}
		if (!files.filmagemTelhadoPorBaixo) {
			toast.error("Por favor, anexe uma filmagem do telhado mostrando a parte de baixo.");

			return false;
		}
		if (!files.fotosTrilhosMontados) {
			toast.error("Por favor, anexe fotos dos trilhos montados.");

			return false;
		}
		{
		}
		if (order.detalhes?.topologia == "MICRO" && !files.fotosInversoresAlocados) {
			toast.error("Por favor, anexe foto(s) ou filmagem dos micros instalados.");

			return false;
		}
		if (order.detalhes?.topologia == "MICRO" && !files.fotosConexoesMicros) {
			toast.error("Por favor, anexe fotos das conexões dos micros instalados.");

			return false;
		}
		if (!files.fotosPaineisInstalados) {
			toast.error("Por favor, anexe foto(s) ou filmagem dos painéis instalados.");

			return false;
		}

		return true;
	}
	async function uploadFiles() {
		var holder;
		var links = [];
		try {
			if (files.fotoEtiquetaModulos) {
				for (let i = 0; i < files.fotoEtiquetaModulos.length; i++) {
					let file = files.fotoEtiquetaModulos.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoEtiquetaModulos${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO ETIQUETA DO MÓDULO (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotoEtiquetaInversores) {
				for (let i = 0; i < files.fotoEtiquetaInversores.length; i++) {
					let file = files.fotoEtiquetaInversores.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoEtiquetaInversores${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO ETIQUETA DO INVERSOR (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.filmagemTelhadoPorCima) {
				for (let i = 0; i < files.filmagemTelhadoPorCima.length; i++) {
					let file = files.filmagemTelhadoPorCima.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/filmagemTelhadoPorCima${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FILMAGEM DO TELHADO (POR CIMA) (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.filmagemTelhadoPorBaixo) {
				for (let i = 0; i < files.filmagemTelhadoPorBaixo.length; i++) {
					let file = files.filmagemTelhadoPorBaixo.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/filmagemTelhadoPorBaixo${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FILMAGEM DO TELHADO (POR BAIXO) (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotosTrilhosMontados) {
				for (let i = 0; i < files.fotosTrilhosMontados.length; i++) {
					let file = files.fotosTrilhosMontados.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotosTrilhosMontados${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO DOS TRILHOS MONTADOS (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotosInversoresAlocados) {
				for (let i = 0; i < files.fotosInversoresAlocados.length; i++) {
					let file = files.fotosInversoresAlocados.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotosInversoresAlocados${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO DOS MICROS/INVERSORES FIXADOS (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotosConexoesMicros) {
				for (let i = 0; i < files.fotosConexoesMicros.length; i++) {
					let file = files.fotosConexoesMicros.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotosConexoesMicros${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO DAS CONEXÕES DOS MICROS (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			if (files.fotosPaineisInstalados) {
				for (let i = 0; i < files.fotosPaineisInstalados.length; i++) {
					let file = files.fotosPaineisInstalados.item(i);
					var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotosPaineisInstalados${i + 1}`);
					let res = await uploadBytes(imageRef, file);
					const size = res.metadata.size;

					let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
					links.push({
						title: `FOTO DOS PAINÉIS INSTALADOS (${i + 1})`,
						link: url,
						format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : "INDEFINIDO",
						size,
					});
				}
			}
			return links;
		} catch (error) {
			const msg = getErrorMessage(error);
			toast.dismiss();
			toast.error(msg);
			throw error;
		}
	}

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
				setCookie(null, `STAGE-${order._id}`, "1");
				toast.dismiss(loadingToastId);
				toast.success("Arquivos enviados com sucesso !");
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
				<h1 className="w-full text-center font-bold">ETAPA TELHADO</h1>
				<p className="text-primary/80 text-xs font-bold italic">
					(OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO <strong className="text-[#15599a]">NOTECAM</strong>.)
				</p>
			</div>
			<div className="border-primary/20 my-2 flex flex-col items-center gap-y-2 border-y py-2">
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DOS SUPORTES COM APERTO DE TODOS OS PARAFUSOS E CONFERIR</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DOS TRILHOS COM APERTO DE TODOS OS PARAFUSOS E CONFERIR TELHAS ALTAS E ONDAS BAIXAS</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DA MANTA ASFÁLTICA (PICHE) NAS SAÍDAS DOS GANCHOS, TELHAS ALTAS E ONDAS BAIXAS</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FAZER ATERRAMENTO DE TODOS OS TRILHOS E COLOCAR AS PONTAS DOS TERRAS PRA DENTRO DA LAJE</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">FIXAÇÃO DOS MICROS INVERSORES E ATERRAR OS MESMOS</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						VERIFICAR SE TODAS AS CONEXÕES DE CORRENTE ALTERANADA DOS MICROS ESTEJAM ESTANHADAS E ISOLADAS CORRETAMENTE
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">VERIFICAR SE OS TAPÕES FORAM COLOCADOS NO FINAL DOS MICROS INVERSORES</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						ANTES DA MONTAGEM DOS MÓDULOS FAZER INSPEÇÃO VISUAL SE ESTÁ TUDO CORRETO E CONFERIR SE TEM TELHAS QUEBRADAS
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						DURANTE A FIXAÇÃO DOS MÓDULOS FAZER CONFERÊNCIA SE OS MÓDULOS ESTÃO SENDO CONECTADOS CORRETAMENTE TANTO EM SÉRIE OU NOS MICROS
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						DURANTE A FIXAÇÃO DOS MÓDULOS FAZER OUTRA INSPEÇÃO VISUAL MÓDULO A MÓDULO COM O INTUITO DE RETIRAR TELHAS QUEBRADAS
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">
						DURANTE TODA A MONTAGEM NO TELHADO LEVAR SACOLAS PARA IR ARMAZENANDO O LIXO QUE APARECE DURANTE O PROCESSO. (LIXO EM RUFOS E CALHAS, LIXO EM
						SAÍDAS DE ÁGUA, ABRAÇADEIRAS DESCARTADAS)
					</p>
				</div>
				<div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
					<BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
					<p className="col-span-9 font-medium">TIRAR UM FOTO E MANDA-LÁ NO GRUPO DO WHATSAPP DA EQUIPE TÉCNICA, RELATANDO CONCLUSÃO DA PRIMEIRA ETAPA.</p>
				</div>
			</div>
			<div className="flex items-center justify-center gap-2">
				<label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
				<input type={"checkbox"} checked={checkRoofStage} onChange={(e) => setCheckRoofStage(e.target.checked)} />
			</div>
			<h1 className="mt-5 w-full text-center text-lg font-bold text-[#fead61]">FOTOS/FILMAGENS</h1>
			<div className="flex flex-wrap justify-center gap-2">
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S) DAS ETIQUETAS DOS MÓDULOS</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.fotoEtiquetaModulos ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotoEtiquetaModulos.length == 1 ? files.fotoEtiquetaModulos[0].name : `${files.fotoEtiquetaModulos[0].name}...`}
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
									fotoEtiquetaModulos: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".png, .jpeg, .pdf"
						/>
					</div>
				</div>
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S) DAS ETIQUETAS DOS INVERSORES</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.fotoEtiquetaInversores ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotoEtiquetaInversores.length == 1 ? files.fotoEtiquetaInversores[0].name : `${files.fotoEtiquetaInversores[0].name}...`}
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
									fotoEtiquetaInversores: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".png, .jpeg, .pdf"
						/>
					</div>
				</div>
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FILMAGEM DE TODO O TELHADO (POR CIMA)</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.filmagemTelhadoPorCima ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.filmagemTelhadoPorCima.length == 1 ? files.filmagemTelhadoPorCima[0].name : `${files.filmagemTelhadoPorCima[0].name}...`}
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
									filmagemTelhadoPorCima: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".mp4"
						/>
					</div>
				</div>
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FILMAGEM DE TODO O TELHADO (POR BAIXO)</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.filmagemTelhadoPorBaixo ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.filmagemTelhadoPorBaixo.length == 1 ? files.filmagemTelhadoPorBaixo[0].name : `${files.filmagemTelhadoPorBaixo[0].name}...`}
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
									filmagemTelhadoPorBaixo: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".mp4"
						/>
					</div>
				</div>
				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S) DOS TRILHOS MONTADOS</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.fotosTrilhosMontados ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotosTrilhosMontados.length == 1 ? files.fotosTrilhosMontados[0].name : `${files.fotosTrilhosMontados[0].name}...`}
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
									fotosTrilhosMontados: e.target.files,
								})
							}
							className="h-full w-full opacity-0"
							type="file"
							multiple={true}
							accept=".png, .jpeg, .pdf"
						/>
					</div>
				</div>
				{order?.detalhes?.topologia == "MICRO-INVERSOR" || order?.detalhes?.topologia == "MICRO" ? (
					<>
						<div className="flex w-fit flex-col items-center">
							<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S)/FILMAGEM DOS MICROS/INVERSORES INSTALADOS</label>
							<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
								<div className="absolute">
									{files.fotosInversoresAlocados ? (
										<div className="flex flex-col items-center">
											<i className="fa fa-folder-open fa-4x text-blue-700"></i>
											<span className="block text-center font-normal text-gray-400">
												{files.fotosInversoresAlocados.length == 1 ? files.fotosInversoresAlocados[0].name : `${files.fotosInversoresAlocados[0].name}...`}
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
											fotosInversoresAlocados: e.target.files,
										})
									}
									className="h-full w-full opacity-0"
									type="file"
									multiple={true}
									accept=".png, .jpeg, .pdf"
								/>
							</div>
						</div>
						<div className="flex w-fit flex-col items-center">
							<label className="ml-2 text-center font-bold text-[#15599a]">FOTO(S) DAS CONEXÕES DOS MICROS</label>
							<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
								<div className="absolute">
									{files.fotosConexoesMicros ? (
										<div className="flex flex-col items-center">
											<i className="fa fa-folder-open fa-4x text-blue-700"></i>
											<span className="block text-center font-normal text-gray-400">
												{files.fotosConexoesMicros.length == 1 ? files.fotosConexoesMicros[0].name : `${files.fotosConexoesMicros[0].name}...`}
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
											fotosConexoesMicros: e.target.files,
										})
									}
									className="h-full w-full opacity-0"
									type="file"
									multiple={true}
									accept=".png, .jpeg, .pdf"
								/>
							</div>
						</div>
					</>
				) : null}

				<div className="flex w-fit flex-col items-center">
					<label className="ml-2 text-center font-bold text-[#15599a]">FOTOS DOS PAINÉIS INSTALADOS</label>
					<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
						<div className="absolute">
							{files.fotosPaineisInstalados ? (
								<div className="flex flex-col items-center">
									<i className="fa fa-folder-open fa-4x text-blue-700"></i>
									<span className="block text-center font-normal text-gray-400">
										{files.fotosPaineisInstalados.length == 1 ? files.fotosPaineisInstalados[0].name : `${files.fotosPaineisInstalados[0].name}...`}
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
									fotosPaineisInstalados: e.target.files,
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
					disabled={inProgress}
					onClick={goNextStage}
					className="disabled:bg-primary/60 rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out hover:scale-105 hover:bg-[#15599a] hover:text-white disabled:text-white disabled:opacity-70"
				>
					PRÓXIMO
				</button>
			</div>
		</div>
	);
}

export default EtapaTelhado;
