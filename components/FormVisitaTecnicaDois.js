import React, { useState } from "react";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";

function FormVisitaTecnicaDois({
  dados,
  setDados,
  images,
  setImages,
  avancar,
  voltar,
}) {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });

  const [paInfo, setPAInfo] = useState({
    tipoDisjuntor: "NÃO DEFINIDO",
    amperagem: "NÃO DEFINIDO",
    numeroMedidor: "",
  });
  const [paArr, setPAArr] = useState([]);
  const [paMsg, setPAMsg] = useState({
    text: "",
    color: "",
  });
  function addPA() {
    if (paInfo.tipoDisjuntor == "NÃO DEFINIDO") {
      setPAMsg({
        text: "Por favor, preencha a tipo do disjuntor do padrão.",
        color: "text-red-500",
      });
      return;
    }
    // if (paInfo.amperagem == "NÃO DEFINIDO") {
    //   setPAMsg({
    //     text: "Por favor, preencha a amperagem.",
    //     color: "text-red-500",
    //   });
    //   return;
    // }
    if (paInfo.numeroMedidor.trim().length < 3) {
      setPAMsg({
        text: "Por favor, preencha um número de medidor válido.",
        color: "text-red-500",
      });
      return;
    }

    var paArrCopy = [...paArr];
    paArrCopy.push(paInfo);
    setPAArr(paArrCopy);

    var tipoArr = paArrCopy.map((i) => i.tipoDisjuntor);
    var amperagemArr = paArrCopy.map((i) => i.amperagem);
    var numeroMedidorArr = paArrCopy.map((i) => i.numeroMedidor);

    var joinedTipo = tipoArr.join("/");
    var joinedAmperagem = amperagemArr.join("/");
    var joinedNumeroMedidor = numeroMedidorArr.join("/");

    setDados((prev) => ({
      ...prev,
      tipoDisjuntor: joinedTipo,
      amperagem: joinedAmperagem,
      numeroMedidor: joinedNumeroMedidor,
    }));
    setPAInfo({
      tipoDisjuntor: "NÃO DEFINIDO",
      amperagem: "NÃO DEFINIDO",
      numeroMedidor: "",
    });
    setPAMsg({ text: "", color: "" });
  }

  function validateFields() {
    if (dados.amperagem == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha a amperagem.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoDisjuntor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo do disjuntor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.numeroMedidor.trim().length < 5) {
      setMsg({
        text: "Por favor, preencha o número do medidor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.ramalEntrada == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o ramal de entrada.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.ramalSaida == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o ramal de saida.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoPadrao == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha a posição padrão em relação a casa do cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoPadrao) {
      setMsg({
        text: "Por favor, anexe a foto do padrão",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoDisjuntor) {
      setMsg({
        text: "Por favor, anexe a foto do disjuntor",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.fotoCabosPadrao) {
      setMsg({
        text: "Por favor, anexe a foto dos cabos do padrão",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  function goToNext() {
    if (validateFields()) {
      avancar();
    }
  }
  console.log(dados);
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        PADRÃO
      </span>
      <div className="flex flex-col w-full pb-4">
        <h1 className="text-center text-[#fead61] text-sm italic">
          Agora você pode adicionar, em casos de padrões conjugados, uma lista
          de itens.
        </h1>
        <p className="text-center text-gray-500 text-sm italic">
          Preencha as informalões e clique no{" "}
          <strong className="text-green-500">ícone</strong> para adicionar itens
          a lista.
        </p>
        <div className="flex items-center gap-2 mt-6">
          <div className="w-[30%]">
            <SelectFloatingInput
              label={"TIPO DO DISJUNTOR"}
              editable={true}
              width={"450px"}
              value={paInfo.tipoDisjuntor}
              options={[
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                { label: "MONOFÁSICO", value: "MONOFÁSICO" },
                { label: "BIFÁSICO", value: "BIFÁSICO" },
                { label: "TRIFÁSICO", value: "TRIFÁSICO" },
                { label: "PADRÃO CONJUGADO", value: "PADRÃO CONJUGADO" },
              ]}
              handleChange={(value) =>
                setPAInfo((prev) => ({ ...prev, tipoDisjuntor: value }))
              }
            />
          </div>
          <div className="w-[30%]">
            <SelectFloatingInput
              label={"AMPERAGEM"}
              editable={true}
              width={"450px"}
              value={paInfo.amperagem}
              options={[
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                { label: "40A", value: "40A" },
                { label: "50A", value: "50A" },
                { label: "60A", value: "60A" },
                { label: "63A", value: "63A" },
                { label: "70A", value: "70A" },
                { label: "90A", value: "90A" },
                { label: "100A", value: "100A" },
                { label: "200A", value: "200A" },
                { label: "PADRÃO CONJUGADO", value: "PADRÃO CONJUGADO" },
              ]}
              handleChange={(value) =>
                setPAInfo((prev) => ({ ...prev, amperagem: value }))
              }
            />
          </div>
          <div className="w-[30%]">
            <TextFloatingInput
              label={"NÚMERO DO MEDIDOR"}
              editable={true}
              width={"450px"}
              value={paInfo.numeroMedidor}
              handleChange={(value) =>
                setPAInfo((prev) => ({ ...prev, numeroMedidor: value }))
              }
            />
          </div>
          <div className="w-[10%]">
            <button
              onClick={addPA}
              className="bg-green-300 hover:bg-green-500 text-white flex justify-center items-center h-fit p-2 rounded cursor-pointer"
            >
              <MdOutlineAddCircle style={{ fontSize: "15px" }} />
            </button>
          </div>
        </div>
        {paMsg.text ? (
          <p className={`text-center ${paMsg.color} text-sm italic`}>
            {paMsg.text}
          </p>
        ) : null}
        {paArr.length > 0 ? (
          paArr.map((x, index) => (
            <div key={index} className="flex justify-around items-center my-1">
              <p className="text-xs font-bold w-[30%]">{x.tipoDisjuntor}</p>
              <p className="text-xs font-bold w-[30%]">{x.amperagem}</p>
              <p className="text-xs font-bold w-[30%]">{x.numeroMedidor}</p>
              <div className="w-[10%]">
                <button
                  onClick={() => {
                    let arr = paArr;
                    arr.splice(index, 1);
                    let tipoArr = arr.map((i) => i.marca);
                    let amperagemArr = arr.map((i) => i.amperagem);
                    let numeroMedidorArr = arr.map((i) => i.numeroMedidor);

                    let joinedTipo = tipoArr.join("/");
                    let joinedAmperagem = amperagemArr.join("/");
                    let joinedNumeroMedidor = numeroMedidorArr.join("/");
                    setDados({
                      ...dados,
                      tipoDisjuntor: joinedTipo,
                      amperagem: joinedAmperagem,
                      tipoDisjuntor: joinedNumeroMedidor,
                    });
                    setPAArr([...arr]);
                  }}
                  className="bg-red-500 p-1 rounded "
                >
                  <FiDelete style={{ fontSize: "15px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            Sem padrões adicionados...
          </p>
        )}
      </div>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        {/* <TextFloatingInput
          label={"PARA PADRÕES CONJUGADOS"}
          placeholder="ESCREVA: CAIXA 1 - APD1111111 - 40A MONOFÁSICO/ CAIXA 2 - APD222222 - 60A BIFÁSICO ..."
          editable={true}
          width={"450px"}
          value={dados.infoPadraoConjugado}
          handleChange={(value) =>
            setDados({ ...dados, infoPadraoConjugado: value.toUpperCase() })
          }
        /> */}
        <SelectFloatingInput
          label={"RAMAL DE ENTRADA"}
          editable={true}
          width={"450px"}
          value={dados.ramalEntrada}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "AÉREO", value: "AÉREO" },
            { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalEntrada: value })}
        />
        <SelectFloatingInput
          label={"RAMAL DE SAÍDA"}
          editable={true}
          width={"450px"}
          value={dados.ramalSaida}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            { label: "AÉREO", value: "AÉREO" },
            { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalSaida: value })}
        />
        <SelectFloatingInput
          label={"EM RELAÇÃO A CASA DO CLIENTE, O PADRÃO ESTÁ:"}
          editable={true}
          width={"450px"}
          value={dados.tipoPadrao}
          options={[
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            {
              label: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
              value: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
            },
            {
              label: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
              value: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
            },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoPadrao: value })}
        />
        <NumberFloatingInput
          label={"NÚMERO DO POSTE (SOMENTE P/GOIÁS)"}
          editable={true}
          width={"450px"}
          value={dados.numeroPoste ? dados.numeroPoste : ""}
          handleChange={(value) =>
            setDados({ ...dados, numeroPoste: Number(value) })
          }
        />
      </div>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DO PADRÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoPadrao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoPadrao.file.name}
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
                setImages({
                  ...images,
                  fotoPadrao: {
                    title: "FOTO DO PADRÃO",
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DO DISJUNTOR
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoDisjuntor ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoDisjuntor.file.name}
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
                setImages({
                  ...images,
                  fotoDisjuntor: {
                    title: "FOTO DO DISJUNTOR",
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DOS CABOS DO PADRÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoCabosPadrao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoCabosPadrao.file.name}
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
                setImages({
                  ...images,
                  fotoCabosPadrao: {
                    title: "FOTO DOS CABOS DO PADRÃO",
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center self-center">
          <label
            className="ml-2 text-center text-[#15599a] font-bold"
            htmlFor="propostaComercial"
          >
            FOTO DO POSTE (SOMENTE P/ GOIÁS)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {images.fotoPoste ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {images.fotoPoste.file.name}
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
                setImages({
                  ...images,
                  fotoPoste: {
                    title: "FOTO DO POSTE",
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center text-sm italic my-2 ${msg.color}`}>
          {msg.text}
        </p>
      )}
      <div className="flex items-center justify-center mt-2 gap-2">
        <button
          onClick={voltar}
          className="bg-blue-300 hover:bg-blue-500 hover:text-white font-bold p-2 rounded"
        >
          VOLTAR
        </button>
        <button
          onClick={goToNext}
          className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded"
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormVisitaTecnicaDois;
