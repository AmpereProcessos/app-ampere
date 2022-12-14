import React, { useState } from "react";
import SelectInput from "./SelectInput";

function FormVisitaTecnicaDesenho({
  dados,
  setDados,
  images,
  setImages,
  uploadImages,
}) {
  const [imagesOK, setImagesOK] = useState(false);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function validateFields() {
    if (dados.tipoDesenho == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de desenho a ser requisitado.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.localizacaoInstalacao.trim().length < 5) {
      setMsg({
        text: "Por favor, preencha uma localização válida",
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
        DESENHO PERSONALIZADO
      </span>
      <div className="flex flex-col w-full text-sm lg:text-base items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          OBSERVAÇÕES PERTINENTES
        </span>
        <input
          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
          value={dados.obsDesenho}
          placeholder={"DEIXE AQUI OBSERVAÇÕES SOBRE ESSA SOLICITAÇÃO"}
          onChange={(e) =>
            setDados({
              ...dados,
              obsDesenho: e.target.value.toUpperCase(),
            })
          }
          type="text"
        />
      </div>
      <div className="flex items-center justify-center mt-2">
        <SelectInput
          label="TIPO DE DESENHO"
          editable={true}
          value={dados.tipoDesenho ? dados.tipoDesenho : "NÃO DEFINIDO"}
          options={[
            { label: "SOLAR EDGE DESIGN", value: "SOLAR EDGE DESIGN" },
            { label: "REVIT 3D", value: "REVIT 3D" },
            { label: "AUTOCAD 2D", value: "AUTOCAD 2D" },
            {
              label: "APENAS VIABILIDADE DE ESPAÇO",
              value: "APENAS VIABILIDADE DE ESPAÇO",
            },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoDesenho: value })}
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-fit flex flex-col items-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="contaDeEnergia"
          >
            FOTOS DO LOCAL DA INSTALAÇÃO
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
                      [`localInstalacao${index + 1}-`]: {
                        title: `LOCAL DE INSTALAÇÃO ARQUIVO ${index + 1}`,
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
              accept=".png, .jpeg, .pdf"
              multiple={true}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full text-sm lg:text-base items-center mt-2">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          LOCALIZAÇÃO DO LOCAL DE INSTALAÇÃO
        </span>
        <input
          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
          value={dados.localizacaoInstalacao}
          placeholder={"DESCREVA AQUI DETALHES DA ORÇAMENTAÇÃO"}
          onChange={(e) =>
            setDados({
              ...dados,
              localizacaoInstalacao: e.target.value.toUpperCase(),
            })
          }
          type="text"
        />
      </div>
      {msg.text && (
        <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>
      )}
      <div className="flex justify-center items-center mt-3">
        <button
          onClick={handleSend}
          className="bg-[#fead61] hover:bg-[#15599a] text-center hover:text-white font-bold p-2 rounded w-fit"
        >
          ENVIAR FORMULÁRIO
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaDesenho;
