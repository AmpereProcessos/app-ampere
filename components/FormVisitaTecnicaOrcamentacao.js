import React, { useState } from "react";
import SelectFloatingInput from "./SelectFloatingInput";

function FormVisitaTecnicaOrcamentacao({
  dados,
  setDados,
  uploadImages,
  images,
  setImages,
  sendStatus,
}) {
  const [imagesOK, setImagesOK] = useState(false);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function validateFields() {
    if (
      dados.tipoOrcamentacao == "NÃO DEFINIDO" ||
      dados.tipoOrcamentacao == null
    ) {
      setMsg({
        text: "Por favor, preencha o tipo de orçamentação.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  function handleSend() {
    if (validateFields()) {
      uploadImages();
    }
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ORÇAMENTAÇÃO
      </span>
      <div className="flex gap-2 justify-around flex-wrap mt-4">
        <SelectFloatingInput
          label={"TIPO DE ORÇAMENTAÇÃO"}
          editable={true}
          width={"450px"}
          value={
            dados.tipoOrcamentacao ? dados.tipoOrcamentacao : "NÃO DEFINIDO"
          }
          options={[
            { label: "PADRÃO", value: "PADRÃO" },
            { label: "BARRACÃO COM TELHA", value: "BARRACÃO COM TELHA" },
            { label: "BARRACÃO SEM TELHA", value: "BARRACÃO SEM TELHA" },
            { label: "SUBESTAÇÃO", value: "SUBESTAÇÃO" },
            {
              label: "INFRAESTRUTURA ELÉTRICA",
              value: "INFRAESTRUTURA ELÉTRICA",
            },
            {
              label: "OUTRO (INDIQUE NA DESCRIÇÃO)",
              value: "OUTRO (INDIQUE NA DESCRIÇÃO)",
            },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) =>
            setDados({ ...dados, tipoOrcamentacao: value })
          }
        />
      </div>
      <div className="flex flex-col w-full text-sm lg:text-base items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          DESCRIÇÃO PARA ORÇAMENTAÇÃO
        </span>
        <input
          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
          value={dados.descricaoOrcamentacao}
          placeholder={"DESCREVA AQUI DETALHES DA ORÇAMENTAÇÃO"}
          onChange={(e) =>
            setDados({
              ...dados,
              descricaoOrcamentacao: e.target.value.toUpperCase(),
            })
          }
          type="text"
        />
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-fit flex flex-col items-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="contaDeEnergia"
          >
            ARQUIVOS P/ AUXÍLIO DA ORÇAMENTAÇÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {imagesOK ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    ARQUIVOS ADICIONADOS
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal">
                    Adicione o arquivo aqui...
                  </span>
                </div>
              )}
            </div>
            <input
              onChange={(e) => {
                let obj = {};
                Array.prototype.forEach.call(
                  e.target.files,
                  function (file, index) {
                    obj = {
                      ...obj,
                      [`orcamentacao${index + 1}-`]: {
                        title: `ORÇAMENTAÇÃO ARQUIVO ${index + 1}`,
                        file: file,
                      },
                    };
                  }
                );
                setImagesOK(true);
                setImages({ ...images, ...obj });
                /*e.target.files.forEach((value, index) => {
                  obj = { ...obj, [`${index + 1}desenho`]: value };
                });*/
              }}
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              multiple={true}
            />
          </div>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>
      )}
      <div className="flex justify-center items-center mt-3">
        <button
          disabled={sendStatus == "loading"}
          onClick={handleSend}
          className="bg-[#fead61] hover:bg-[#15599a] text-center hover:text-white font-bold p-2 rounded w-fit disabled:bg-gray-500"
        >
          {sendStatus == "loading" ? "CARREGANDO" : "ENVIAR FORMULÁRIO"}
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaOrcamentacao;
