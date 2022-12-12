import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { cidadesAtendidas } from "../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "93%",
  height: "98%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ModalVisitaTecnica({ info, setModalIsOpen }) {
  const [dados, setDados] = useState(info);
  const [msg, setMessage] = useState({ text: "", color: "" });
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          console.log(res.data.erro);
          return;
        } else {
          console.log(
            cidadesAtendidas.includes(res.data.localidade.toUpperCase())
          );
          console.log(res.data.localidade);
          setDados({
            ...dados,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "ITUIUTABA",
            logradouro: res.data.logradouro,
          });
        }
      });
  }
  function saveChanges() {
    axios
      .put("/api/solicitacoes/visitaTecnica", dados)
      .then((res) =>
        setMessage({ text: "Alterações feitas", color: "text-green-500" })
      )
      .catch((err) =>
        setMessage({
          text: "Houve um erro, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  function concludeVisita() {
    axios
      .put("/api/solicitacoes/visitaTecnica", {
        _id: dados._id,
        status: "CONCLUIDO",
        dataDeConclusao: new Date().toISOString(),
      })
      .then((res) =>
        setMessage({ text: "Alterações feitas", color: "text-green-500" })
      )
      .catch((err) =>
        setMessage({
          text: "Houve um erro, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
    return cep;
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] pl-6  font-bold">
              {dados.nomeDoCliente}
            </h1>
            {dados.status != "CONCLUIDO" ? (
              <div className="flex items-center gap-2">
                <select
                  value={dados.status ? dados.status : "NÃO DEFINIDO"}
                  onChange={(e) =>
                    setDados({ ...dados, status: e.target.value })
                  }
                  className="outline-none p-2 text-[#15599a] font-bold"
                >
                  <option value="EM ANÁLISE TÉCNICA">EM ANÁLISE TÉCNICA</option>
                  <option value="PENDÊNCIA COMERCIAL">
                    PENDÊNCIA COMERCIAL
                  </option>
                  <option value="VISITA IN LOCO">VISITA IN LOCO</option>
                  <option value="NÃO DEFINIDO">NÃO DEFINIDO</option>
                </select>
                <button
                  onClick={concludeVisita}
                  className="bg-green-200 hover:bg-green-500 p-2 rounded outline-none font-bold text-white"
                >
                  VISITA CONCLUÍDA?
                </button>
              </div>
            ) : (
              <p className="font-bold p-1 bg-green-400 text-white rounded">
                CONCLUIDO
              </p>
            )}

            <div className="flex items-center gap-x-2">
              {msg.text && <p className={`italic ${msg.color}`}>{msg.text}</p>}
              <button
                onClick={saveChanges}
                className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
              >
                <p>Salvar alterações</p>
                <FaSave />
              </button>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                INFORMAÇÕES INICIAIS
              </span>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <TextInput
                  label={"NOME DO CLIENTE"}
                  editable={true}
                  value={dados.nomeDoCliente}
                  handleChange={(value) =>
                    setDados({ ...dados, nomeDoCliente: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"TELEFONE DO CLIENTE"}
                  editable={true}
                  value={dados.telefoneDoCliente}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      telefoneDoCliente: formatPhone(value),
                    })
                  }
                />
                <NumberInput
                  label={"Nº DO PROJETO SVB"}
                  editable={true}
                  value={dados.codigoSVB ? dados.codigoSVB : ""}
                  handleChange={(value) =>
                    setDados({ ...dados, codigoSVB: Number(value) })
                  }
                />
                <SelectInput
                  label={"CIDADE"}
                  editable={true}
                  value={dados.cidade}
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ...cidadesAtendidas.map((cidade) => {
                      return { label: cidade, value: cidade };
                    }),
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, cidade: value })
                  }
                />
                <TextInput
                  label={"CEP"}
                  editable={true}
                  value={dados.cep}
                  handleChange={(value) =>
                    setDados({ ...dados, cep: formatCEP(value) })
                  }
                />
                <button
                  onClick={() => findCPF()}
                  className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
                >
                  <AiOutlineSearch />
                </button>
                <TextInput
                  label={"BAIRRO"}
                  editable={true}
                  value={dados.bairro}
                  handleChange={(value) =>
                    setDados({ ...dados, bairro: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"LOGRADOURO"}
                  editable={true}
                  value={dados.logradouro}
                  handleChange={(value) =>
                    setDados({ ...dados, logradouro: value.toUpperCase() })
                  }
                />
                <NumberInput
                  label={"N°RESIDÊNCIA"}
                  editable={true}
                  value={dados.numeroResidencia}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroResidencia: Number(value) })
                  }
                />
              </div>
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                EQUIPAMENTO
              </span>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"TIPO DE INVERSOR"}
                  editable={true}
                  value={dados.tipoInversor}
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    { label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
                    { label: "INVERSOR", value: "INVERSOR" },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoInversor: value })
                  }
                />
                <NumberInput
                  label={"QTDE DE INVERSORES"}
                  editable={true}
                  value={dados.qtdeInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeInversor: Number(value) })
                  }
                />
                <NumberInput
                  label={"POTÊNCIA DO INVERSOR"}
                  editable={true}
                  unit={"W"}
                  value={dados.potInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, potInversor: Number(value) })
                  }
                />
                <TextInput
                  label={"MARCA DO INVERSOR"}
                  editable={true}
                  value={dados.marcaInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaInversor: value.toUpperCase() })
                  }
                />
                <NumberInput
                  label={"QTDE DE MODULOS"}
                  editable={true}
                  value={dados.qtdeModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeModulos: Number(value) })
                  }
                />
                <NumberInput
                  label={"POTÊNCIA DOS MÓDULOS"}
                  editable={true}
                  value={dados.potModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, potModulos: Number(value) })
                  }
                />
                <TextInput
                  label={"MARCA DOS MÓDULOS"}
                  editable={true}
                  value={dados.marcaModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaModulos: value.toUpperCase() })
                  }
                />
                <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES PARA VISITA
                  </span>
                  <textarea
                    placeholder={"Descrição aqui.."}
                    value={dados.obsVisita}
                    onChange={(e) =>
                      setDados({ ...dados, obsVisita: e.target.value })
                    }
                    className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"TIPO DE LAUDO"}
                  editable={true}
                  value={dados.tipoDeLaudo}
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    {
                      label: "ESTUDO SIMPLES (36 HORAS)",
                      value: "ESTUDO SIMPLES (36 HORAS)",
                    },
                    {
                      label: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
                      value: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
                    },
                    {
                      label: "ESTUDO COMPLEXO (72 HORAS)",
                      value: "ESTUDO COMPLEXO (72 HORAS)",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoDeLaudo: value })
                  }
                />
                <SelectInput
                  label={"TIPO DE SOLICITAÇÃO"}
                  editable={true}
                  value={dados.tipoDeSolicitacao}
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    {
                      label: "VISITA TÉCNICA REMOTA - URBANA",
                      value: "VISITA TÉCNICA REMOTA - URBANA",
                    },
                    {
                      label: "VISITA TÉCNICA REMOTA - RURAL",
                      value: "VISITA TÉCNICA REMOTA - RURAL",
                    },
                    {
                      label: "VISITA TÉCNICA IN LOCO - URBANA",
                      value: "VISITA TÉCNICA IN LOCO - URBANA",
                    },
                    {
                      label: "VISITA TÉCNICA IN LOCO - RURAL",
                      value: "VISITA TÉCNICA IN LOCO - RURAL",
                    },
                    {
                      label: "ALTERAÇÃO DE PROJETO",
                      value: "ALTERAÇÃO DE PROJETO",
                    },
                    {
                      label: "DESENHO PERSONALIZADO",
                      value: "DESENHO PERSONALIZADO",
                    },
                    { label: "ORÇAMENTAÇÃO", value: "ORÇAMENTAÇÃO" },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoDeSolicitacao: value })
                  }
                />
              </div>
            </div>
            {dados.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - URBANA" && (
              <>
                <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
                  <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                    PADRÃO
                  </span>
                  <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
                    <SelectInput
                      label={"AMPERAGEM"}
                      editable={true}
                      value={dados.amperagem}
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
                        {
                          label: "PADRÃO CONJUGADO",
                          value: "PADRÃO CONJUGADO",
                        },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, amperagem: value })
                      }
                    />
                    <SelectInput
                      label={"TIPO DO DISJUNTOR"}
                      editable={true}
                      value={dados.tipoDisjuntor}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "MONOFÁSICO", value: "MONOFÁSICO" },
                        { label: "BIFÁSICO", value: "BIFÁSICO" },
                        { label: "TRIFÁSICO", value: "TRIFÁSICO" },
                        {
                          label: "PADRÃO CONJUGADO",
                          value: "PADRÃO CONJUGADO",
                        },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoDisjuntor: value })
                      }
                    />
                    <TextInput
                      label={"NÚMERO DO MEDIDOR"}
                      editable={true}
                      value={dados.numeroMedidor}
                      handleChange={(value) =>
                        setDados({ ...dados, numeroMedidor: value })
                      }
                    />
                    <TextInput
                      label={"PARA PADRÕES CONJUGADOS"}
                      placeholder="ESCREVA: CAIXA 1 - APD1111111 - 40A MONOFÁSICO/ CAIXA 2 - APD222222 - 60A BIFÁSICO ..."
                      editable={true}
                      value={dados.infoPadraoConjugado}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          infoPadraoConjugado: value.toUpperCase(),
                        })
                      }
                    />
                    <SelectInput
                      label={"RAMAL DE ENTRADA"}
                      editable={true}
                      value={dados.ramalEntrada}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "AÉREO", value: "AÉREO" },
                        { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, ramalEntrada: value })
                      }
                    />
                    <SelectInput
                      label={"RAMAL DE SAÍDA"}
                      editable={true}
                      value={dados.ramalSaida}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "AÉREO", value: "AÉREO" },
                        { label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, ramalSaida: value })
                      }
                    />
                    <SelectInput
                      label={"EM RELAÇÃO A CASA DO CLIENTE, O PADRÃO ESTÁ:"}
                      editable={true}
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
                      handleChange={(value) =>
                        setDados({ ...dados, tipoPadrao: value })
                      }
                    />
                    <NumberInput
                      label={"NÚMERO DO POSTE (SOMENTE P/GOIÁS)"}
                      editable={true}
                      value={dados.numeroPoste ? dados.numeroPoste : ""}
                      handleChange={(value) =>
                        setDados({ ...dados, numeroPoste: Number(value) })
                      }
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
                  <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                    ESTRUTURA
                  </span>
                  <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
                    <SelectInput
                      label={"ESTRUTURA DE MONTAGEM"}
                      editable={true}
                      value={dados.estruturaMontagem}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        {
                          label: "TELHADO CONVENCIONAL",
                          value: "TELHADO CONVENCIONAL",
                        },
                        { label: "ESTRUTURA DE SOLO", value: "ESTRUTURA SOLO" },
                        { label: "BARRACÃO PRONTO", value: "BARRACÃO PRONTO" },
                        {
                          label:
                            "CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA",
                          value:
                            "CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA",
                        },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, estruturaMontagem: value })
                      }
                    />
                    <SelectInput
                      label={"TIPO DA ESTRUTURA"}
                      editable={true}
                      value={dados.tipoEstrutura}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "MADEIRA", value: "MADEIRA" },
                        { label: "FERRO", value: "FERRO" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoEstrutura: value })
                      }
                    />
                    <SelectInput
                      label={"TIPO DA TELHA (EXEMPLO ABAIXO)"}
                      editable={true}
                      value={dados.tipoTelha}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "PORTUGUESA", value: "PORTUGUESA" },
                        { label: "FRANCESA", value: "FRANCESA" },
                        { label: "ROMANA", value: "ROMANA" },
                        { label: "CIMENTO", value: "CIMENTO" },
                        { label: "ETHERNIT", value: "ETHERNIT" },
                        { label: "SANDUÍCHE", value: "SANDUÍCHE" },
                        { label: "AMERICANA", value: "AMERICANA" },
                        { label: "CAPE E BICA", value: "CAPE E BICA" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoTelha: value })
                      }
                    />
                    <SelectInput
                      label={"CLIENTE POSSUI TELHAS RESERVAS"}
                      editable={true}
                      value={dados.telhasReservas}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "SIM", value: "SIM" },
                        { label: "NÃO", value: "NÃO" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, telhasReservas: value })
                      }
                    />
                    <TextInput
                      label={"LINK FOTOS DO DRONE"}
                      editable={true}
                      placeholder="TENDO MAIS DE UM TELHADO APTO ESCREVER MAIS DE UMA"
                      normalCase={true}
                      value={dados.fotosDrone}
                      handleChange={(value) =>
                        setDados({ ...dados, fotosDrone: value })
                      }
                    />
                    <TextInput
                      label={"ORIENTAÇÃO DO TELHADO (EX:10°NORTE)"}
                      placeholder="TENDO MAIS DE UM TELHADO APTO ESCREVER MAIS DE UMA"
                      editable={true}
                      value={dados.orientacaoEstrutura}
                      handleChange={(value) =>
                        setDados({ ...dados, orientacaoEstrutura: value })
                      }
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
                  <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                    INSTALAÇÃO
                  </span>
                  <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
                    <SelectInput
                      label={"LOCAL DE INSTALAÇÃO DO INVERSOR"}
                      editable={true}
                      value={
                        dados.localInstalacaoInversor
                          ? dados.localInstalacaoInversor
                          : "NÃO DEFINIDO"
                      }
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
                        { label: "LAVANDERIA", value: "LAVANDERIA" },
                        { label: "VARANDA", value: "VARANDA" },
                        { label: "GARAGEM", value: "GARAGEM" },
                        {
                          label: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                          value: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                        },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, localInstalacaoInversor: value })
                      }
                    />
                    <SelectInput
                      label={
                        "DISTÂNCIA MÉDIA DO SISTEMA FOTOVOLTAICO ATÉ O QUADRO DE DISTRIBUIÇÃO"
                      }
                      editable={true}
                      value={dados.distanciaSistemaQuadro}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "5 METROS", value: "5 METROS" },
                        { label: "10 METROS", value: "10 METROS" },
                        { label: "15 METROS", value: "15 METROS" },
                        { label: "20 METROS", value: "20 METROS" },
                        { label: "25 METROS", value: "25 METROS" },
                        { label: "30 METROS", value: "30 METROS" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, distanciaSistemaQuadro: value })
                      }
                    />
                    <SelectInput
                      label={"DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR"}
                      editable={true}
                      value={dados.distanciaInversorRoteador}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "5 METROS", value: "5 METROS" },
                        { label: "10 METROS", value: "10 METROS" },
                        { label: "15 METROS", value: "15 METROS" },
                        { label: "20 METROS", value: "20 METROS" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, distanciaInversorRoteador: value })
                      }
                    />
                    <TextInput
                      label={
                        "LOCAL DO ATERRAMENTO DO SISTEMA (SOMENTE P/GOIÁS)"
                      }
                      editable={true}
                      value={
                        dados.localAterramento ? dados.localAterramento : ""
                      }
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          localAterramento: value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      OBSERVAÇÕES SOBRE A INSTALAÇÃO
                    </span>
                    <textarea
                      placeholder={"Descrição aqui.."}
                      value={dados.obsInstalacao}
                      onChange={(e) =>
                        setDados({ ...dados, obsInstalacao: e.target.value })
                      }
                      className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    />
                  </div>
                </div>
              </>
            )}
            {dados.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - RURAL" && (
              <>
                <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
                  <span className="text-md text-center font-bold text-[#15599a] uppercase py-2">
                    VISITA TÉCNICA RURAL
                  </span>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
                      PADRÃO
                    </span>
                    <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
                      <SelectInput
                        label={"DISJUNTOR DO PADRÃO"}
                        editable={true}
                        value={dados.tipoDisjuntor}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "BIFÁSICO", value: "BIFÁSICO" },
                          { label: "TRIFÁSICO", value: "TRIFÁSICO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoDisjuntor: value })
                        }
                      />
                      <SelectInput
                        label={"AMPERAGEM"}
                        editable={true}
                        value={dados.amperagem}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "30A", value: "30A" },
                          { label: "40A", value: "40A" },
                          { label: "50A", value: "50A" },
                          { label: "60A", value: "60A" },
                          { label: "70A", value: "70A" },
                          { label: "80A", value: "80A" },
                          { label: "90A", value: "90A" },
                          { label: "100A", value: "100A" },
                          { label: "125A", value: "125A" },
                          { label: "150A", value: "150A" },
                          { label: "175A", value: "175A" },
                          { label: "200A", value: "200A" },
                          {
                            label: "OUTRO(DESCREVA NAS OBSERVAÇÕES)",
                            value: "OUTRO(DESCREVA NAS OBSERVAÇÕES)",
                          },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, amperagem: value })
                        }
                      />
                      <TextInput
                        label={"NÚMERO DO MEDIDOR"}
                        editable={true}
                        value={dados.numeroMedidor}
                        handleChange={(value) =>
                          setDados({ ...dados, numeroMedidor: value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
                      TRANSFORMADOR
                    </span>
                    <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
                      <SelectInput
                        label={"PADRÃO E TRANSFORMADOR ACOPLADOS"}
                        editable={true}
                        value={
                          dados.padraoTrafoAcoplados
                            ? dados.padraoTrafoAcoplados
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "SIM", value: "SIM" },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, padraoTrafoAcoplados: value })
                        }
                      />
                      <NumberInput
                        label={"POTÊNCIA DO TRANSFORMADOR"}
                        unit={"kVA"}
                        editable={true}
                        value={dados.potTrafo ? dados.potTrafo : ""}
                        handleChange={(value) =>
                          setDados({ ...dados, potTrafo: Number(value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
                      ESTRUTURA DE MONTAGEM
                    </span>
                    <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
                      <SelectInput
                        label={"TIPO DE ESTRUTURA - MONTAGEM DOS MÓDULOS"}
                        editable={true}
                        value={dados.estruturaMontagem}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "TELHADO CONVENCIONAL - TELHA BARRO",
                            value: "TELHADO CONVENCIONAL - TELHA BARRO",
                          },
                          {
                            label: "BARRACÃO À CONSTRUIR",
                            value: "BARRACÃO À CONSTRUIR",
                          },
                          {
                            label: "ESTRUTURA DE SOLO",
                            value: "ESTRUTURA DE SOLO",
                          },
                          { label: "BEZERREIRO", value: "BEZERREIRO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, estruturaMontagem: value })
                        }
                      />
                      <TextInput
                        label={"ORIENTAÇÃO DA MONTAGEM DOS MÓDULOS"}
                        editable={true}
                        value={dados.orientacaoEstrutura}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            orientacaoEstrutura: value.toUpperCase(),
                          })
                        }
                      />
                      <SelectInput
                        label={"TIPO DA ESTRUTURA"}
                        editable={true}
                        value={dados.tipoEstrutura}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "MADEIRA", value: "MADEIRA" },
                          { label: "FERRO", value: "FERRO" },
                          {
                            label: "ESTRUTURA DE SOLO",
                            value: "ESTRUTURA DE SOLO",
                          },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoEstrutura: value })
                        }
                      />
                      <SelectInput
                        label={"TIPO DA TELHA"}
                        editable={true}
                        value={dados.tipoTelha}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "PORTUGUESA", value: "PORTUGUESA" },
                          { label: "FRANCESA", value: "FRANCESA" },
                          { label: "ROMANA", value: "ROMANA" },
                          { label: "CIMENTO", value: "CIMENTO" },
                          { label: "ETHERNIT", value: "ETHERNIT" },
                          { label: "SANDUÍCHE", value: "SANDUÍCHE" },
                          { label: "AMERICANA", value: "AMERICANA" },
                          { label: "CAPE E BICA", value: "CAPE E BICA" },
                          {
                            label: "ESTRUTURA DE SOLO",
                            value: "ESTRUTURA DE SOLO",
                          },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoTelha: value })
                        }
                      />
                      <SelectInput
                        label={"CLIENTE POSSUI TELHAS RESERVAS"}
                        editable={true}
                        value={dados.telhasReservas}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "SIM - MUITAS", value: "SIM - MUITAS" },
                          { label: "SIM - POUCAS", value: "SIM - POUCAS" },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, telhasReservas: value })
                        }
                      />
                      <TextInput
                        label={"LOCAL DE MONTAGEM DO INVERSOR"}
                        editable={true}
                        value={dados.localInstalacaoInversor}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            localInstalacaoInversor: value.toUpperCase(),
                          })
                        }
                      />
                      <TextInput
                        label={"DISTÂNCIA DOS MÓDULOS ATÉ OS INVERSORES"}
                        editable={true}
                        value={
                          dados.distanciaModulosInversores
                            ? dados.distanciaModulosInversores
                            : ""
                        }
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            distanciaModulosInversores: value,
                          })
                        }
                      />
                      <TextInput
                        label={"DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO"}
                        editable={true}
                        value={dados.distanciaInversorPadrao}
                        handleChange={(value) =>
                          setDados({ ...dados, distanciaInversorPadrao: value })
                        }
                      />
                      <TextInput
                        label={"DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR"}
                        editable={true}
                        value={dados.distanciaInversorRoteador}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            distanciaInversorRoteador: value,
                          })
                        }
                      />
                      <SelectInput
                        label={"TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES"}
                        editable={true}
                        value={
                          dados.tipoFixacaoInversores
                            ? dados.tipoFixacaoInversores
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "ALVENARIA", value: "ALVENARIA" },
                          { label: "LANCE DE MURO", value: "LANCE DE MURO" },
                          { label: "PILAR", value: "PILAR" },
                          {
                            label: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                            value: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                          },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoFixacaoInversores: value })
                        }
                      />
                      <TextInput
                        label={"LINK PARA FOTOS DO DRONE"}
                        editable={true}
                        value={dados.fotosDrone}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            fotosDrone: value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2">
                      SERVIÇOS ADICIONAIS
                    </span>
                    <div className="flex gap-2 items-center justify-around flex-wrap mt-4">
                      <SelectInput
                        label={"CASA DE MÁQUINAS"}
                        editable={true}
                        value={
                          dados.casaDeMaquinas
                            ? dados.casaDeMaquinas
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, casaDeMaquinas: value })
                        }
                      />
                      <SelectInput
                        label={"ALAMBRADO"}
                        editable={true}
                        value={
                          dados.alambrado ? dados.alambrado : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, alambrado: value })
                        }
                      />
                      <SelectInput
                        label={"BRITAGEM"}
                        editable={true}
                        value={dados.britagem ? dados.britagem : "NÃO DEFINIDO"}
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, britagem: value })
                        }
                      />
                      <SelectInput
                        label={"CONSTRUÇÃO DE BARRACÃO"}
                        editable={true}
                        value={
                          dados.construcaoBarracao
                            ? dados.construcaoBarracao
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, construcaoBarracao: value })
                        }
                      />
                      <SelectInput
                        label={"INSTALAÇÃO DE ROTEADOR"}
                        editable={true}
                        value={
                          dados.instalacaoRoteador
                            ? dados.instalacaoRoteador
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, instalacaoRoteador: value })
                        }
                      />
                      <SelectInput
                        label={"REDE PARA RELIGAÇÃO DA FAZENDA"}
                        editable={true}
                        value={
                          dados.redeReligacao
                            ? dados.redeReligacao
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, redeReligacao: value })
                        }
                      />
                      <SelectInput
                        label={"LIMPEZA DO LOCAL DA USINA DE SOLO"}
                        editable={true}
                        value={
                          dados.limpezaLocalUsinaSolo
                            ? dados.limpezaLocalUsinaSolo
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, limpezaLocalUsinaSolo: value })
                        }
                      />
                      <SelectInput
                        label={"TERRAPLANAGEM PARA USINA DE SOLO"}
                        editable={true}
                        value={
                          dados.terraplanagemUsinaSolo
                            ? dados.terraplanagemUsinaSolo
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          {
                            label: "SIM - RESPONSABILIDADE AMPÈRE",
                            value: "SIM - RESPONSABILIDADE AMPÈRE",
                          },
                          {
                            label: "SIM - RESPONSABILIDADE CLIENTE",
                            value: "SIM - RESPONSABILIDADE CLIENTE",
                          },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, terraplanagemUsinaSolo: value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
              <span className="text-md text-center font-bold text-[#15599a] uppercase py-2">
                ARQUIVOS
              </span>
              <div className="flex items-center flex-wrap gap-2 justify-around">
                {dados.links.map((link) => (
                  <a
                    key={link.link}
                    href={link.link}
                    className="text-blue-400 font-bold cursor-pointer"
                  >
                    {link.title} - {link.format}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalVisitaTecnica;
