import { getMetadata, ref } from "firebase/storage";
import React, { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDropupCircle,
  IoMdAttach,
  IoMdCheckbox,
} from "react-icons/io";
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
      const response = await axios.get(
        `/api/firebase/download?filePath=${encodeURIComponent(filePath)}`,
        {
          responseType: "blob",
        },
      );
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
    <div className="flex w-full flex-col py-1">
      <div className="flex w-full flex-col items-center justify-between pr-2 lg:flex-row">
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          {showInfo ? (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle
                style={{ fontSize: "18px" }}
                onClick={() => setShowInfo(false)}
              />
            </div>
          ) : (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "18px" }}
                onClick={() => setShowInfo(true)}
              />
            </div>
          )}
          <p className="text-foreground text-xs font-medium lg:text-sm">
            {report.nomeAtividade
              ? `ATUALIZAÇÕES DA ATIVIDADE ${report.nomeAtividade}`
              : "ATUALIZAÇÕES DA OPERAÇÃO"}
          </p>
        </div>
        <p className="text-foreground w-full text-center text-xs font-medium lg:w-[20%] lg:text-sm">
          RELATÓRIO Nº {count}
        </p>
        <div className="flex w-full items-center justify-end gap-2 lg:w-[20%]">
          <AiOutlineCalendar style={{ color: "#fead61" }} />
          <p className="text-foreground text-sm font-light">
            {report.data ? new Date(report.data).toLocaleDateString() : null}
          </p>
        </div>
      </div>
      {showInfo ? (
        <div className="border-border mt-1 flex w-full flex-col items-center border-t pt-1">
          <div className="flex w-full flex-col items-center">
            <h1 className="text-foreground mb-1 text-sm font-normal">ATIVIDADES REALIZADAS</h1>
            <div className="flex w-full flex-col gap-2 lg:w-[30%]">
              {report.atividades.map((activity, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <IoMdCheckbox style={{ color: "rgb(34,197,94)" }} />
                  <p className="text-foreground text-xs font-thin">
                    {index + 1}) {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col items-center lg:mt-2">
            <h1 className="text-foreground mb-1 text-sm font-normal">ANEXOS</h1>

            <div className="flex w-full flex-wrap justify-around">
              {report.links.map((link, index) => (
                <div className="my-2 flex items-center gap-2" key={index}>
                  {link.formato.includes("IMAGEM") ? (
                    <div className="flex w-full flex-col">
                      <p className="text-center text-xs font-bold text-[#15599a]">{link.titulo}</p>
                      <div className="relative h-[250px] w-[250px] cursor-pointer">
                        <Image
                          onClick={() => handleDownload(link.link, link.titulo)}
                          src={link.link}
                          layout="fill"
                          fill={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <IoMdAttach style={{ color: "rgb(34,197,94)" }} />
                      <a className="text-center text-xs font-bold text-[#15599a]" href={link.link}>
                        {link.titulo} ({link.formato})
                      </a>
                      <div
                        onClick={() => handleDownload(link.link, link.titulo)}
                        className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
                      >
                        <TbDownload />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col p-2 lg:mt-2">
            <h1 className="text-foreground mb-1 text-center text-sm font-extralight">ANOTAÇÕES</h1>
            <p className="border-border bg-primary/20 text-foreground w-full border p-2 text-center text-xs font-thin">
              {report.anotacoes ? report.anotacoes : "Sem anotações preenchidas."}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ReportLine;
