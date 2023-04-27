import React from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import SelectFoatingInput from "./SelectFloatingInput";
import { cidadesAtendidas, cities } from "../utils/constants";
import { vendedores } from "../utils/constants";
import NumberFloatingInput from "./NumberFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import estadosECidades from "../utils/estados_cidades.json";
function ModalNewPropostaOeM({ isOpen, closeModal }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [proposeInfo, setProposeInfo] = useState({
    nomeCliente: "",
    uf: "MG",
    cidade: "ITUIUTABA",
    vendedor: "NÃO DEFINIDO",
    qtdeModulos: 0,
    potModulos: 0,
    distancia: 0,
    eficienciaAtual: 0,
  });
  async function getDistanceBetweenCities(destination, origin) {
    try {
      const { data } = await axios.get(
        `/api/distance?destination=${destination}&origin=${origin}`
      );
      const distance = (data.rows[0].elements[0].distance.value / 1000).toFixed(
        2
      );
      console.log(distance);
      setProposeInfo((prev) => ({ ...prev, distancia: distance }));
    } catch (error) {
      console.log("ERROR", error);
    }
  }
  function getCities(uf) {
    var filteredState = estadosECidades.filter((item) => item.sigla == uf)[0];
    return filteredState.cidades;
  }
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
          <div className="flex flex-col px-4 py-4 items-center gap-y-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
              label={"UF"}
              editable={true}
              value={proposeInfo.uf}
              options={[
                { label: "MG", value: "MG" },
                { label: "GO", value: "GO" },
              ]}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  uf: value,
                  cidade: getCities(value)[0],
                }))
              }
              width={"50%"}
            />
            <SelectFoatingInput
              label={"CIDADE"}
              editable={true}
              value={proposeInfo.cidade}
              options={getCities(proposeInfo.uf).map((city) => ({
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
              <div className="lg:ml-[24px] ml-0 w-full lg:w-[50%]">
                <NumberFloatingInput
                  label={"DISTÂNCIA DE ITBA À CIDADE DE INSTALAÇÃO"}
                  editable={true}
                  value={proposeInfo.distancia}
                  handleChange={(value) =>
                    setProposeInfo((prev) => ({
                      ...prev,
                      distancia: Number(value),
                    }))
                  }
                  width={"100%"}
                />
              </div>
              <button
                onClick={() =>
                  getDistanceBetweenCities(
                    `${proposeInfo.cidade}, ${proposeInfo.uf}, BRASIL`,
                    "ITUIUTABA, MG, BRASIL"
                  )
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
