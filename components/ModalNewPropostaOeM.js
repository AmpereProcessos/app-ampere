import React from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import SelectFoatingInput from "./SelectFloatingInput";
import {
  cidadesAtendidas,
  cities,
  getDistanceBetweenCities,
} from "../utils/constants";
import { vendedores } from "../utils/constants";
import NumberFloatingInput from "./NumberFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";

function ModalNewPropostaOeM({ isOpen, closeModal }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [proposeInfo, setProposeInfo] = useState({
    nomeCliente: "",
    cidade: "ITUIUTABA",
    vendedor: "NÃO DEFINIDO",
    qtdeModulos: 0,
    potModulos: 0,
    distancia: 0,
    eficienciaAtual: 0,
  });

  return (
    <>
      <AnimatedModalWrapper modalIsOpen={isOpen} width={"60%"} height={"80%"}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg border-b border-gray-200 pb-2">
            <div className="flex gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                CRIAÇÃO DE PROPOSTA
              </h1>
            </div>
            <div className="flex gap-x-2 items-center">
              <button>
                <VscChromeClose
                  onClick={() => closeModal()}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col py-4 items-center gap-y-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <h1 className="text-center w-full text-lg text-[#fead61] font-medium pb-2">
              INFORMAÇÕES DA VENDA
            </h1>
            <TextFloatingInput
              label={"NOME DO CLIENTE"}
              editable={true}
              value={proposeInfo.nomeCliente}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  nomeCliente: value.toUpperCase(),
                }))
              }
              width={"50%"}
            />
            <SelectFoatingInput
              label={"CIDADE"}
              editable={true}
              value={proposeInfo.cidade}
              options={cidadesAtendidas.map((city) => ({
                label: city,
                value: city,
              }))}
              handleChange={(value) =>
                setProposeInfo((prev) => ({ ...prev, cidade: value }))
              }
              width={"50%"}
            />
            <SelectFoatingInput
              label={"VENDEDOR"}
              editable={true}
              value={proposeInfo.vendedor}
              options={vendedores.map((seller) => ({
                label: seller.nome,
                value: seller.value,
              }))}
              handleChange={(value) =>
                setProposeInfo((prev) => ({ ...prev, vendedor: value }))
              }
              width={"50%"}
            />
            <h1 className="text-center w-full text-lg text-[#fead61] font-medium pb-2">
              INFORMAÇÕES DO SISTEMA
            </h1>
            <NumberFloatingInput
              label={"QUANTIDADE DE MÓDULOS"}
              editable={true}
              value={proposeInfo.qtdeModulos}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  qtdeModulos: Number(value),
                }))
              }
              width={"50%"}
            />
            <NumberFloatingInput
              label={"POTÊNCIA DOS MÓDULOS"}
              editable={true}
              value={proposeInfo.potModulos}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  potModulos: Number(value),
                }))
              }
              width={"50%"}
            />
            <NumberFloatingInput
              label={"EFICIÊNCIA ATUAL (%)"}
              editable={true}
              value={proposeInfo.eficienciaAtual}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  eficienciaAtual: Number(value),
                }))
              }
              width={"50%"}
            />
            <div className="w-full flex items-center justify-center gap-2">
              <NumberFloatingInput
                label={"DISTÂNCIA DE ITBA À INSTALAÇÃO DO CLIENTE"}
                editable={true}
                value={proposeInfo.distancia}
                handleChange={(value) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    distancia: Number(value),
                  }))
                }
                width={"45%"}
              />
              <button
                onClick={() =>
                  getDistanceBetweenCities(proposeInfo.cidade, "ITUIUTABA")
                }
                className="bg-[#fead61] text-[#15599a] p-1 rounded hover:bg-[#15599a] hover:text-[#fead61]"
              >
                <AiOutlineSearch />
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-end pr-2">
            <button className="bg-green-300 p-2 rounded font-medium hover:bg-green-500 hover:text-white">
              CRIAR PROPOSTA
            </button>
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalNewPropostaOeM;
