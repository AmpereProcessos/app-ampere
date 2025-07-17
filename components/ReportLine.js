import { getMetadata, ref } from "firebase/storage";
import React, { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdAttach, IoMdCheckbox } from "react-icons/io";
import { TbDownload } from "react-icons/tb";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/services/firebase/firebase-storage";
import axios from "axios";
import Image from "next/image";
function ReportLine({ report, count }) {
	const [showInfo, setShowInfo] = useState(false);
	async function handleDownload(fileLink, titulo) {
		var splitFileName = titulo.replace("/", "").toUpperCase().split(" ");
		var fixedFileName = splitFileName.join("_");

		let fileRef = ref(storage, fileLink);
		const metadata = await getMetadata(fileRef);

		const filePath = fileRef.fullPath;
		const extension = fileTypes[metadata.contentType]?.extension;

		try {
			const response = await axios.get(`/api/firebase/download?filePath=${encodeURIComponent(filePath)}`, {
				responseType: "blob",
			});
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${fixedFileName}${extension}`);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			alert("Houve um erro no download do arquivo.");
		}

		// const xhr = new XMLHttpRequest();
		// xhr.responseType = "blob";
		// xhr.onload = (event) => {
		//   const blob = xhr.response;
		//   console.log(blob);
		// };
		// xhr.open("GET", url);
		// xhr.send();

		// let fileRef = ref(storage, obj.link);
		// const resp = await getBlob(fileRef);
		// console.log(resp);
	}
	return (
		<div className="w-full flex flex-col py-1">
			<div className="w-full flex flex-col lg:flex-row items-center justify-between pr-2">
				<div className="flex items-center gap-2 w-full lg:w-[60%]">
					{showInfo ? (
						<div className="text-gray-600 hover:text-blue-400 cursor-pointer">
							<IoMdArrowDropupCircle style={{ fontSize: "18px" }} onClick={() => setShowInfo(false)} />
						</div>
					) : (
						<div className="text-gray-600 hover:text-blue-400 cursor-pointer">
							<IoMdArrowDropdownCircle style={{ fontSize: "18px" }} onClick={() => setShowInfo(true)} />
						</div>
					)}
					<p className="text-xs lg:text-sm font-medium text-gray-700">{report.nomeAtividade ? `ATUALIZAÇÕES DA ATIVIDADE ${report.nomeAtividade}` : "ATUALIZAÇÕES DA OPERAÇÃO"}</p>
				</div>
				<p className="text-xs text-center lg:text-sm font-medium text-gray-700 w-full lg:w-[20%]">RELATÓRIO Nº {count}</p>
				<div className="flex items-center justify-end gap-2 w-full lg:w-[20%]">
					<AiOutlineCalendar style={{ color: "#fead61" }} />
					<p className="text-sm font-light text-gray-500">{report.data ? new Date(report.data).toLocaleDateString() : null}</p>
				</div>
			</div>
			{showInfo ? (
				<div className="w-full flex flex-col items-center border-t border-gray-300 pt-1 mt-1">
					<div className="flex flex-col items-center w-full">
						<h1 className="text-sm font-normal text-gray-600 mb-1">ATIVIDADES REALIZADAS</h1>
						<div className="flex flex-col gap-2 w-full lg:w-[30%]">
							{report.atividades.map((activity, index) => (
								<div className="flex items-center gap-2" key={index}>
									<IoMdCheckbox style={{ color: "rgb(34,197,94)" }} />
									<p className="text-xs text-gray-800 font-thin">
										{index + 1}) {activity}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col items-center w-full mt-4 lg:mt-2">
						<h1 className="text-sm font-normal text-gray-600 mb-1">ANEXOS</h1>

						<div className="w-full flex flex-wrap justify-around">
							{report.links.map((link, index) => (
								<div className="flex items-center gap-2 my-2" key={index}>
									{link.formato.includes("IMAGEM") ? (
										<div className="flex flex-col w-full">
											<p className="text-xs text-[#15599a] font-bold text-center">{link.titulo}</p>
											<div className="w-[250px] h-[250px] relative cursor-pointer">
												<Image onClick={() => handleDownload(link.link, link.titulo)} src={link.link} layout="fill" fill={true} />
											</div>
										</div>
									) : (
										<>
											<IoMdAttach style={{ color: "rgb(34,197,94)" }} />
											<a className="text-xs text-[#15599a] font-bold text-center" href={link.link}>
												{link.titulo} ({link.formato})
											</a>
											<div
												onClick={() => handleDownload(link.link, link.titulo)}
												className="flex items-center justify-center text-blue-700 hover:text-blue-500 hover:scale-105 duration-300 ease-in-out cursor-pointer"
											>
												<TbDownload />
											</div>
										</>
									)}
								</div>
							))}
						</div>
					</div>
					<div className="w-full flex flex-col p-2 mt-4 lg:mt-2">
						<h1 className="text-sm font-extralight text-gray-600 mb-1 text-center">ANOTAÇÕES</h1>
						<p className="w-full text-center text-xs text-gray-800 bg-gray-100 font-thin border border-gray-300 p-2">
							{report.anotacoes ? report.anotacoes : "Sem anotações preenchidas."}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default ReportLine;
