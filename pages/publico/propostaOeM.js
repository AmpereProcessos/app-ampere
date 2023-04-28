import React, { useState } from "react";
import Logo from "../../utils/whitelogoHD.png";
import Image from "next/image";
import TextFloatingInput from "../../components/TextFloatingInput";
import SelectFoatingInput from "../../components/SelectFloatingInput";
import estadosECidades from "../../utils/estados_cidades.json";
import axios from "axios";
import NumberFloatingInput from "../../components/NumberFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import { formatToPhone, vendedores } from "../../utils/constants";
import irradiacoes from "../../utils/irradiancia.json";
import PropostaPDFModel from "../../components/PropostaPDFModel";
function PropostaOeM() {
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
  const [msg, setMsg] = useState({ status: null, text: "", color: "" });
  const [pageType, setPageType] = useState("FORM");

  function getIrradiance(city) {
    const irrad = irradiacoes.filter(
      (city) => city.NAME.toUpperCase() == proposeInfo.cidade
    )[0];
    if (irrad) return Number(((irrad.ANNUAL / 1000) * 30 * 0.81).toFixed(2));
    else return 0;
  }
  function validateFields() {
    if (proposeInfo.nomeCliente.trim().length < 3) {
      setMsg({
        status: null,
        text: "Por favor, preencha um nome válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (proposeInfo.vendedor == "NÃO DEFINIDO") {
      setMsg({
        status: null,
        text: "Por favor, preencha um vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (proposeInfo.telefoneVendedor.length < 11) {
      setMsg({
        status: null,
        text: "Por favor, preencha um telefone válido para o vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (proposeInfo.qtdeModulos <= 0) {
      setMsg({
        status: null,
        text: "Por favor, preencha uma quantidade de módulos.",
        color: "text-red-500",
      });
      return false;
    }
    if (proposeInfo.potModulos <= 0) {
      setMsg({
        status: null,
        text: "Por favor, preencha a potência dos módulos.",
        color: "text-red-500",
      });
      return false;
    }
    if (proposeInfo.distancia < 0) {
      setMsg({
        status: null,
        text: "Por favor, preencha uma distância válida ou clica na pesquisa automática.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ status: null, text: "", color: "" });
    return true;
  }
  async function createPropose() {
    if (validateFields()) {
      try {
        setMsg({
          status: "loading",
          text: "Processando...",
          color: "text-[#15599a]",
        });
        const genFactor = getIrradiance(proposeInfo.cidade);
        const { data } = await axios.post("/api/o&m/proposes", {
          ...proposeInfo,
          fatorDeGeracao: genFactor,
        });
        if (data.acknowledged)
          setMsg({
            status: "success",
            text: "Proposta gerada com sucesso.",
            color: "text-green-500",
          });
        else throw "Erro na geração de proposta. Por favor tente novamente.";
      } catch (error) {
        setMsg({
          status: "failure",
          text: "Erro na geração de proposta. Por favor tente novamente.",
          color: "text-red-500",
        });
      }
    }
  }
  async function getDistanceBetweenCities(destination, origin) {
    try {
      const { data } = await axios.get(
        `/api/distance?destination=${destination}&origin=${origin}`
      );
      const distance = (data.rows[0].elements[0].distance.value / 1000).toFixed(
        2
      );
      console.log(distance);
      setProposeInfo((prev) => ({ ...prev, distancia: Number(distance) }));
    } catch (error) {
      console.log("ERROR", error);
    }
  }
  function getCities(uf) {
    var filteredState = estadosECidades.filter((item) => item.sigla == uf)[0];
    return filteredState.cidades;
  }
  if (pageType == "FORM")
    return (
      <div className="p-6 grow flex flex-col bg-[#15599a] items-center">
        <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col border border-gray-300 shadow-lg p-2 items-center">
          <div className="flex items-center justify-center h-[80px]">
            <Image height={"80px"} width={"80px"} src={Logo} objectFit="fill" />
          </div>
          <div className="flex flex-col w-full px-4 py-4 items-center gap-y-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
            <TextFloatingInput
              label={"TELEFONE DO VENDEDOR"}
              editable={true}
              value={proposeInfo.telefoneVendedor}
              handleChange={(value) =>
                setProposeInfo((prev) => ({
                  ...prev,
                  telefoneVendedor: formatToPhone(value),
                }))
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
            {!msg.status ? (
              <button
                onClick={createPropose}
                className="bg-green-300 p-2 rounded font-medium hover:bg-green-500 hover:text-white"
              >
                CRIAR PROPOSTA
              </button>
            ) : (
              <>
                {msg.status == "loading" ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : null}
                {msg.status == "success" ? (
                  <>
                    <p className={`text-xs italic ${msg.color} mr-4`}>
                      {msg.text}
                    </p>
                    <button
                      onClick={() => setPageType("PROPOSE")}
                      className="bg-green-300 p-2 rounded font-medium hover:bg-green-500 hover:text-white"
                    >
                      VER PROPOSTA
                    </button>
                  </>
                ) : null}
                {msg.status == "failure" ? (
                  <p className={`text-xs italic ${msg.color}`}>{msg.text}</p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    );
  if (pageType == "PROPOSE") return <PropostaPDFModel info={proposeInfo} />;
}

export default PropostaOeM;
