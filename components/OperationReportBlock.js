import React, { useEffect, useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import {
  IoMdAdd,
  IoMdArrowDropdownCircle,
  IoMdArrowDropupCircle,
  IoMdSend,
} from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import DateFloatingInput from "./DateFloatingInput";
import { fileTypes, formatDate } from "../utils/constants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../utils/firebase";
import axios from "axios";
import ReportLine from "./ReportLine";

function OperationReportBlock({
  data,
  setReportInfo,
  operationName,
  operationId,
}) {
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
      const { data } = await axios.get(
        `/api/operacoes/relatorios?id=${operationId}`
      );
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
              ? `operacoes/${fixedName}/${files[i].name}-{${j + 1}}`
              : `operacoes/${fixedName}/${files[i].name}`;
          const imageRef = ref(storage, storageName);
          const firebaseResponse = await uploadBytes(imageRef, file).catch(
            (err) => {
              throw "Houve um erro no envio das imagens.";
            }
          );
          const url = await getDownloadURL(
            ref(storage, firebaseResponse.metadata.fullPath)
          );
          const name =
            files[i].files.length > 1
              ? `${files[i].name} (${j + 1})`
              : `${files[i].name}`;
          linkArr = [
            ...linkArr,
            {
              titulo: name,
              link: url,
              formato: fileTypes[firebaseResponse.metadata.contentType]
                ? fileTypes[firebaseResponse.metadata.contentType].title
                : "INDEFINIDO",
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

    setFiles((prev) => [
      ...prev,
      { name: fileHolder.name, files: fileHolder.file },
    ]);
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
        idPai: operationId,
        links: linkArr,
      });
      setReportMsg((prev) => ({
        text: "",
        color: "",
        status: null,
      }));
      setReportInfo({
        nomeAtividade: null,
        atividades: [],
        anotacoes: "",
        data: new Date().toISOString(),
      });
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
    <div className="w-full flex flex-col py-4 items-center">
      <h1 className="text-gray-700 font-medium w-full text-start">
        REPORTAR ATUALIZAÇÕES À{" "}
        <strong className="text-[#fead61]">
          {data.nomeAtividade ? data.nomeAtividade : "OPERAÇÃO"}
        </strong>{" "}
      </h1>
      <div className="w-full lg:w-[50%] mt-3">
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
      <h3 className="text-sm text-gray-500 font-medium w-full text-center pb-2">
        LISTE ATIVIDADES FEITAS:
      </h3>
      <div className="flex items-center w-full lg:w-[50%] px-2 lg:px-0">
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
          className="grow outline-none border-b border-gray-500 text-sm p-2 text-center"
        />
        <button onClick={addActivity} className="text-green-500 text-lg">
          <IoMdAdd />
        </button>
      </div>
      {reportActivityHolder.error ? (
        <p className="text-xs italic text-red-500">
          {reportActivityHolder.error}
        </p>
      ) : null}
      <div className="flex flex-col w-full lg:w-[50%] py-2 px-2 lg:px-0">
        {data.atividades.length > 0 ? (
          data.atividades.map((activity, index) => (
            <div
              className="w-full max-w-full flex items-center justify-between"
              key={index}
            >
              <p className="text-sm text-gray-500 grow text-center break-words break-all">
                {activity}
              </p>
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
          <p className="text-xs text-center italic font-extralight text-gray-500 py-4">
            Sem atividades adicionadas ao relatório...
          </p>
        )}
      </div>
      <textarea
        value={data.anotacoes}
        onChange={(e) =>
          setReportInfo((prev) => ({ ...prev, anotacoes: e.target.value }))
        }
        placeholder="Relate aqui detalhes adicionais sobre o dia, problemas enfrentados, imprevistos, desvios de planejamento ou qualquer outra informação relevante."
        className="h-[100px] max-h-[100px] bg-gray-100 border border-gray-300 text-center resize-none w-full lg:w-[50%] outline-none p-2"
      />
      <h3 className="text-sm text-gray-500 font-medium w-full text-center py-2">
        ANEXE ARQUIVOS:
      </h3>
      <div className="w-full lg:w-[50%] flex items-center gap-2">
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
          className="w-full lg:w-[50%] outline-none border-b border-gray-500 text-sm p-2 text-center"
        />
        <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
          <div className="absolute">
            {fileHolder.file ? (
              <div className="flex flex-col items-center">
                <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                <span className="block text-gray-400 font-normal text-center text-sm">
                  {fileHolder.file.length == 1
                    ? fileHolder.file[0].name
                    : `${fileHolder.file[0].name}...`}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                <span className="block text-gray-400 font-normal">
                  Adicione o arquivo aqui
                </span>
              </div>
            )}
          </div>
          <input
            onChange={(e) =>
              setFileHolder((prev) => ({ ...prev, file: e.target.files }))
            }
            className="h-full w-full opacity-0"
            multiple={true}
            type="file"
            accept=".png, .jpeg, .jpg, .pdf, .docx, .doc"
          />
        </div>
        <button onClick={addFiles} className="text-green-500 text-lg">
          <IoMdAdd />
        </button>
      </div>
      {fileHolder.error ? (
        <p className="text-xs italic text-red-500">{fileHolder.error}</p>
      ) : null}
      {files.length > 0 ? (
        files.map((filesInfo, index) => (
          <div
            className="w-full lg:w-[50%] flex items-center justify-between mt-1"
            key={index}
          >
            <p className="text-sm text-blue-400 grow text-center break-words break-all">
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
        <p className="text-xs text-center italic font-extralight text-gray-500 py-4">
          Sem arquivos adicionados ao relatório...
        </p>
      )}
      <button
        onClick={sendReport}
        disabled={reportMsg.status == "loading"}
        className={`flex items-center gap-2 p-1 ${
          reportMsg.status == "loading"
            ? "animate-pulse bg-gray-400"
            : "bg-blue-300 hover:bg-blue-600"
        } hover:scale-105 duration-300 ease-in-out text-white font-medium rounded mt-2`}
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
      {reportMsg.text && !reportMsg.status ? (
        <p className={`text-sm italic ${reportMsg.color}`}>{reportMsg.text}</p>
      ) : null}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full p-1 bg-[#15599a] my-2">
          <p className="text-white font-medium text-center">
            HISTÓRICO DE RELATÓRIOS
          </p>
          {showReportHistory ? (
            <div className="text-white hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setShowReportHistory(false)}
              />
            </div>
          ) : (
            <div className="text-white hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setShowReportHistory(true)}
              />
            </div>
          )}
        </div>
        {reports ? (
          reports.length > 0 ? (
            reports.map((report, index) => (
              <ReportLine report={report} key={index} />
            ))
          ) : (
            <p className="py-4 text-center w-full animate-pulse text-gray-600 font-medium">
              Sem relatórios vinculados a essa operação.
            </p>
          )
        ) : (
          <p className="py-4 text-center w-full animate-pulse text-gray-600 font-medium">
            Buscando...
          </p>
        )}
      </div>
    </div>
  );
}

export default OperationReportBlock;
