import React, { useEffect, useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdAdd, IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdSend } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import DateFloatingInput from "./DateFloatingInput";
import { fileTypes, formatDate } from "../utils/constants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../utils/services/firebase/firebase-storage";
import axios from "axios";
import ReportLine from "./ReportLine";

function OperationReportBlock({ session, data, setReportInfo, operationName, operationId }) {
	const [reports, setReports] = useState();

	const [showReportHistory, setShowReportHistory] = useState(false);
	const [fileHolder, setFileHolder] = useState({
		name: "",
		file: null,
		error: null,
	});
	const [reportActivityHolder, setReportActivityHolder] = useState({
		text: "",
		error: null,
	});
	const [reportMsg, setReportMsg] = useState({
		text: "",
		color: "",
		status: null,
	});

	const [files, setFiles] = useState([]);
	async function fetchOperationReports() {
		try {
			const { data } = await axios.get(`/api/operacoes/relatorios?id=${operationId}`);
			setReports(data);
		} catch (error) {
			alert("Houve um erro ao buscar relatórios da operação.");
		}
	}

	async function uploadFiles() {
		var splitedName = operationName.replace("/", "").toLowerCase().split(" ");
		var fixedName = splitedName.join("_");
		try {
			var linkArr = [];
			setReportMsg((prev) => ({
				text: "Enviando arquivos...",
				color: "text-[#15599a]",
				status: "loading",
			}));
			for (let i = 0; i < files.length; i++) {
				for (let j = 0; j < files[i].files.length; j++) {
					let file = files[i].files.item(j);
					let storageName =
						files[i].files.length > 1
							? `operacoes/${fixedName}/${files[i].name}-{${j + 1}}-${new Date().toISOString()}`
							: `operacoes/${fixedName}/${files[i].name}-${new Date().toISOString()}`;
					const imageRef = ref(storage, storageName);
					const firebaseResponse = await uploadBytes(imageRef, file).catch((err) => {
						throw "Houve um erro no envio das imagens.";
					});
					const url = await getDownloadURL(ref(storage, firebaseResponse.metadata.fullPath));
					const name = files[i].files.length > 1 ? `${files[i].name} (${j + 1})` : `${files[i].name}`;
					linkArr = [
						...linkArr,
						{
							titulo: name,
							link: url,
							formato: fileTypes[firebaseResponse.metadata.contentType] ? fileTypes[firebaseResponse.metadata.contentType].title : "INDEFINIDO",
						},
					];
				}
			}
			console.log(linkArr);
			setReportMsg({ text: "Arquivos enviados!", color: "text-green-500" });
			return linkArr;
		} catch (error) {}
	}

	function addActivity() {
		if (reportActivityHolder.text.trim().length < 3) {
			setReportActivityHolder((prev) => ({
				...prev,
				error: "Por favor, preencha uma atividade com ao menos 3 letras.",
			}));
			return;
		}
		setReportActivityHolder((prev) => ({ text: "", error: null }));
		var activitiesArr = data.atividades ? data.atividades : [];
		activitiesArr.push(reportActivityHolder.text);
		setReportInfo((prev) => ({ ...prev, atividades: activitiesArr }));
	}
	function addFiles() {
		if (fileHolder.name.trim().length < 3) {
			setFileHolder((prev) => ({
				...prev,
				error: "Por favor, preencha um nome no mínimo 3 letras aos arquivos.",
			}));
			return;
		}
		if (!fileHolder.file) {
			setFileHolder((prev) => ({
				...prev,
				error: "Por favor, anexe os arquivos a serem vinculados.",
			}));
			return;
		}

		setFiles((prev) => [...prev, { name: fileHolder.name, files: fileHolder.file }]);
		setFileHolder({
			name: "",
			file: null,
			error: null,
		});
	}
	async function sendReport() {
		if (data.atividades.length == 0) {
			setReportMsg((prev) => ({
				...prev,
				text: "Por favor, adicione as atividades executadas.",
				color: "text-red-500",
			}));
			return;
		}
		var linkArr;
		try {
			if (files) {
				linkArr = await uploadFiles();
			}
			setReportMsg((prev) => ({
				text: "Enviando relatório...",
				color: "text-[#15599a]",
				status: "loading",
			}));
			await axios.post("/api/operacoes/relatorios", {
				...data,
				responsavel: {
					id: session.user.id,
					nome: session.user.nome,
				},
				idPai: operationId,
				links: linkArr,
			});
			setReportMsg((prev) => ({
				text: "Relatório enviado !",
				color: "text-[#15599a]",
				status: "loading",
			}));
			setTimeout(() => {
				setReportMsg((prev) => ({
					text: "",
					color: "",
					status: null,
				}));
			}, 2000);

			setReportInfo({
				nomeAtividade: null,
				atividades: [],
				anotacoes: "",
				data: new Date().toISOString(),
			});
			fetchOperationReports();
		} catch (error) {
			setReportMsg((prev) => ({
				text: "Houve um erro no envio do relatório. Por favor, tente novamente.",
				color: "text-red-500",
				status: "failure",
			}));
		}
	}
	useEffect(() => {
		fetchOperationReports();
	}, []);
	return (
		<div className="flex w-full flex-col items-center py-4">
			<h1 className="text-primary/70 w-full text-start font-medium">
				REPORTAR ATUALIZAÇÕES À <strong className="text-[#fead61]">{data.nomeAtividade ? data.nomeAtividade : "OPERAÇÃO"}</strong>{" "}
			</h1>
			<div className="mt-3 w-full lg:w-[50%]">
				<DateFloatingInput
					label={"DATA DO RELATÓRIO"}
					editable={true}
					value={data.data ? formatDate(data.data) : undefined}
					handleChange={(value) =>
						setReportInfo((prev) => ({
							...prev,
							data: new Date(value).toISOString(),
						}))
					}
					width={"100%"}
				/>
			</div>
			<h3 className="text-primary/60 w-full pb-2 text-center text-sm font-medium">LISTE ATIVIDADES FEITAS:</h3>
			<div className="flex w-full items-center px-2 lg:w-[50%] lg:px-0">
				<input
					type="text"
					value={reportActivityHolder.text}
					onChange={(e) =>
						setReportActivityHolder((prev) => ({
							...prev,
							text: e.target.value,
						}))
					}
					placeholder="Digite aqui uma descrição da atividade realizada."
					className="border-primary/60 grow border-b p-2 text-center text-sm outline-hidden"
				/>
				<button onClick={addActivity} className="text-lg text-green-500">
					<IoMdAdd />
				</button>
			</div>
			{reportActivityHolder.error ? <p className="text-xs text-red-500 italic">{reportActivityHolder.error}</p> : null}
			<div className="flex w-full flex-col px-2 py-2 lg:w-[50%] lg:px-0">
				{data.atividades.length > 0 ? (
					data.atividades.map((activity, index) => (
						<div className="flex w-full max-w-full items-center justify-between" key={index}>
							<p className="text-primary/60 grow text-center text-sm break-words break-all">{activity}</p>
							<button
								onClick={() => {
									var activitiesArr = data.atividades;
									activitiesArr.splice(index, 1);
									setReportActivityHolder((prev) => ({
										...prev,
										atividades: activitiesArr,
									}));
								}}
								className="text-red-500"
							>
								<AiOutlineMinus />
							</button>
						</div>
					))
				) : (
					<p className="text-primary/60 py-4 text-center text-xs font-extralight italic">Sem atividades adicionadas ao relatório...</p>
				)}
			</div>
			<textarea
				value={data.anotacoes}
				onChange={(e) => setReportInfo((prev) => ({ ...prev, anotacoes: e.target.value }))}
				placeholder="Relate aqui detalhes adicionais sobre o dia, clima, problemas enfrentados, imprevistos, desvios de planejamento ou qualquer outra informação relevante."
				className="border-primary/20 bg-primary/20 h-[150px] max-h-[150px] w-full resize-none border p-2 text-center outline-hidden lg:h-[100px] lg:max-h-[100px] lg:w-[50%]"
			/>
			<h3 className="text-primary/60 w-full py-2 text-center text-sm font-medium">ANEXE ARQUIVOS:</h3>
			<div className="flex w-full flex-col items-center gap-2 lg:w-[50%] lg:flex-row">
				<input
					type="text"
					value={fileHolder.name}
					onChange={(e) =>
						setFileHolder((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					placeholder="Digite aqui o(s) nome do(s) arquivo(s)."
					className="border-primary/60 w-full border-b p-2 text-center text-sm outline-hidden lg:w-[50%]"
				/>
				<div className="bg-primary/20 relative flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
					<div className="absolute">
						{fileHolder.file ? (
							<div className="flex flex-col items-center">
								<i className="fa fa-folder-open fa-4x text-blue-700"></i>
								<span className="text-xxs block text-center font-normal text-gray-400 lg:text-sm">
									{fileHolder.file.length == 1 ? fileHolder.file[0].name : `${fileHolder.file[0].name}...`}
								</span>
							</div>
						) : (
							<div className="flex flex-col items-center">
								<i className="fa fa-folder-open fa-4x text-blue-700"></i>
								<span className="block text-xs font-normal text-gray-400 lg:text-sm">Adicione o arquivo aqui</span>
							</div>
						)}
					</div>
					<input
						onChange={(e) => setFileHolder((prev) => ({ ...prev, file: e.target.files }))}
						className="h-full w-full opacity-0"
						multiple={true}
						type="file"
						accept=".png, .jpeg, .jpg"
					/>
				</div>
				<button onClick={addFiles} className="text-lg text-green-500">
					<IoMdAdd />
				</button>
			</div>
			{fileHolder.error ? <p className="text-xs text-red-500 italic">{fileHolder.error}</p> : null}
			{files.length > 0 ? (
				files.map((filesInfo, index) => (
					<div className="mt-1 flex w-full items-center justify-between lg:w-[50%]" key={index}>
						<p className="grow text-center text-sm break-words break-all text-blue-400">
							{filesInfo.name} ({filesInfo.files.length} arquivos)
						</p>
						<button
							onClick={() => {
								var filesArr = files;
								filesArr.splice(index, 1);
								setReportActivityHolder((prev) => ({
									...prev,
									atividades: filesArr,
								}));
							}}
							className="text-red-500"
						>
							<AiOutlineMinus />
						</button>
					</div>
				))
			) : (
				<p className="text-primary/60 py-1 text-center text-xs font-extralight italic">Sem arquivos adicionados ao relatório...</p>
			)}
			<button
				onClick={sendReport}
				disabled={reportMsg.status == "loading"}
				className={`flex items-center gap-2 p-1 ${
					reportMsg.status == "loading" ? "animate-pulse bg-gray-400" : "bg-blue-300 hover:bg-blue-600"
				} mt-2 rounded font-medium text-white duration-300 ease-in-out hover:scale-105`}
			>
				{reportMsg.status == "loading" ? (
					<>
						<p>{reportMsg.text}</p>
						<MdAccessTime />
					</>
				) : (
					<>
						<p>ENVIAR RELATÓRIO</p>
						<IoMdSend />
					</>
				)}
			</button>
			{reportMsg.text && !reportMsg.status ? <p className={`text-sm italic ${reportMsg.color}`}>{reportMsg.text}</p> : null}
			<div className="flex w-full flex-col">
				<div className="my-2 flex w-full items-center justify-between bg-[#15599a] p-1">
					<p className="text-center font-medium text-white">HISTÓRICO DE RELATÓRIOS</p>
					{showReportHistory ? (
						<div className="cursor-pointer text-white hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setShowReportHistory(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-white hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setShowReportHistory(true)} />
						</div>
					)}
				</div>
				{showReportHistory ? (
					reports ? (
						reports.length > 0 ? (
							reports.map((report, index) => <ReportLine report={report} key={index} count={reports.length - index} />)
						) : (
							<p className="text-primary/80 w-full animate-pulse py-4 text-center font-medium">Sem relatórios vinculados a essa operação.</p>
						)
					) : (
						<p className="text-primary/80 w-full animate-pulse py-4 text-center font-medium">Buscando...</p>
					)
				) : null}
			</div>
		</div>
	);
}

export default OperationReportBlock;
