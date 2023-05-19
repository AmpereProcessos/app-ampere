import React, { useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";

function OperationReportBlock({ data, setReportInfo }) {
  const [fileHolder, setFileHolder] = useState({
    name: "",
    file: null,
    error: null,
  });
  const [files, setFiles] = useState([]);
  const [reportActivityHolder, setReportActivityHolder] = useState({
    text: "",
    error: null,
  });
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
  }
  console.log(files);
  return (
    <div className="w-full flex flex-col py-4 items-center">
      <h1 className="text-gray-700 font-medium w-full text-start">
        REPORTAR ATUALIZAÇÕES À{" "}
        <strong className="text-[#fead61]">
          {data.nomeAtividade ? data.nomeAtividade : "OPERAÇÃO"}
        </strong>{" "}
      </h1>
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
            className="w-full lg:w-[50%] flex items-center justify-between"
            key={index}
          >
            <p className="text-sm text-blue-400 grow text-center break-words break-all">
              {filesInfo.name}
            </p>
            <button
              onClick={() => {
                var filesArr = files;
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
          Sem arquivos adicionadoss ao relatório...
        </p>
      )}
    </div>
  );
}

export default OperationReportBlock;
