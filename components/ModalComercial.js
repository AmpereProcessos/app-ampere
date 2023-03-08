import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKey } from "../utils/hooks";
import {
  cidadesAtendidas,
  vendedores,
  projetistas,
  statusLiberacao,
  credores,
  localEntregaOptions,
  fornecedores,
  tiposDeServico,
  tiposDeEstruturas,
  equipesTecnicas,
  oemPlans,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import axios from "axios";
import dayjs from "dayjs";
import NotificationCreationBlock from "./NotificationCreationBlock";
import AnexoArquivo from "./AnexoArquivo";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
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
  backgroundColor: "rgba(0,0,0,.85)",
  zIndex: 1000,
};
const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const modal = {
  hidden: {
    y: "-50%",
    x: "-50%",
    scale: 0.7,
    opacity: 0.3,
  },
  visible: {
    y: "-50%",
    x: "-50%",
    scale: 1,
    opacity: 1,
  },
};
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalComercial({
  open,
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const [infoHolder, setInfo] = useState(project);
  const [infoVisita, setInfoVisita] = useState({});
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${infoHolder.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          console.log(
            cidadesAtendidas.includes(res.data.localidade.toUpperCase())
          );
          setInfo({
            ...infoHolder,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
          setChanges({
            ...changes,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
        }
      });
  }
  async function handleChanges() {
    if (
      infoHolder.contrato.status != "ASSINADO" &&
      infoHolder.pagamento.status == "PAGO"
    ) {
      setMsg({ text: "Verifique as informações!", color: "text-red-400" });
    } else if (
      !infoHolder.comissionamento?.comercial &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o relatório de comissionamento.",
        color: "text-red-400",
      });
    } else if (
      infoHolder.linkDrive?.trim().length < 5 &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o link do cliente no drive",
        color: "text-red-400",
      });
    } else {
      axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
        setMsg({ text: "Alterações feitas !", color: "text-green-400" });
        handleUpdates(project._id);
      });
    }
  }
  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        links: 1,
      })
      .then((res) => {
        console.log(res.data);
        if (!project.links?.visitaTecnica) {
          project.links = { ...project.links, visitaTecnica: res.data.links };
          setInfo({
            ...infoHolder,
            links: {
              ...infoHolder.links,
              visitaTecnica: res.data.links,
            },
          });
          return setChanges({
            ...changes,
            "links.visitaTecnica": res.data.links,
          });
        }
      });
  }
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg border-b border-gray-200 pb-2">
            <div className="flex gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
            </div>
            <div className="flex gap-x-2">
              {msg.text && (
                <p className={`text-sm italic ${msg.color}`}>{msg.text}</p>
              )}
              <button
                onClick={handleChanges}
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
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <NotificationCreationBlock
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
              />
            </div>
            <InfoClienteBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoVisitaTecnicaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {![
              "OPERAÇÃO E MANUTENÇÃO",
              "BOMBA SOLAR",
              "SISTEMA FOTOVOLTAICO (OFF GRID)",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoPadraoBlock
                comercialEdition={true}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={true}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoContratoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              minimalInfo={false}
              showPaymentInfo={true}
            />
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                PAGAMENTO
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                {/*<SelectInput
                    label={"STATUS PAGAMENTO"}
                    value={
                      infoHolder.pagamento?.status
                        ? infoHolder.pagamento?.status
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO PAGAMENTO",
                        value: "AGUARDANDO PAGAMENTO",
                      },
                      {
                        label: "PAGO",
                        value: "PAGO",
                      },
                      {
                        label: "RESCISÃO",
                        value: "RESCISÃO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.status": value,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          status: value,
                        },
                      });
                    }}
                  />*/}
                <SelectInput
                  label={"FORMA DE PAGAMENTO"}
                  value={
                    infoHolder.pagamento?.forma
                      ? infoHolder.pagamento?.forma
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "CAPITAL PROPRIO",
                      value: "CAPITAL PROPRIO",
                    },
                    {
                      label: "FINANCIAMENTO",
                      value: "FINANCIAMENTO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.forma": value,
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        forma: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"EMPRESA A FATURAR"}
                  value={
                    infoHolder.faturamento?.empresaFaturamento != undefined &&
                    infoHolder.faturamento?.empresaFaturamento != "-"
                      ? infoHolder.faturamento?.empresaFaturamento
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "AMPERE ENERGIAS",
                      value: "AMPERE ENERGIAS",
                    },
                    {
                      label: "ANALISE DO FINANCEIRO",
                      value: "ANALISE DO FINANCEIRO",
                    },
                    {
                      label: "IZAIRA SERVIÇOS",
                      value: "IZAIRA SERVIÇOS",
                    },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.empresaFaturamento": value,
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        empresaFaturamento: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"Informações faturamento"}
                  editable={editor}
                  value={
                    infoHolder.faturamento?.previsaoFaturamento
                      ? infoHolder.faturamento?.previsaoFaturamento
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.previsaoFaturamento": value.toUpperCase(),
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        previsaoFaturamento: value.toUpperCase(),
                      },
                    });
                  }}
                />
                {infoHolder.pagamento?.forma == "FINANCIAMENTO" && (
                  <SelectInput
                    label={"CREDOR"}
                    value={
                      infoHolder.pagamento?.credor != undefined &&
                      infoHolder.pagamento?.credor != "-----" &&
                      infoHolder.pagamento?.credor != "QUAL CREDOR?"
                        ? infoHolder.pagamento.credor
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={credores.map((credor) => {
                      return { label: credor.label, value: credor.value };
                    })}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.credor": value,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          credor: value,
                        },
                      });
                    }}
                  />
                )}
                <TextInput
                  label={"Pagador"}
                  editable={editor}
                  value={
                    infoHolder.pagamento?.pagador
                      ? infoHolder.pagamento?.pagador
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.pagador": value.toUpperCase(),
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        pagador: value.toUpperCase(),
                      },
                    });
                  }}
                />
                <TextInput
                  label={"Contato pagador"}
                  editable={editor}
                  value={
                    infoHolder.pagamento?.contatoPagador
                      ? infoHolder.pagamento?.contatoPagador
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.contatoPagador": value.toUpperCase(),
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        contatoPagador: value.toUpperCase(),
                      },
                    });
                  }}
                />
              </div>
            </div>
            {infoHolder.tipoDeServico != "MONTAGEM E DESMONTAGEM" && (
              <InfoCompraBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />
            )}
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS INSTALAÇÃO CEMIG
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <TextInput
                  label={"Titular do projeto"}
                  editable={editor}
                  value={
                    infoHolder.dadosCemig?.titularProjeto
                      ? infoHolder.dadosCemig?.titularProjeto
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "dadosCemig.titularProjeto": value,
                    });
                    setInfo({
                      ...infoHolder,
                      dadosCemig: {
                        ...infoHolder.dadosCemig,
                        titularProjeto: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"Número da instalação"}
                  value={
                    infoHolder.dadosCemig?.numeroInstalacao
                      ? infoHolder.dadosCemig?.numeroInstalacao
                      : ""
                  }
                  editable={editor}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "dadosCemig.numeroInstalacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      dadosCemig: {
                        ...infoHolder.dadosCemig,
                        numeroInstalacao: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"DISTRIBUIÇÃO DE CRÉDITOS"}
                  value={
                    infoHolder.dadosCemig?.distCreditos
                      ? infoHolder.dadosCemig?.distCreditos
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "SIM", value: "SIM" },
                    { label: "NÃO", value: "NÃO" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "dadosCemig.distCreditos": value,
                    });
                    setInfo({
                      ...infoHolder,
                      dadosCemig: {
                        ...infoHolder.dadosCemig,
                        distCreditos: value,
                      },
                    });
                  }}
                />
                {infoHolder.dadosCemig?.distCreditos == "SIM" && (
                  <NumberInput
                    label={"QTDE DE DISTRIBUIÇÕES"}
                    editable={editor}
                    value={
                      infoHolder.dadosCemig?.qtdeDistCreditos != undefined &&
                      infoHolder.dadosCemig?.qtdeDistCreditos != "-"
                        ? infoHolder.dadosCemig?.qtdeDistCreditos
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "dadosCemig.qtdeDistCreditos": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          qtdeDistCreditos: Number(value),
                        },
                      });
                    }}
                  />
                )}
              </div>
            </div>
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}

            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                PROJETO
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Projetista"}
                  value={
                    infoHolder.projeto?.projetista?.nome
                      ? infoHolder.projeto?.projetista?.nome
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={projetistas.map((projetista) => {
                    return {
                      label: projetista.label,
                      value: projetista.nome,
                    };
                  })}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "projeto.projetista.nome": value,
                      "projeto.projetista.codigo":
                        projetistas.filter(
                          (projetista) => projetista.nome == value
                        )[0].cod || "-",
                    });
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        projetista: {
                          nome: value,
                          codigo:
                            projetistas.filter(
                              (projetista) => projetista.nome == value
                            )[0].cod || "-",
                        },
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Data de assinatura da documentação"}
                  editable={editor}
                  value={
                    infoHolder.projeto?.dataAssDocumentacao != undefined &&
                    infoHolder.projeto?.dataAssDocumentacao != "-"
                      ? new Date(infoHolder.projeto.dataAssDocumentacao)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "projeto.dataAssDocumentacao": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        dataAssDocumentacao: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Parecer de acesso"}
                  editable={editor}
                  value={
                    infoHolder.parecer?.dataParecerDeAcesso != undefined &&
                    infoHolder.parecer?.dataParecerDeAcesso != "-"
                      ? new Date(infoHolder.parecer?.dataParecerDeAcesso)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "parecer.dataParecerDeAcesso": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      parecer: {
                        ...infoHolder.parecer,
                        dataParecerDeAcesso: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"Status do parecer de acesso"}
                  value={
                    infoHolder.parecer?.statusDoParecerDeAcesso
                      ? infoHolder.parecer?.statusDoParecerDeAcesso
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "AGUARDANDO FATURAMENTO ART",
                      value: "AGUARDANDO FATURAMENTO ART",
                    },
                    {
                      label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                      value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                    },
                    {
                      label: "CANCELADO",
                      value: "CANCELADO",
                    },
                    {
                      label: "INICIAR PROJETO",
                      value: "INICIAR PROJETO",
                    },
                    {
                      label: "PARECER DE ACESSO APROVADO",
                      value: "PARECER DE ACESSO APROVADO",
                    },
                    {
                      label: "PENDENCIAS",
                      value: "PENDENCIAS",
                    },
                    {
                      label: "SOLICITAR ACESSO",
                      value: "SOLICITAR ACESSO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "parecer.statusDoParecerDeAcesso": value,
                    });
                    setInfo({
                      ...infoHolder,
                      parecer: {
                        ...infoHolder.parecer,
                        statusDoParecerDeAcesso: value,
                      },
                    });
                  }}
                />
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    DIAGRAMA UNIFILAR
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.projeto?.diagramaUnifilar === "Ok"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "projeto.diagramaUnifilar": e.target.checked
                            ? "Ok"
                            : "PENDÊNCIA",
                        });
                        setInfo({
                          ...infoHolder,
                          projeto: {
                            ...infoHolder.projeto,
                            diagramaUnifilar: e.target.checked
                              ? "Ok"
                              : "PENDÊNCIA",
                          },
                        });
                      }}
                      type="checkbox"
                      name="diagramaunifilar"
                      id="diagramaunifilar"
                    />
                    <label className="ml-2" htmlFor="diagramaunifilar">
                      OK
                    </label>
                  </div>
                </div>
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    DESENHO DO TELHADO
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.projeto?.desenhoTelhado === "OK"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "projeto.desenhoTelhado": e.target.checked
                            ? "OK"
                            : "PENDÊNCIA",
                        });
                        setInfo({
                          ...infoHolder,
                          projeto: {
                            ...infoHolder.projeto,
                            desenhoTelhado: e.target.checked
                              ? "OK"
                              : "PENDÊNCIA",
                          },
                        });
                      }}
                      type="checkbox"
                      name="desenhotelhado"
                      id="desenhotelhado"
                    />
                    <label className="ml-2" htmlFor="desenhotelhado">
                      OK
                    </label>
                  </div>
                </div>
                <SelectInput
                  label={"MAPA DE MICRO"}
                  editable={editor}
                  value={
                    infoHolder.projeto?.mapaDeMicro != undefined &&
                    infoHolder.projeto?.mapaDeMicro != "-"
                      ? infoHolder.projeto?.mapaDeMicro
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    { label: "OK", value: "OK" },
                    { label: `N\A`, value: `N\A` },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "projeto.mapaDeMicro": value,
                    });
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        mapaDeMicro: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"DATA DO PEDIDO DE VISTORIA"}
                  editable={editor}
                  value={
                    infoHolder.vistoria?.dataPedido != undefined &&
                    infoHolder.vistoria?.dataPedido != "-"
                      ? new Date(infoHolder.vistoria.dataPedido)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "vistoria.dataPedido": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      vistoria: {
                        ...infoHolder.vistoria,
                        dataPedido: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"STATUS DA VISTORIA"}
                  value={
                    infoHolder.vistoria?.status
                      ? infoHolder.vistoria?.status
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "REALIZADA", value: "REALIZADA" },
                    {
                      label: "AGUARDANDO OBRA DE REDE",
                      value: "AGUARDANDO OBRA DE REDE",
                    },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "vistoria.status": value,
                    });
                    setInfo({
                      ...infoHolder,
                      vistoria: {
                        ...infoHolder.vistoria,
                        status: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"DATA TROCA DO MEDIDOR"}
                  editable={editor}
                  value={
                    infoHolder.medidor?.data != undefined &&
                    infoHolder.medidor?.data != "-"
                      ? new Date(infoHolder.medidor.data)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "medidor.data": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      medidor: {
                        ...infoHolder.medidor,
                        data: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"STATUS DA TROCA DO MEDIDOR"}
                  value={
                    infoHolder.medidor?.status
                      ? infoHolder.medidor?.status
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "REALIZADA", value: "REALIZADA" },
                    {
                      label: "AGUARDANDO OBRA DE REDE",
                      value: "AGUARDANDO OBRA DE REDE",
                    },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "medidor.status": value,
                    });
                    setInfo({
                      ...infoHolder,
                      medidor: {
                        ...infoHolder.medidor,
                        status: value,
                      },
                    });
                  }}
                />
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    PROJETO CONCLUÍDO
                  </span>
                  <div className="flex">
                    <input
                      disabled={true}
                      checked={
                        infoHolder.projeto?.projetoConcluido === "SIM"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "projeto.projetoConcluido": e.target.checked
                            ? "SIM"
                            : "NÃO",
                        });
                        setInfo({
                          ...infoHolder,
                          projeto: {
                            ...infoHolder.projeto,
                            projetoConcluido: e.target.checked ? "SIM" : "NÃO",
                          },
                        });
                      }}
                      type="checkbox"
                      name="projetoconcluido"
                      id="projetoconcluido"
                    />
                    <label className="ml-2" htmlFor="projetoconcluido">
                      SIM
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações sobre a obra
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Laudo"}
                  value={
                    infoHolder.obra?.laudo
                      ? infoHolder.obra?.laudo
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "EM ESTUDO", value: "EM ESTUDO" },
                    { label: "EMITIDO", value: "EMITIDO" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.laudo": value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        laudo: value,
                      },
                    });
                  }}
                />
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    SOLICITAÇÃO DA OBRA
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.obra?.statusSolicitacao === "SOLICITADA"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "obra.statusSolicitacao": e.target.checked
                            ? "SOLICITADA"
                            : "NÃO SOLICITADA",
                        });
                        setInfo({
                          ...infoHolder,
                          obra: {
                            ...infoHolder.obra,
                            statusSolicitacao: e.target.checked
                              ? "SOLICITADA"
                              : "NÃO SOLICITADA",
                          },
                        });
                      }}
                      type="checkbox"
                      name="solicitacaoobra"
                      id="solicitacaoobra"
                    />
                    <label className="ml-2" htmlFor="solicitacaoobra">
                      SOLICITADA
                    </label>
                  </div>
                </div>
                <DateInput
                  label={"ENTRADA NA OBRA"}
                  editable={editor}
                  value={
                    infoHolder.obra?.entrada != undefined &&
                    infoHolder.obra?.entrada != "-"
                      ? new Date(infoHolder.obra?.entrada)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.entrada": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        entrada: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"SAIDA DE OBRA"}
                  editable={editor}
                  value={
                    infoHolder.obra?.saida != undefined &&
                    infoHolder.obra?.saida != "-"
                      ? new Date(infoHolder.obra?.saida)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.saida": dayjs(value).isValid()
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        saida: dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"EQUIPE RESPONSÁVEL"}
                  editable={editor}
                  value={
                    infoHolder.obra?.equipeResp != undefined &&
                    infoHolder.obra?.equipeResp != "-"
                      ? infoHolder.obra?.equipeResp == "TERCEIROS" ||
                        infoHolder.obra?.equipeResp == "TERCERIZADOS" ||
                        infoHolder.obra?.equipeResp == "OUTROS"
                        ? "OUTROS"
                        : infoHolder.obra?.equipeResp
                      : "NÃO DEFINIDO"
                  }
                  options={equipesTecnicas.map((equipe) => equipe)}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.equipeResp": value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        equipeResp: value,
                      },
                    });
                  }}
                />
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    CHECKLIST OBRA
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.obra?.checklist === "SIM" ? true : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "obra.checklist": e.target.checked ? "SIM" : "NÃO",
                        });
                        setInfo({
                          ...infoHolder,
                          obra: {
                            ...infoHolder.obra,
                            checklist: e.target.checked ? "SIM" : "NÃO",
                          },
                        });
                      }}
                      type="checkbox"
                      name="checklistobra"
                      id="checklistobra"
                    />
                    <label className="ml-2" htmlFor="checklistobra">
                      SIM
                    </label>
                  </div>
                </div>
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    TRAFO
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={infoHolder.obra?.trafo === "SIM" ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "obra.trafo": e.target.checked ? "SIM" : "NÃO",
                        });
                        setInfo({
                          ...infoHolder,
                          obra: {
                            ...infoHolder.obra,
                            trafo: e.target.checked ? "SIM" : "NÃO",
                          },
                        });
                      }}
                      type="checkbox"
                      name="trafo"
                      id="trafo"
                    />
                    <label className="ml-2" htmlFor="trafo">
                      APLICÁVEL?
                    </label>
                  </div>
                </div>
                <SelectInput
                  label={"STATUS DA OBRA"}
                  value={
                    infoHolder.obra?.statusDaObra
                      ? infoHolder.obra?.statusDaObra
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "AGENDADA",
                      value: "AGENDADA",
                    },
                    {
                      label: "AGUARDANDO AGENDAMENTO",
                      value: "AGUARDANDO AGENDAMENTO",
                    },
                    {
                      label: "CONCLUIDA",
                      value: "CONCLUIDA",
                    },
                    {
                      label: "EM ANDAMENTO",
                      value: "EM ANDAMENTO",
                    },
                    {
                      label: "OBRA CANCELADA",
                      value: "OBRA CANCELADA",
                    },
                    {
                      label: "CASA EM CONSTRUÇÃO",
                      value: "CASA EM CONSTRUÇÃO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.statusDaObra": value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        statusDaObra: value,
                      },
                    });
                  }}
                />
              </div>
              <div className="flex flex-col w-full lg:w-[450px] self-center mt-2 items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  OBSERVAÇÕES
                </span>
                <textarea
                  readOnly={!editor}
                  value={
                    infoHolder.obra?.observacoes
                      ? infoHolder.obra.observacoes
                      : ""
                  }
                  placeholder={"Observações da obra aqui..."}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      "obra.observacoes": e.target.value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        observacoes: e.target.value,
                      },
                    });
                  }}
                  className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                MATERIAL
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Separação do material"}
                  value={
                    infoHolder.material?.statusSeparacao
                      ? infoHolder.material?.statusSeparacao
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "INICIAR SEPARAÇÃO",
                      value: "INICIAR SEPARAÇÃO",
                    },
                    {
                      label: "SEPARADO",
                      value: "SEPARADO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.statusSeparacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        statusSeparacao: value,
                      },
                    });
                  }}
                />
                {credentials?.visualizacao == undefined && (
                  <>
                    {" "}
                    <NumberInput
                      tag={"R$"}
                      label={"Previsão de custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.previsaoCustos != undefined &&
                        infoHolder.material?.previsaoCustos != "#VALUE!"
                          ? infoHolder.material?.previsaoCustos.toFixed(2)
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.previsaoCustos": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            previsaoCustos: Number(value),
                          },
                        });
                      }}
                    />
                    <NumberInput
                      tag={"R$"}
                      label={"Custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.efetivoCustos != undefined &&
                        infoHolder.material?.efetivoCustos != "#VALUE!"
                          ? infoHolder.material?.efetivoCustos
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.efetivoCustos": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            efetivoCustos: Number(value),
                          },
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                ARQUIVOS
              </span>
              <div className="flex flex-col items-center">
                <h1 className="text-xs text-center font-bold text-[#15599a] uppercase py-2">
                  ANEXE ARQUIVOS
                </h1>
                <AnexoArquivo
                  id={infoHolder._id}
                  prevLinks={project.links ? project.links : {}}
                  cliente={`${infoHolder.nomeDoContrato}-${infoHolder.codigoSVB}`}
                  categorias={[
                    { label: "DOCUMENTOS", value: "links.documentos" },
                    { label: "CONTRATOS", value: "links.contratos" },
                    {
                      label: "EQUIPAMENTOS",
                      value: "links.equipamentos",
                    },
                    { label: "PROJETOS", value: "links.projetos" },
                  ]}
                  handleUpdates={handleUpdates}
                />
              </div>
              {project.links && (
                <div className="flex justify-around gap-2 mt-3 flex-wrap">
                  {Object.keys(project.links).map((category, index) => (
                    <div key={index} className="flex flex-col">
                      <h1 className="text-sm font-bold text-center text-[#15599a]">
                        {category.toUpperCase()}
                      </h1>
                      <div className="flex flex-col items-center gap-1">
                        {project.links[category].map((obj, index2) => (
                          <a
                            className="text-xs text-[#15599a] font-bold text-center"
                            key={index2}
                            href={obj.link}
                          >
                            {obj.title} ({obj.format})
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalComercial;
