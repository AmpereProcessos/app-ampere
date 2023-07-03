import React, { useState } from "react";
import {
  fornecedores,
  oemPlans,
  reportsByPlan,
  tiposDeEstruturas,
  vendedores,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import NotificationCreationBlock from "./NotificationCreationBlock";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import OSCreationBlock from "./OSCreationBlock";
import { equipesTecnicas } from "../utils/constants";
import { useKey } from "../utils/hooks";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoDadosConcessionariaBlock from "./blocosInfoProjeto/InfoDadosConcessionariaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoArquivosBlock from "./blocosInfoProjeto/InfoArquivosBlock";
import InfoProjetoBlock from "./blocosInfoProjeto/InfoProjetoBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import SaveButton from "./utils/Buttons/SaveButton";
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
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalOeM({
  open,
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
  users,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const [infoHolder, setInfo] = useState(project);
  const [msg, setMsg] = useState("");
  const [changes, setChanges] = useState({});
  const [osInfo, setOsInfo] = useState({
    categoria: "NÃO DEFINIDO",
    servicoExecutado: "",
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: "",
    grauDeUrgencia: "NÃO DEFINIDO",
    observacoes: "",
    dataDeAbertura: new Date().toISOString(),
    agendar: false,
  });
  const [osMsg, setOsMsg] = useState({
    text: "",
    color: "text-red-500",
  });
  function handleOSCreation() {
    var arr;
    if (!credentials?.controller) {
      setOsMsg({
        text: "Usuário não autorizado para geração de OSs.",
        color: "text-red-500",
      });
    } else {
      if (osInfo.servicoExecutado.trim().length < 5) {
        setOsMsg({
          text: "Por favor, preencha o serviço a ser executado.",
          color: "text-red-500",
        });
        return;
      } else {
        if (
          infoHolder.ordensDeServico != undefined &&
          infoHolder.ordensDeServico?.length > 0
        ) {
          infoHolder.ordensDeServico.push({
            ...osInfo,
            usuarioEmissor: credentials?.name,
            index: infoHolder.ordensDeServico?.length,
            cobrancaRealizada: false,
          });
          arr = infoHolder.ordensDeServico;
        } else {
          arr = [
            {
              ...osInfo,
              usuarioEmissor: credentials?.name,
              index: 0,
              cobrancaRealizada: false,
            },
          ];
          infoHolder.ordensDeServico = arr;
        }
        axios
          .post("/api/ordensDeServico", { id: project._id, arr: arr })
          .then((res) => {
            setOsMsg({
              text: "Ordem de serviço gerada",
              color: "text-green-500",
            });
            setOsInfo({
              categoria: "NÃO DEFINIDO",
              servicoExecutado: "",
              realizarCobranca: false,
              valorCobranca: 0,
              usuarioEmissor: "",
              grauDeUrgencia: "NÃO DEFINIDO",
              observacoes: "",
              dataDeAbertura: new Date().toISOString(),
              agendar: false,
            });
            handleUpdates(project._id);
          });
      }
    }
  }
  async function handleChanges() {
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg("Alterações feitas");
      handleUpdates(project._id);
    });
  }
  console.log(changes);
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
            </div>

            <div className="flex gap-x-2 items-center">
              {msg && <p className="text-sm italic text-green-400">{msg}</p>}
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={handleChanges}
              />
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
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                PÓS-OBRA
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <SelectInput
                  label={"DIAGNÓSTICO"}
                  value={
                    infoHolder.oem?.diagnostico
                      ? infoHolder.oem?.diagnostico
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "MICRO/INVERSOR DESCONFIGURADO",
                      value: "MICRO/INVERSOR DESCONFIGURADO",
                    },
                    {
                      label: "CLIENTE SEM INTERNET",
                      value: "CLIENTE SEM INTERNET",
                    },
                    {
                      label: "TEMPO DE O&M VENCIDO",
                      value: "TEMPO DE O&M VENCIDO",
                    },
                    {
                      label: "EQUIPAMENTOS PARA GARANTIA",
                      value: "EQUIPAMENTOS PARA GARANTIA",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({ ...changes, "oem.diagnostico": value });
                    setInfo({
                      ...infoHolder,
                      oem: {
                        ...infoHolder.oem,
                        diagnostico: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Usina Ligada"}
                  editable={editor}
                  value={
                    infoHolder.conferencias.usinaLigada.data != undefined &&
                    dayjs(infoHolder.conferencias.usinaLigada.data).isValid()
                      ? new Date(infoHolder.conferencias.usinaLigada.data)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "conferencias.usinaLigada.data": isNaN(value)
                        ? new Date(value).toISOString()
                        : null,
                      "conferencias.usinaLigada.status": isNaN(value)
                        ? "REALIZADO"
                        : "NÃO REALIZADO",
                    });
                    setInfo({
                      ...infoHolder,
                      conferencias: {
                        ...infoHolder.conferencias,
                        usinaLigada: {
                          data: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                          status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
                        },
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Monitoramento feito"}
                  editable={editor}
                  value={
                    infoHolder.conferencias.monitoramentoFeito.data !=
                      undefined &&
                    dayjs(
                      infoHolder.conferencias.monitoramentoFeito.data
                    ).isValid()
                      ? new Date(
                          infoHolder.conferencias.monitoramentoFeito.data
                        )
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "conferencias.monitoramentoFeito.data": isNaN(value)
                        ? new Date(value).toISOString()
                        : null,
                      "conferencias.monitoramentoFeito.status": isNaN(value)
                        ? "REALIZADO"
                        : "NÃO REALIZADO",
                    });
                    setInfo({
                      ...infoHolder,
                      conferencias: {
                        ...infoHolder.conferencias,
                        monitoramentoFeito: {
                          data: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                          status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
                        },
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Data APP no celular"}
                  editable={editor}
                  value={
                    infoHolder.app.data != undefined &&
                    dayjs(infoHolder.app.data).isValid()
                      ? new Date(infoHolder.app.data).toISOString().slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "app.data": isNaN(value)
                        ? new Date(value).toISOString()
                        : null,
                    });
                    setInfo({
                      ...infoHolder,
                      app: {
                        ...infoHolder.app,
                        data: isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Energia Injetada"}
                  editable={editor}
                  value={
                    infoHolder.conferencias.energiaInjetada.data != undefined &&
                    dayjs(
                      infoHolder.conferencias.energiaInjetada.data
                    ).isValid()
                      ? new Date(infoHolder.conferencias.energiaInjetada.data)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "conferencias.energiaInjetada.data": isNaN(value)
                        ? new Date(value).toISOString()
                        : null,
                      "conferencias.energiaInjetada.status": isNaN(value)
                        ? "REALIZADO"
                        : "NÃO REALIZADO",
                    });
                    setInfo({
                      ...infoHolder,
                      conferencias: {
                        ...infoHolder.conferencias,
                        energiaInjetada: {
                          data: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                          status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
                        },
                      },
                    });
                  }}
                />
                <TextInput
                  label={"LOGIN NO APP"}
                  value={infoHolder.app.login ? infoHolder.app.login : ""}
                  normalCase={true}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "app.login": value,
                    });
                    setInfo({
                      ...infoHolder,
                      app: {
                        ...infoHolder.app,
                        login: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"SENHA NO APP"}
                  value={infoHolder.app.senha}
                  normalCase={true}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "app.senha": value,
                    });
                    setInfo({
                      ...infoHolder,
                      app: {
                        ...infoHolder.app,
                        senha: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                OPERAÇÃO E MANUTENÇÃO
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <div>
                  <input
                    disabled={!editor}
                    checked={infoHolder.oem?.aplicavel ? true : false}
                    onChange={(e) => {
                      setChanges({
                        ...changes,
                        "oem.aplicavel": e.target.checked,
                      });
                      setInfo({
                        ...infoHolder,
                        oem: {
                          ...infoHolder.oem,
                          aplicavel: e.target.checked,
                        },
                      });
                    }}
                    type="checkbox"
                    name="possuiOEM"
                    id="possuiOEM"
                  />
                  <label className="ml-2" htmlFor="possuiOEM">
                    POSSUI O&M?
                  </label>
                </div>
                {infoHolder.oem?.aplicavel && (
                  <NumberInput
                    label={"Duração O&M (anos)"}
                    value={
                      infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "oem.duracao": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        oem: { ...infoHolder.oem, duracao: Number(value) },
                      });
                    }}
                  />
                )}
                {infoHolder.oem?.aplicavel && (
                  <NumberInput
                    label={"QTDE de manutenções"}
                    value={
                      infoHolder.oem?.qtdeManutencoes
                        ? infoHolder.oem?.qtdeManutencoes
                        : 0
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "oem.qtdeManutencoes": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        oem: {
                          ...infoHolder.oem,
                          qtdeManutencoes: Number(value),
                        },
                      });
                    }}
                  />
                )}
                <SelectInput
                  label={"PLANO DE O&M"}
                  editable={false}
                  value={
                    infoHolder.oem?.plano
                      ? infoHolder.oem.plano
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    ...oemPlans.map((plan) => plan),
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({ ...changes, "oem.plano": value });
                    setInfo({
                      ...infoHolder,
                      oem: {
                        ...infoHolder.oem,
                        plano: value,
                      },
                    });
                  }}
                />
                {/* {infoHolder.oem?.plano
                  ? reportsByPlan[infoHolder.oem.plano].relatorios.map(
                      (relatorio, index) => (
                        <DateInput
                          key={index}
                          label={`RELATÓRIO ${index + 1}`}
                          editable={editor}
                          value={
                            infoHolder.relatorios[relatorio]?.data !=
                              undefined &&
                            infoHolder.relatorios[relatorio]?.data != "-"
                              ? new Date(infoHolder.relatorios[relatorio].data)
                                  .toISOString()
                                  .slice(0, 10)
                              : 0
                          }
                          handleChange={(value) => {
                            setChanges({
                              ...changes,
                              [`relatorios.${relatorio}.data`]: isNaN(value)
                                ? new Date(value).toISOString()
                                : null,
                              [`relatorios.${relatorio}.status`]: isNaN(value)
                                ? "REALIZADO"
                                : "NÃO REALIZADO",
                            });
                            setInfo({
                              ...infoHolder,
                              relatorios: {
                                ...infoHolder.relatorios,
                                [`${relatorio}`]: {
                                  data: isNaN(value)
                                    ? new Date(value).toISOString()
                                    : null,
                                  status: isNaN(value)
                                    ? "REALIZADO"
                                    : "NÃO REALIZADO",
                                },
                              },
                            });
                          }}
                        />
                      )
                    )
                  : false} */}
                <DateInput
                  label={"MANUTENÇÃO PREVENTIVA"}
                  editable={editor}
                  value={
                    infoHolder.manutencaoPreventiva?.data != undefined &&
                    infoHolder.manutencaoPreventiva.data != "-"
                      ? new Date(infoHolder.manutencaoPreventiva.data)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "manutencaoPreventiva.data": isNaN(value)
                        ? new Date(value).toISOString()
                        : null,
                      "manutencaoPreventiva.status": isNaN(value)
                        ? "REALIZADO"
                        : "NÃO REALIZADO",
                    });
                    setInfo({
                      ...infoHolder,
                      manutencaoPreventiva: {
                        ...infoHolder.manutencaoPreventiva,
                        data: isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                        status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
                      },
                    });
                  }}
                />
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    O&M CONCLUÍDO ?
                  </span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.oem?.oemConcluido == true ? true : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "oem.oemConcluido": e.target.checked,
                          "obra.statusDaObra": "CONCLUIDA",
                        });
                        setInfo({
                          ...infoHolder,
                          obra: {
                            ...infoHolder.obra,
                            statusDaObra: "CONCLUIDA",
                          },
                          oem: {
                            ...infoHolder.oem,
                            oemConcluido: e.target.checked,
                          },
                        });
                      }}
                      type="checkbox"
                      name="oemConcluido"
                      id="oemConcluido"
                    />
                    <label className="ml-2" htmlFor="oemConcluido">
                      {infoHolder.oem?.oemConcluido ? "SIM" : "NÃO"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                ORDENS DE SERVIÇO
              </span>
              <OSCreationBlock
                editor={editor}
                qtde={project.qtde}
                nomeDoContrato={project.nomeDoContrato}
                credentials={credentials}
                id={infoHolder._id}
                ordensDeServico={infoHolder.ordensDeServico}
                handleUpdates={() => handleUpdates(project._id)}
                categories={[
                  {
                    label: "MANUTENÇÃO PREVENTIVA",
                    value: "MANUTENÇÃO PREVENTIVA",
                  },
                  {
                    label: "MANUTENÇÃO CORRETIVA",
                    value: "MANUTENÇÃO CORRETIVA",
                  },
                  {
                    label: "OUTROS",
                    value: "OUTROS",
                  },
                  {
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]}
              />
              {infoHolder.ordensDeServico != undefined &&
                infoHolder.ordensDeServico?.length > 0 && (
                  <div className="w-full flex flex-col px-10 border-t border-gray-200 mt-2">
                    <h1 className="text-[#fead61] font-bold">
                      OSs GERADAS DO PROJETO
                    </h1>
                    {infoHolder.ordensDeServico.map((ordem, index) => (
                      <div
                        key={index}
                        className="flex mt-1 items-center justify-around"
                      >
                        <div className="flex flex-col items-center">
                          <p className="uppercase text-gray-500">CATEGORIA</p>
                          <p className="text-xs uppercase">{ordem.categoria}</p>
                        </div>
                        <div className="hidden lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            SERVIÇO PARA EXECUÇÃO
                          </p>
                          <p className="text-xs uppercase">
                            {ordem.servicoExecutado}
                          </p>
                        </div>
                        <div className="hidden lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            REALIZAR COBRANÇA?
                          </p>
                          <p className="text-xs uppercase">
                            {ordem.realizarCobranca ? "SIM" : "NÃO"}
                          </p>
                        </div>
                        <div className="hidden lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            VALOR DA COBRANÇA
                          </p>
                          <p className="text-xs uppercase">
                            R$ {ordem.valorCobranca}
                          </p>
                        </div>
                        <div className="hiddn lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            EMISSOR DA OS
                          </p>
                          <p className="text-xs uppercase">
                            {ordem.usuarioEmissor}
                          </p>
                        </div>
                        <div className="hidden lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            DATA DE ABERTURA
                          </p>
                          <p className="text-xs uppercase">
                            {new Date(
                              ordem.dataDeAbertura
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="hidden lg:flex flex-col items-center">
                          <p className="uppercase text-gray-500">
                            GRAU DE URGÊNCIA
                          </p>
                          <p className="text-xs uppercase">
                            {ordem.grauDeUrgencia}
                          </p>
                        </div>
                        <Link
                          href={`/ordemDeServico/pdf/${project._id}?index=${index}`}
                        >
                          <button className="p-2 bg-[#fead61] font-bold rounded">
                            VER OS
                          </button>
                        </Link>
                        {ordem.categoria == "MANUTENÇÃO PREVENTIVA" && (
                          <Link
                            href={`/oem/pdfTermo/${project._id}?index=${index}`}
                          >
                            <button className="p-2 bg-[#fead61] font-bold rounded">
                              VER TERMO
                            </button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <InfoVisitaTecnicaBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {!["BOMBA SOLAR", "OPERAÇÃO E MANUTENÇÃO"].includes(
              project.tipoDeServico
            ) ? (
              <InfoPadraoBlock
                comercialEdition={false}
                technicalEdition={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={false}
              />
            ) : null}

            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={false}
                technicalEdition={false}
                infoHolder={infoHolder}
                project={project}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={false}
              />
            )}
            {!["MONTAGEM E DESMONTAGEM", "OPERAÇÃO E MANUTENÇÃO"].includes(
              project.tipoDeServico
            ) ? (
              <InfoCompraBlock
                editor={false}
                infoHolder={infoHolder}
                project={project}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={true}
                showMonetaryValues={false}
              />
            ) : null}
            {!["BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(
              infoHolder.tipoDeServico
            ) && (
              <InfoDadosConcessionariaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoSistemaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
            )}
            {![
              "OPERAÇÃO E MANUTENÇÃO",
              "BOMBA SOLAR",
              "SISTEMA FOTOVOLTAICO (OFF GRID)",
            ].includes(project.tipoDeServico) ? (
              <InfoProjetoBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                handleUpdates={handleUpdates}
                project={project}
              />
            ) : null}

            {project.tipoDeServico != "OPERAÇÃO E MANUTENÇÃO" ? (
              <InfoObrasBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
            ) : null}

            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: "DOCUMENTOS", value: "links.documentos" },
                { label: "PROJETOS", value: "links.projetos" },
                { label: "OBRAS", value: "links.obras" },
                {
                  label: "MANUTENÇÃO PREVENTIVA",
                  value: "links.manutencaoPreventiva",
                },
                {
                  label: "MANUTENÇÃO CORRETIVA",
                  value: "links.manutencaoCorretiva",
                },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalOeM;
