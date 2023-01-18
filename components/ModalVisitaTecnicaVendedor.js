import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import {
  cidadesAtendidas,
  fatorDeGeracaoPorOrientacao,
  suprimentoOption,
} from "../utils/constants";
import { storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
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
function ModalVisitaTecnicaVendedor({ info, setModalIsOpen, handleUpdates }) {
  const [dados, setDados] = useState(info);
  const [msg, setMessage] = useState({ text: "", color: "" });
  const [imageMsg, setImageMsg] = useState({ text: "", color: "" });
  const [laudoType, setLaudoType] = useState("LAUDO TÉCNICO(URBANO)");
  const [suprimentoHolder, setSuprimentoHolder] = useState({
    insumo: Object.keys(suprimentoOption)[0],
    tipo: suprimentoOption[Object.keys(suprimentoOption)[0]].tipo[0],
    qtde: 0,
    medida: suprimentoOption[Object.keys(suprimentoOption)[0]].unidade,
  });
  const [custoAdicionalHolder, setCustoAdicionalHolder] = useState({
    descricao: "",
    qtde: 0,
    grandeza: "",
    valor: 0,
  });
  const [descritivoHolder, setDescritivoHolder] = useState({
    topico: "NÃO DEFINIDO",
    texto: "",
  });
  const [images, setImages] = useState({
    visualizacaoProjeto: "",
  });
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          console.log(res.data.erro);
          return;
        } else {
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
      .put("/api/solicitacoes/visitaTecnica", {
        ...dados,
        status: "NÃO DEFINIDO",
      })
      .then((res) => {
        setMessage({ text: "Alterações feitas", color: "text-green-500" });
        handleUpdates();
      })
      .catch((err) =>
        setMessage({
          text: "Houve um erro, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  /*
  function concludeVisita() {
    setDados({ ...dados, status: "CONCLUIDO" });
    axios
      .put("/api/solicitacoes/visitaTecnica", {
        _id: dados._id,
        status: "CONCLUIDO",
        dataDeConclusao: new Date().toISOString(),
      })
      .then((res) => {
        setMessage({ text: "Alterações feitas", color: "text-green-500" });
        handleUpdates();
      })
      .catch((err) =>
        setMessage({
          text: "Houve um erro, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  function addSupply() {
    var arr = dados.suprimentos ? dados.suprimentos : [];
    setDados({
      ...dados,
      suprimentos: [...arr, suprimentoHolder],
    });
    setSuprimentoHolder({
      insumo: Object.keys(suprimentoOption)[0],
      tipo: "",
      qtde: 0,
      medida: suprimentoOption[Object.keys(suprimentoOption)[0]].unidade,
    });
  }
  function addCost() {
    var arr = dados.custosAdicionais ? dados.custosAdicionais : [];
    setDados({ ...dados, custosAdicionais: [...arr, custoAdicionalHolder] });
    setCustoAdicionalHolder({ descricao: "", qtde: 0, grandeza: "", valor: 0 });
  }
  function addDesc() {
    var arr = dados.descritivo ? dados.descritivo : [];
    arr.push(descritivoHolder);
    setDados({ ...dados, descritivo: arr });
    setDescritivoHolder({
      topico: "NÃO DEFINIDO",
      texto: "",
    });
  }
  async function uploadImage() {
    try {
      if (images.visualizacaoProjeto) {
        var imageRef = ref(
          storage,
          `clientes/${dados.nomeDoCliente}-${dados.codigoSVB}/visualizacaoProjeto`
        );
        let res = await uploadBytes(imageRef, images.visualizacaoProjeto.file);
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        await axios.put("/api/solicitacoes/visitaTecnica", {
          _id: dados._id,
          linkVisualizacaoProjeto: url,
        });
        setDados({ ...dados, linkVisualizacaoProjeto: url });
        setImageMsg({
          text: "Imagem salva com sucesso",
          color: "text-green-500",
        });
      } else {
        setImageMsg({
          text: "Por favor, anexe uma imagem.",
          color: "text-red-500",
        });
      }
    } catch (error) {
      setImageMsg({ text: "Erro ao enviar imagem.", color: "text-red-500" });
    }
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
    return cep;
  }
  */
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex flex-col lg:flex-row justify-around gap-2 flex-wrap items-center px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] p-0 lg:pl-6 font-bold text-xs lg:text-base">
              {dados.nomeDoCliente}
            </h1>
            {dados.status != "CONCLUIDO" ? (
              <div className="flex items-center gap-2 justify-evenly">
                <select
                  disabled={true}
                  value={dados.status ? dados.status : "NÃO DEFINIDO"}
                  onChange={(e) =>
                    setDados({ ...dados, status: e.target.value })
                  }
                  className="outline-none p-2 text-[#15599a] font-bold text-xs lg:text-base"
                >
                  <option value="EM ANÁLISE TÉCNICA">EM ANÁLISE TÉCNICA</option>
                  <option value="PENDÊNCIA COMERCIAL">
                    PENDÊNCIA COMERCIAL
                  </option>
                  <option value="VISITA IN LOCO">VISITA IN LOCO</option>
                  <option value="REJEITADA">REJEITADA</option>
                  <option value="NÃO DEFINIDO">NÃO DEFINIDO</option>
                </select>
              </div>
            ) : (
              <p className="font-bold p-1 bg-green-400 text-white rounded">
                CONCLUIDO
              </p>
            )}
            <div className="flex items-center justify-around gap-x-2">
              {msg.text && <p className={`italic ${msg.color}`}>{msg.text}</p>}
              <button
                onClick={saveChanges}
                className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm w-fit"
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
                  editable={false}
                  value={dados.nomeDoCliente}
                  handleChange={(value) =>
                    setDados({ ...dados, nomeDoCliente: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"TELEFONE DO CLIENTE"}
                  editable={dados.status == "REJEITADA" ? true : false}
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
                  editable={false}
                  value={dados.codigoSVB ? dados.codigoSVB : ""}
                  handleChange={(value) =>
                    setDados({ ...dados, codigoSVB: Number(value) })
                  }
                />
                <SelectInput
                  label={"CIDADE"}
                  editable={dados.status == "REJEITADA" ? true : false}
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
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.cep}
                  handleChange={(value) =>
                    setDados({ ...dados, cep: formatCEP(value) })
                  }
                />
                <TextInput
                  label={"BAIRRO"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.bairro}
                  handleChange={(value) =>
                    setDados({ ...dados, bairro: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"LOGRADOURO"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.logradouro}
                  handleChange={(value) =>
                    setDados({ ...dados, logradouro: value.toUpperCase() })
                  }
                />
                <NumberInput
                  label={"N°RESIDÊNCIA"}
                  editable={dados.status == "REJEITADA" ? true : false}
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
                  editable={dados.status == "REJEITADA" ? true : false}
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
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.qtdeInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeInversor: Number(value) })
                  }
                />
                <NumberInput
                  label={"POTÊNCIA DO INVERSOR"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  unit={"W"}
                  value={dados.potInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, potInversor: Number(value) })
                  }
                />
                <TextInput
                  label={"MARCA DO INVERSOR"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.marcaInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaInversor: value.toUpperCase() })
                  }
                />
                <NumberInput
                  label={"QTDE DE MODULOS"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.qtdeModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeModulos: Number(value) })
                  }
                />
                <NumberInput
                  label={"POTÊNCIA DOS MÓDULOS"}
                  editable={dados.status == "REJEITADA" ? true : false}
                  value={dados.potModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, potModulos: Number(value) })
                  }
                />
                <TextInput
                  label={"MARCA DOS MÓDULOS"}
                  editable={dados.status == "REJEITADA" ? true : false}
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
                    readOnly={true}
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
                  editable={dados.status == "REJEITADA" ? true : false}
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
                  editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
                      value={dados.numeroMedidor}
                      handleChange={(value) =>
                        setDados({ ...dados, numeroMedidor: value })
                      }
                    />
                    <TextInput
                      label={"PARA PADRÕES CONJUGADOS"}
                      placeholder="ESCREVA: CAIXA 1 - APD1111111 - 40A MONOFÁSICO/ CAIXA 2 - APD222222 - 60A BIFÁSICO ..."
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      label={"TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES"}
                      editable={dados.status == "REJEITADA" ? true : false}
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
                    <SelectInput
                      label={"TIPO DA TELHA (EXEMPLO ABAIXO)"}
                      editable={dados.status == "REJEITADA" ? true : false}
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
                        { label: "ZINCO", value: "ZINCO" },
                        { label: "CAPE E BICA", value: "CAPE E BICA" },
                        { label: "LAJE", value: "LAJE" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoTelha: value })
                      }
                    />
                    <SelectInput
                      label={"CLIENTE POSSUI TELHAS RESERVAS"}
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                      editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={dados.potTrafo ? dados.potTrafo : ""}
                        handleChange={(value) =>
                          setDados({ ...dados, potTrafo: Number(value) })
                        }
                      />
                      <TextInput
                        label={"NÚMERO DO TRANSFORMADOR"}
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={dados.numeroTrafo}
                        handleChange={(value) =>
                          setDados({ ...dados, numeroTrafo: value })
                        }
                      />
                      <TextInput
                        label={"NÚMERO POSTE DO TRANSFORMADOR"}
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={dados.numeroPosteTrafo}
                        handleChange={(value) =>
                          setDados({ ...dados, numeroPosteTrafo: value })
                        }
                      />
                      <SelectInput
                        label={"PENDÊNCIAS"}
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={
                          dados.pendenciasTrafo
                            ? dados.pendenciasTrafo
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                          { label: "SIM", value: "SIM" },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, pendenciasTrafo: value })
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={dados.distanciaInversorPadrao}
                        handleChange={(value) =>
                          setDados({ ...dados, distanciaInversorPadrao: value })
                        }
                      />
                      <TextInput
                        label={"DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR"}
                        editable={dados.status == "REJEITADA" ? true : false}
                        value={dados.distanciaInversorRoteador}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            distanciaInversorRoteador: value,
                          })
                        }
                      />
                      <TextInput
                        label={"LINK PARA FOTOS DO DRONE"}
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
                        editable={dados.status == "REJEITADA" ? true : false}
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
            {dados.tipoDeSolicitacao == "DESENHO PERSONALIZADO" && (
              <>
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
                      placeholder={
                        "DEIXE AQUI OBSERVAÇÕES SOBRE ESSA SOLICITAÇÃO"
                      }
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
                      editable={dados.status == "REJEITADA" ? true : false}
                      value={
                        dados.tipoDesenho ? dados.tipoDesenho : "NÃO DEFINIDO"
                      }
                      options={[
                        {
                          label: "SOLAR EDGE DESIGN",
                          value: "SOLAR EDGE DESIGN",
                        },
                        { label: "REVIT 3D", value: "REVIT 3D" },
                        { label: "AUTOCAD 2D", value: "AUTOCAD 2D" },
                        {
                          label: "APENAS VIABILIDADE DE ESPAÇO",
                          value: "APENAS VIABILIDADE DE ESPAÇO",
                        },
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoDesenho: value })
                      }
                    />
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
                </div>
              </>
            )}
            {dados.tipoDeSolicitacao == "ORÇAMENTAÇÃO" && (
              <>
                <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
                  <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                    ORÇAMENTAÇÃO
                  </span>
                  <div className="flex gap-2 justify-around flex-wrap mt-2">
                    <SelectInput
                      label={"TIPO DE ORÇAMENTAÇÃO"}
                      editable={dados.status == "REJEITADA" ? true : false}
                      value={
                        dados.tipoOrcamentacao
                          ? dados.tipoOrcamentacao
                          : "NÃO DEFINIDO"
                      }
                      options={[
                        { label: "PADRÃO", value: "PADRÃO" },
                        {
                          label: "BARRACÃO COM TELHA",
                          value: "BARRACÃO COM TELHA",
                        },
                        {
                          label: "BARRACÃO SEM TELHA",
                          value: "BARRACÃO SEM TELHA",
                        },
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
                  <div className="flex flex-col w-full text-sm lg:text-base items-center mt-2">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DESCRIÇÃO PARA ORÇAMENTAÇÃO
                    </span>
                    <input
                      className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                      value={dados.descricaoOrcamentacao}
                      readOnly={true}
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
            <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
              <div className="flex flex-col">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  CAMPOS ADICIONAIS P/OBRAS
                </span>
                <div className="w-full flex items-center justify-center gap-2 flex-wrap">
                  <SelectInput
                    label={"ESPAÇO NO QGBT"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.espacoQGBT ? dados.espacoQGBT : "NÃO DEFINIDO"}
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, espacoQGBT: value })
                    }
                  />
                  <SelectInput
                    label={"ADAPTAÇÃO NO QGBT"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.adaptacaoQGBT ? dados.adaptacaoQGBT : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "CORTE", value: "CORTE" },
                      { label: "TRILHO", value: "TRILHO" },
                      { label: "CORTE E TRILHO", value: "CORTE E TRILHO" },
                      { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
                      { label: "NÃO", value: "NÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, adaptacaoQGBT: value })
                    }
                  />
                  <SelectInput
                    label={"AVALIAR TELHADO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.avaliarTelhado
                        ? dados.avaliarTelhado
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, avaliarTelhado: value })
                    }
                  />
                  <SelectInput
                    label={"DPS NO QGBT"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.dpsQGBT ? dados.dpsQGBT : "NÃO DEFINIDO"}
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, dpsQGBT: value })
                    }
                  />
                  <SelectInput
                    label={"INFRA PARA LANÇAMENTOS DE CABOS"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.infraCabos ? dados.infraCabos : "NÃO DEFINIDO"}
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "KIT NORMAL", value: "KIT NORMAL" },
                      { label: "KIT+MANGUEIRA", value: "KIT+MANGUEIRA" },
                      { label: "PERSONALIZADO", value: "PERSONALIZADO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, infraCabos: value })
                    }
                  />
                  <TextInput
                    label={"DISTÂNCIA ITBA À ZONA RURAL"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.distanciaItbaRural}
                    handleChange={(value) =>
                      setDados({ ...dados, distanciaItbaRural: value })
                    }
                  />
                  <TextInput
                    label={"DISTÂNCIA DO SISTEMA AO INVERSOR"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.distanciaSistemaInversor}
                    handleChange={(value) =>
                      setDados({ ...dados, distanciaSistemaInversor: value })
                    }
                  />
                  <SelectInput
                    label={"REALIMENTAR A FAZENDA ?"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.realimentar ? dados.realimentar : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, realimentar: value })
                    }
                  />
                  <SelectInput
                    label={"TEM ESTUDO DE CASO?"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.temEstudoDeCaso
                        ? dados.temEstudoDeCaso
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, temEstudoDeCaso: value })
                    }
                  />
                </div>
                <div className="flex flex-col w-full self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES P/OBRAS
                  </span>
                  <textarea
                    value={dados.obsObras}
                    placeholder={"Observações da obra aqui..."}
                    readOnly={true}
                    onChange={(e) => {
                      setDados({
                        ...dados,
                        obsObras: e.target.value.toUpperCase(),
                      });
                    }}
                    className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  CAMPOS ADICIONAIS P/SUPRIMENTOS
                </span>
                <div className="w-full grid items-center grid-cols-4">
                  <SelectInput
                    label={"INSUMO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={suprimentoHolder.insumo}
                    options={Object.keys(suprimentoOption).map((key) => {
                      return { label: key, value: key };
                    })}
                    handleChange={(value) =>
                      setSuprimentoHolder({
                        ...suprimentoHolder,
                        insumo: value,
                        tipo: suprimentoOption[value].tipo[0],
                        medida: suprimentoOption[value].unidade,
                      })
                    }
                  />
                  <SelectInput
                    label={"TIPO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={suprimentoHolder.tipo}
                    options={suprimentoOption[suprimentoHolder.insumo].tipo.map(
                      (tipo) => {
                        return { label: tipo, value: tipo };
                      }
                    )}
                    handleChange={(value) => {
                      setSuprimentoHolder({
                        ...suprimentoHolder,
                        tipo: value,
                      });
                    }}
                  />
                  <NumberInput
                    label={"QUANTIDADE"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={suprimentoHolder.qtde}
                    handleChange={(value) =>
                      setSuprimentoHolder({
                        ...suprimentoHolder,
                        qtde: Number(value),
                      })
                    }
                  />
                  <p className="text-gray-600 text-xs text-center">
                    {suprimentoHolder.medida}
                  </p>
                </div>
                <div className="flex flex-col mx-12 mt-2 gap-2">
                  <div className="grid grid-cols-4 w-full">
                    <p className="text-md text-[#fead61] font-bold text-center">
                      INSUMO
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      TIPO
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      QUANTIDADE
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      UNIDADE
                    </p>
                  </div>
                  {dados.suprimentos?.map((suprimento, index) => (
                    <div key={index} className="grid grid-cols-4 w-full">
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {suprimento.insumo}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {suprimento.tipo}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {suprimento.qtde}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {suprimento.medida}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col w-full self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES P/SUPRIMENTOS
                  </span>
                  <textarea
                    value={dados.obsSuprimentos}
                    placeholder={"Observações da obra aqui..."}
                    readOnly={true}
                    onChange={(e) => {
                      setDados({
                        ...dados,
                        obsSuprimentos: e.target.value.toUpperCase(),
                      });
                    }}
                    className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  CAMPOS ADICIONAIS P/PROJETOS
                </span>
                <div className="flex items-center justify-around flex-wrap">
                  <SelectInput
                    label={"CONCESSIONÁRIA"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.concessionaria
                        ? dados.concessionaria
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "CEMIG", value: "CEMIG" },
                      { label: "ENEL", value: "ENEL" },
                      { label: "CELG", value: "CELG" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, concessionaria: value })
                    }
                  />
                  <SelectInput
                    label={"TIPO DE PROJETO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.tipoProjeto ? dados.tipoProjeto : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "MINI GERAÇÃO", value: "MINI GERAÇÃO" },
                      { label: "MICRO GERAÇÃO", value: "MICRO GERAÇÃO" },
                      { label: "REDE MÉDIA", value: "REDE MÉDIA" },
                      { label: "REDE BAIXA", value: "REDE BAIXA" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, tipoProjeto: value })
                    }
                  />
                  <SelectInput
                    label={"MODELO DA CAIXA"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.modeloCaixa ? dados.modeloCaixa : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "CM-1", value: "CM-1" },
                      { label: "CM-2", value: "CM-2" },
                      { label: "CM-3", value: "CM-3" },
                      { label: "CM-4", value: "CM-4" },
                      { label: "CM-8", value: "CM-8" },
                      { label: "CM-9", value: "CM-9" },
                      { label: "CM-13", value: "CM-13" },
                      { label: "CM-14", value: "CM-14" },
                      { label: "CM-18", value: "CM-18" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, modeloCaixa: value })
                    }
                  />
                  <SelectInput
                    label={"PENDÊNCIAS"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.pendenciasProjetos
                        ? dados.pendenciasProjetos
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      {
                        label: "AMPERAGEM DISJUNTOR",
                        value: "AMPERAGEM DISJUNTOR",
                      },
                      { label: "Nº MEDIDOR", value: "Nº MEDIDOR" },
                      { label: "CAIXA CONJUGADA", value: "CAIXA CONJUGADA" },
                      { label: "SEM PENDÊNCIA", value: "SEM PENDÊNCIA" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, pendenciasProjetos: value })
                    }
                  />
                  <TextInput
                    label={"NÚMERO POSTE DE DERIVAÇÃO(GOIÁS)"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.numeroPosteDerivacao}
                    handleChange={(value) =>
                      setDados({ ...dados, numeroPosteDerivacao: value })
                    }
                  />
                  <NumberInput
                    label={"POTÊNCIA DO FUSÍVEL"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={dados.potFusivel}
                    handleChange={(value) =>
                      setDados({ ...dados, potFusivel: value })
                    }
                  />
                  <SelectInput
                    label={"SE AUMENTO, NOVO TIPO DE LIGAÇÃO DO PADRÃO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.novaLigacaoPadrao
                        ? dados.novaLigacaoPadrao
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "MONOFÁSICO", value: "MONOFÁSICO" },
                      { label: "BIFÁSICO", value: "BIFÁSICO" },
                      { label: "TRIFÁSICO", value: "TRIFÁSICO" },
                      { label: "NÃO TEM AUMENTO", value: "NÃO TEM AUMENTO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, novaLigacaoPadrao: value })
                    }
                  />
                  <SelectInput
                    label={"SE AUMENTO, NOVA AMPERAGEM"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.novaAmperagem ? dados.novaAmperagem : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "40A", value: "40A" },
                      { label: "63A", value: "63A" },
                      { label: "80A", value: "80A" },
                      { label: "100A", value: "100A" },
                      { label: "125A", value: "125A" },
                      { label: "150A", value: "150A" },
                      { label: "200A", value: "200A" },
                      { label: "NÃO TEM AUMENTO", value: "NÃO TEM AUMENTO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, novaAmperagem: value })
                    }
                  />
                  <SelectInput
                    label="FOTOS DO DRONE"
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.fotoDroneDesenho
                        ? dados.fotoDroneDesenho
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, fotoDroneDesenho: value })
                    }
                  />
                  <SelectInput
                    label="FOTO CLARA DA FAIXADA"
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.fotoFaixada ? dados.fotoFaixada : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, fotoFaixada: value })
                    }
                  />
                  <SelectInput
                    label="MEDIDAS DO LOCAL"
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.medidasLocal ? dados.medidasLocal : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, medidasLocal: value })
                    }
                  />
                  <SelectInput
                    label="GOOGLE EARTH"
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.googleEarth ? dados.googleEarth : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "SIM", value: "SIM" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, googleEarth: value })
                    }
                  />
                </div>
                <div className="flex flex-col w-full self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES P/PROJETOS
                  </span>
                  <textarea
                    value={dados.obsProjetos}
                    placeholder={"Observações da obra aqui..."}
                    readOnly={true}
                    onChange={(e) => {
                      setDados({
                        ...dados,
                        obsProjetos: e.target.value.toUpperCase(),
                      });
                    }}
                    className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
                <div className="flex flex-col w-full self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    DESCRITIVO
                  </span>
                  <div className="flex items-center justify-around">
                    <SelectInput
                      label={"TÓPICO"}
                      editable={dados.status == "REJEITADA" ? true : false}
                      value={descritivoHolder.topico}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "INFRA ELÉTRICA", value: "INFRA ELÉTRICA" },
                        { label: "AQUECEDOR", value: "AQUECEDOR" },
                        { label: "SOMBREAMENTO", value: "SOMBREAMENTO" },
                      ]}
                      handleChange={(value) =>
                        setDescritivoHolder({
                          ...descritivoHolder,
                          topico: value,
                        })
                      }
                    />
                    <TextInput
                      label={"TEXTO"}
                      editable={dados.status == "REJEITADA" ? true : false}
                      value={descritivoHolder.texto}
                      handleChange={(value) =>
                        setDescritivoHolder({
                          ...descritivoHolder,
                          texto: value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center flex-col h-[100px] border border-gray-200 w-full my-2 p-2 overflow-y-auto overscroll-y-auto">
                    {dados.descritivo?.length ? (
                      dados.descritivo?.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-10 gap-3 w-full items-center"
                        >
                          <p className="text-xxs lg:text-xs text-[#15599a] font-bold col-span-1">
                            {item.topico}
                          </p>
                          <p
                            className={`${
                              item.texto.length > 100 ? "text-xxs" : "text-xs"
                            } text-gray-600 font-bold text-center col-span-8`}
                          >
                            {item.texto}
                          </p>
                          <div
                            onClick={() => {
                              let desc = dados.descritivo;
                              desc.splice(index, 1);
                              setDados({
                                ...dados,
                                descritivo: desc,
                              });
                            }}
                            className="flex items-center justify-center cursor-pointer"
                          >
                            <div className="bg-red-500 rounded w-fit p-1 col-span-1">
                              <FiDelete style={{ fontSize: "10px" }} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center text-center h-full italic text-gray-600">
                        SEM DESCRITIVO
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  RESPOSTA VISITA TÉCNICA
                </span>
                <div className="flex flex-wrap justify-around gap-2">
                  <SelectInput
                    label={"PADRÃO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaPadrao
                        ? dados.respostaPadrao
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "APTO", value: "APTO" },
                      { label: "REFORMA", value: "REFORMA" },
                      { label: "TROCAR PADRÃO", value: "TROCAR PADRÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaPadrao: value })
                    }
                  />
                  <SelectInput
                    label={"ESPAÇO PARA PROJETO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaEspacoProjeto
                        ? dados.respostaEspacoProjeto
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaEspacoProjeto: value })
                    }
                  />
                  <SelectInput
                    label={"ESTRUTURA DE INCLINAÇÃO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaEstruturaInclinacao
                        ? dados.respostaEstruturaInclinacao
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaEstruturaInclinacao: value })
                    }
                  />
                  <SelectInput
                    label={"POSSUI SOMBRA ?"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaPossuiSombra
                        ? dados.respostaPossuiSombra
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaPossuiSombra: value })
                    }
                  />
                  <SelectInput
                    label={"MADERAMENTO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaMaderamento
                        ? dados.respostaMaderamento
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "APTO", value: "APTO" },
                      { label: "CONDENADO", value: "CONDENADO" },
                      { label: "REFORÇAR", value: "REFORÇAR" },
                      {
                        label: "AVALIAR NA MONTAGEM",
                        value: "AVALIAR NA MONTAGEM",
                      },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaMaderamento: value })
                    }
                  />
                  <SelectInput
                    label={"NECESSÁRIO EXPLICAÇÃO DETALHADA"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={
                      dados.respostaExplicacaoDetalhada
                        ? dados.respostaExplicacaoDetalhada
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                    ]}
                    handleChange={(value) =>
                      setDados({ ...dados, respostaExplicacaoDetalhada: value })
                    }
                  />
                </div>
                <div className="flex flex-col w-full self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    CONCLUSÃO
                  </span>
                  <textarea
                    value={dados.respostaConclusao}
                    readOnly={true}
                    placeholder={"Observações da obra aqui..."}
                    onChange={(e) => {
                      setDados({
                        ...dados,
                        respostaConclusao: e.target.value.toUpperCase(),
                      });
                    }}
                    className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  CUSTOS ADICIONAIS
                </span>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <TextInput
                    label={"DESCRIÇÃO"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={custoAdicionalHolder.descricao}
                    handleChange={(value) =>
                      setCustoAdicionalHolder({
                        ...custoAdicionalHolder,
                        descricao: value.toUpperCase(),
                      })
                    }
                  />
                  <NumberInput
                    label={"QUANTIDADE"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={custoAdicionalHolder.qtde}
                    handleChange={(value) =>
                      setCustoAdicionalHolder({
                        ...custoAdicionalHolder,
                        qtde: Number(value),
                      })
                    }
                  />
                  <TextInput
                    label={"GRANDEZA"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={custoAdicionalHolder.grandeza}
                    handleChange={(value) =>
                      setCustoAdicionalHolder({
                        ...custoAdicionalHolder,
                        grandeza: value.toUpperCase(),
                      })
                    }
                  />
                  <NumberInput
                    label={"VALOR"}
                    editable={dados.status == "REJEITADA" ? true : false}
                    value={custoAdicionalHolder.valor}
                    handleChange={(value) =>
                      setCustoAdicionalHolder({
                        ...custoAdicionalHolder,
                        valor: Number(value),
                      })
                    }
                  />
                  <div className="flex flex-col items-center">
                    <p className="font-bold font-raleway">TOTAL</p>
                    <p className="text-gray-600 text-xs text-center">
                      R$
                      {(custoAdicionalHolder.qtde * custoAdicionalHolder.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col mx-12 mt-2 gap-2">
                  <div className="grid grid-cols-5 w-full">
                    <p className="text-md text-[#fead61] font-bold text-center">
                      DESCRIÇÃO
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      QUANTIDADE
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      GRANDEZA
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      VALOR
                    </p>
                    <p className="text-md text-[#fead61] font-bold text-center">
                      VALOR TOTAL
                    </p>
                  </div>
                  {dados.custosAdicionais?.map((custo, index) => (
                    <div key={index} className="grid grid-cols-5 w-full">
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {custo.descricao}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {custo.qtde}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {custo.grandeza}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {custo.valor}
                      </p>
                      <p className="text-xs text-gray-600 font-bold text-center">
                        {(custo.valor * custo.qtde).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                ESTUDO DE GERAÇÃO - DESVIO AZIMUTAL
              </span>
              <div className="grid grid-cols-2 grid-rows-4">
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">NORTE</p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modNorte}
                    onChange={(e) =>
                      setDados({ ...dados, modNorte: Number(e.target.value) })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modNorte && fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade]["NORTE"]
                          ) *
                            dados.modNorte *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">
                    NORDESTE
                  </p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modNordeste}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        modNordeste: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modNordeste &&
                    fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade][
                              "NORDESTE"
                            ]
                          ) *
                            dados.modNordeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">LESTE</p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modLeste}
                    onChange={(e) =>
                      setDados({ ...dados, modLeste: Number(e.target.value) })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modLeste && fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade]["LESTE"]
                          ) *
                            dados.modLeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">SUDESTE</p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modSudeste}
                    onChange={(e) =>
                      setDados({ ...dados, modSudeste: Number(e.target.value) })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modSudeste &&
                    fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade]["SUDESTE"]
                          ) *
                            dados.modSudeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">SUL</p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modSul}
                    onChange={(e) =>
                      setDados({ ...dados, modSul: Number(e.target.value) })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modSul && fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade]["SUL"]
                          ) *
                            dados.modSul *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">
                    SUDOESTE
                  </p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modSudoeste}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        modSudoeste: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modSudoeste &&
                    fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade][
                              "SUDOESTE"
                            ]
                          ) *
                            dados.modSudoeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">OESTE</p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modOeste}
                    onChange={(e) =>
                      setDados({ ...dados, modOeste: Number(e.target.value) })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modOeste && fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade]["OESTE"]
                          ) *
                            dados.modOeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <p className="text-center font-bold text-gray-700">
                    NOROESTE
                  </p>
                  <input
                    className="outline-none p-2 text-center font-bold text-gray-700"
                    type={"number"}
                    readOnly={true}
                    value={dados.modNoroeste}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        modNoroeste: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-center font-bold text-gray-700">
                    {dados.modNoroeste &&
                    fatorDeGeracaoPorOrientacao[dados.cidade]
                      ? (
                          (Number(
                            fatorDeGeracaoPorOrientacao[dados.cidade][
                              "NOROESTE"
                            ]
                          ) *
                            dados.modNoroeste *
                            dados.potModulos) /
                          1000
                        ).toFixed(2)
                      : false}{" "}
                    kWh
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-2 border border-[#15599a] p-4 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                IMAGEM PARA VISUALIZAÇÃO DO PROJETO
              </span>
              {dados.linkVisualizacaoProjeto && (
                <div className="flex flex-col items-center">
                  <a
                    href={dados.linkVisualizacaoProjeto}
                    className="text-green-400 font-bold cursor-pointer"
                  >
                    IMAGEM ATUAL
                  </a>
                  <div className="w-[100px] h-[100px]">
                    <Image
                      width={"100px"}
                      height={"100px"}
                      src={dados.linkVisualizacaoProjeto}
                      objectFit="fill"
                      alt="VISUALIZAÇÃO DO PROJETO"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex items-center justify-center gap-2 border border-[#15599a] p-4 shadow-lg bg-[#fff]">
              <SelectInput
                label={"TIPO DE LAUDO(PDF)"}
                editable={true}
                value={laudoType}
                options={[
                  {
                    label: "LAUDO TÉCNICO(URBANO)",
                    value: "LAUDO TÉCNICO(URBANO)",
                  },
                  {
                    label: "LAUDO SIMPLES(URBANO)",
                    value: "LAUDO SIMPLES(URBANO)",
                  },
                  {
                    label: "LAUDO INTERMEDIÁRIO(URBANO)",
                    value: "LAUDO INTERMEDIÁRIO(URBANO)",
                  },
                  {
                    label: "LAUDO TÉCNICO(RURAL)",
                    value: "LAUDO TÉCNICO(RURAL)",
                  },
                  {
                    label: "LAUDO SIMPLES(RURAL)",
                    value: "LAUDO SIMPLES(RURAL)",
                  },
                ]}
                handleChange={(value) => setLaudoType(value)}
              />
              <Link href={`/projetos/laudo/pdf/${dados._id}?tipo=${laudoType}`}>
                <button className="p-2 rounded bg-[#fead61] font-bold hover:bg-[#15599a] hover:text-white">
                  LAUDO
                </button>
              </Link>
            </div>
            <div className="w-full flex items-center justify-center gap-2">
              {!dados.solicitacaoContrato && (
                <Link
                  href={`/publico/formSolicitacao?cliente=${dados.nomeDoCliente}-${dados.codigoSVB}&id=${dados._id}`}
                >
                  <button className="p-2 rounded bg-[#fead61] font-bold hover:bg-[#15599a] hover:text-white">
                    SOLICITAR CONTRATO
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalVisitaTecnicaVendedor;
