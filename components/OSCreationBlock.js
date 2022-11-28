import React, { useState } from "react";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import axios from "axios";
import { equipesTecnicas } from "../utils/constants";
function OSCreationBlock({
  editor,
  credentials,
  handleUpdates,
  ordensDeServico,
  id,
  categories,
  nomeDoContrato,
  qtde,
}) {
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
  const [agendamentoInfo, setAgendamentoInfo] = useState({
    inicio: null,
    fim: null,
    msg: "",
  });
  const [osMsg, setOsMsg] = useState({
    text: "",
    color: "",
  });
  async function handleOSCreation() {
    var arr;
    if (!credentials.controller) {
      setOsMsg({
        text: "Usuário não autorizado para geração de OSs.",
        color: "text-red-500",
      });
    } else {
      if (validateFields() == true) {
        if (ordensDeServico != undefined && ordensDeServico?.length > 0) {
          ordensDeServico.push({
            ...osInfo,
            usuarioEmissor: credentials.nome,
            index: ordensDeServico?.length,
            cobrancaRealizada: false,
          });
          arr = ordensDeServico;
        } else {
          arr = [
            {
              ...osInfo,
              usuarioEmissor: credentials.nome,
              index: 0,
              cobrancaRealizada: false,
            },
          ];
          ordensDeServico = arr;
        }
        if (osInfo.realizarCobranca) {
          await axios.post("/api/calls/adm/mainData", {
            codigoProjeto: qtde,
            nomeCliente: nomeDoContrato,
            usuarioEmissor: credentials.nome,
            demanda: "COBRANÇA",
            valor: osInfo.valorCobranca,
            servico: `${osInfo.categoria} - ${osInfo.servicoExecutado}`,
          });
        }
        if (osInfo.pagamentoTerceiro) {
          await axios.post("/api/calls/adm/mainData", {
            codigoProjeto: qtde,
            nomeCliente: nomeDoContrato,
            usuarioEmissor: credentials.nome,
            demanda: "PAGAMENTO",
            nomeRecebedor: osInfo.nomeTerceiro,
            valor: osInfo.valorPagamentoTerceiro,
            servico: `${osInfo.categoria} - ${osInfo.servicoExecutado}`,
          });
        }
        axios.post("/api/ordensDeServico", { id: id, arr: arr }).then((res) => {
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
          handleUpdates({
            ...osInfo,
            usuarioEmissor: credentials.nome,
            index: ordensDeServico?.length,
            cobrancaRealizada: false,
          });
        });
      }
    }
  }
  function validateFields() {
    if (osInfo.servicoExecutado.trim().length < 3) {
      setOsMsg({
        text: "Por favor, preencha o serviço a ser executado.",
        color: "text-red-500",
      });
      return false;
    }
    if (osInfo.categoria == "NÃO DEFINIDO") {
      setOsMsg({
        text: "Por favor, preencha a categoria da OS",
        color: "text-red-500",
      });
      return false;
    }
    if (osInfo.realizarCobranca == true && osInfo.valorCobranca == 0) {
      setOsMsg({
        text: "Por favor, preencha o valor da cobrança a ser feita",
        color: "text-red-500",
      });
      return false;
    }
    if (osInfo.pagamentoTerceiro && osInfo.valorPagamentoTerceiro == 0) {
      setOsMsg({
        text: "Por favor, preencha o valor a ser pago ao terceiro",
        color: "text-red-500",
      });
      return false;
    }
    if (
      osInfo.pagamentoTerceiro &&
      (osInfo.nomeTerceiro == undefined ||
        osInfo.nomeTerceiro.trim().length < 3)
    ) {
      setOsMsg({
        text: "Por favor, preencha o nome do terceiro",
        color: "text-red-500",
      });
      return false;
    }
    if (
      osInfo.agendar &&
      (osInfo.inicioServico == undefined || osInfo.fimServico == undefined)
    ) {
      setOsMsg({
        text: "Por favor, preencha o período de realização do serviço para agendamento",
        color: "text-red-500",
      });
      return false;
    }
    if (
      osInfo.agendar &&
      (osInfo.equipe == undefined || osInfo.equipe == "NÃO DEFINIDO")
    ) {
      setOsMsg({
        text: "Por favor, preencha a equipe responsável pelo serviço",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  console.log(ordensDeServico);
  return (
    <div className="flex flex-col">
      {" "}
      <div className="flex gap-2 justify-center flex-wrap">
        <SelectInput
          label={"CATEGORIA DA OS"}
          value={osInfo.categoria}
          editable={editor}
          options={
            categories
              ? categories
              : [
                  { label: "PADRÃO", value: "PADRÃO" },
                  { label: "ESTRUTURA", value: "ESTRUTURA" },
                  { label: "MONTAGEM", value: "MONTAGEM" },
                  {
                    label: "MANUTENÇÃO PREVENTIVA",
                    value: "MANUTENÇÃO PREVENTIVA",
                  },
                  {
                    label: "MANUTENÇÃO CORRETIVA",
                    value: "MANUTENÇÃO CORRETIVA",
                  },
                  {
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]
          }
          handleChange={(value) =>
            setOsInfo({
              ...osInfo,
              categoria: value,
              servicoExecutado: "",
              realizarCobranca: false,
              valorCobranca: 0,
              usuarioEmissor: "",
              grauDeUrgencia: "NÃO DEFINIDO",
              observacoes: "",
            })
          }
        />
        <TextInput
          label={"Serviço a ser executado"}
          value={osInfo.servicoExecutado}
          editable={editor}
          handleChange={(value) =>
            setOsInfo({
              ...osInfo,
              servicoExecutado: value.toUpperCase(),
            })
          }
        />
        <div className="flex gap-2 justify-center flex-wrap mt-4">
          <div>
            <input
              disabled={!editor}
              checked={osInfo.realizarCobranca}
              onChange={(e) =>
                setOsInfo({
                  ...osInfo,
                  realizarCobranca: e.target.checked,
                })
              }
              type="checkbox"
              name="realizarCobranca"
              id="realizarCobranca"
            />
            <label className="ml-2" htmlFor="realizarCobranca">
              REALIZAR COBRANÇA ?
            </label>
          </div>
          <NumberInput
            label={"VALOR DO SERVIÇO A COBRAR"}
            value={osInfo.valorCobranca}
            editable={editor}
            handleChange={(value) =>
              setOsInfo({ ...osInfo, valorCobranca: Number(value) })
            }
          />
        </div>
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            PAGAMENTO DE TERCEIRO
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={osInfo.pagamentoTerceiro}
              onChange={(e) => {
                setOsInfo({
                  ...osInfo,
                  pagamentoTerceiro: e.target.checked,
                });
              }}
              type="checkbox"
              name="pagamentoTerceiro"
              id="pagamentoTerceiro"
            />
            <label className="ml-2" htmlFor="pagamentoTerceiro">
              APLICÁVEL?
            </label>
          </div>
        </div>
        {osInfo.pagamentoTerceiro && (
          <>
            <NumberInput
              label={"VALOR A PAGAR AO TERCEIRO?"}
              editable={editor}
              value={osInfo.valorPagamentoTerceiro}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  valorPagamentoTerceiro: Number(value),
                })
              }
            />
            <TextInput
              label={"NOME DO TERCEIRO"}
              editable={editor}
              value={osInfo.nomeTerceiro}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  nomeTerceiro: value.toUpperCase(),
                })
              }
            />
          </>
        )}
        <SelectInput
          label={"GRAU DE URGÊNCIA"}
          value={osInfo.grauDeUrgencia}
          editable={editor}
          options={[
            { label: "EMERGÊNCIA", value: "EMERGÊNCIA" },
            { label: "URGENTE", value: "URGENTE" },
            { label: "POUCO URGENTE", value: "POUCO URGENTE" },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) =>
            setOsInfo({ ...osInfo, grauDeUrgencia: value })
          }
        />
        <DateInput
          label={"DATA DE ABERTURA"}
          editable={editor}
          value={new Date(osInfo.dataDeAbertura).toISOString().slice(0, 10)}
          handleChange={(value) =>
            setOsInfo({
              ...osInfo,
              dataDeAbertura: new Date(value).toISOString(),
            })
          }
        />
        {osInfo.categoria == "MANUTENÇÃO PREVENTIVA" && (
          <>
            <div className="flex pl-2 items-center">
              <input
                disabled={!editor}
                checked={osInfo.configurar ? true : false}
                onChange={(e) =>
                  setOsInfo({
                    ...osInfo,
                    configurar: e.target.checked,
                  })
                }
                type="checkbox"
                name="configurar"
                id="configurar"
              />
              <label className="ml-2" htmlFor="configurar">
                CONFIGURAR
              </label>
            </div>
            <TextInput
              label={"Modelo Micro/inversor"}
              editable={editor}
              value={osInfo.inversor ? osInfo.inversor : ""}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  inversor: value.toUpperCase(),
                })
              }
            />
            <TextInput
              label={"SENHA DO WIFI"}
              editable={editor}
              normalCase={true}
              value={osInfo.senhaDoWifi ? osInfo.senhaDoWifi : ""}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  senhaDoWifi: value,
                })
              }
            />
            <TextInput
              label={"PONTO DE AGUA"}
              editable={editor}
              normalCase={true}
              value={osInfo.pontoDeAgua ? osInfo.pontoDeAgua : ""}
              handleChange={(value) =>
                setOsInfo({ ...osInfo, pontoDeAgua: value })
              }
            />
            <div className="flex pl-2 items-center">
              <input
                disabled={!editor}
                checked={osInfo.trafo ? true : false}
                onChange={(e) =>
                  setOsInfo({
                    ...osInfo,
                    trafo: e.target.checked,
                  })
                }
                type="checkbox"
                name="trafo"
                id="trafo"
              />
              <label className="ml-2" htmlFor="trafo">
                TRAFO
              </label>
            </div>
          </>
        )}
      </div>
      {osInfo.categoria != "MONTAGEM" && osInfo.categoria != "NÃO DEFINIDO" && (
        <div className="flex flex-col w-[450px] self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            OBSERVAÇÕES DA OS
          </span>
          <textarea
            readOnly={!editor}
            value={osInfo.observacoes}
            onChange={(e) =>
              setOsInfo({ ...osInfo, observacoes: e.target.value })
            }
            placeholder="Observações da OS..."
            className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
          />
        </div>
      )}
      <div className="flex gap-2 justify-center flex-wrap mt-4">
        <div>
          <input
            disabled={!editor}
            checked={osInfo.agendar}
            onChange={(e) =>
              setOsInfo({
                ...osInfo,
                agendar: e.target.checked,
              })
            }
            type="checkbox"
            name="agendar"
            id="agendar"
          />
          <label className="ml-2" htmlFor="agendar">
            AGENDAR SERVIÇO?
          </label>
        </div>
        {osInfo.agendar && (
          <>
            <SelectInput
              label={"EQUIPE"}
              editable={true}
              value={osInfo.equipe ? osInfo.equipe : "NÃO DEFINIDO"}
              options={equipesTecnicas.map((equipe) => equipe)}
              handleChange={(value) => setOsInfo({ ...osInfo, equipe: value })}
            />
            <DateInput
              label={"DATA DE INÍCIO"}
              editable={true}
              value={
                osInfo.inicioServico
                  ? new Date(osInfo.inicioServico).toISOString().slice(0, 10)
                  : null
              }
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  inicioServico: new Date(value).toISOString(),
                })
              }
            />
            <DateInput
              label={"DATA DE FIM"}
              editable={true}
              value={
                osInfo.fimServico
                  ? new Date(osInfo.fimServico).toISOString().slice(0, 10)
                  : null
              }
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  fimServico: new Date(value).toISOString(),
                })
              }
            />
          </>
        )}
      </div>
      {osMsg.text.length > 0 && (
        <p className={`text-center ${osMsg.color} italic`}>{osMsg.text}</p>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleOSCreation}
          className="p-2 bg-[#fead61] font-bold rounded"
        >
          GERAR OS DE OBRA
        </button>
      </div>
    </div>
  );
}

export default OSCreationBlock;
