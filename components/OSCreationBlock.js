import React, { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import DateFloatingInput from "./DateFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import axios from "axios";
import { equipesTecnicas } from "../utils/constants";
import { useSession } from "next-auth/react";
function OSCreationBlock({
  editor,
  handleUpdates,
  ordensDeServico,
  id,
  categories,
  nomeDoContrato,
  qtde,
}) {
  const { data: session } = useSession();

  const [osInfo, setOsInfo] = useState({
    categoria: "NÃO DEFINIDO",
    servicoExecutado: "",
    realizarCobranca: false,
    valorCobranca: null,
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
  console.log(session.user);
  async function handleOSCreation() {
    var arr;
    if (!session.user?.controller) {
      setOsMsg({
        text: "Usuário não autorizado para geração de OSs.",
        color: "text-red-500",
      });
    } else {
      if (validateFields() == true) {
        if (ordensDeServico != undefined && ordensDeServico?.length > 0) {
          ordensDeServico.push({
            ...osInfo,
            usuarioEmissor: session.user?.name,
            index: ordensDeServico?.length,
            cobrancaRealizada: false,
          });
          arr = ordensDeServico;
        } else {
          arr = [
            {
              ...osInfo,
              usuarioEmissor: session.user?.name,
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
            usuarioEmissor: session.user?.name,
            demanda: "COBRANÇA",
            valor: osInfo.valorCobranca,
            servico: `${osInfo.categoria} - ${osInfo.servicoExecutado}`,
          });
        }
        if (osInfo.pagamentoTerceiro) {
          await axios.post("/api/calls/adm/mainData", {
            codigoProjeto: qtde,
            nomeCliente: nomeDoContrato,
            usuarioEmissor: session.user?.name,
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
          // handleUpdates({
          //   ...osInfo,
          //   usuarioEmissor: session.user?.name,
          //   index: ordensDeServico?.length,
          //   cobrancaRealizada: false,
          // });
          handleUpdates(id);
        });
      }
    }
  }
  function validateFields() {
    if (osInfo.categoria == "NÃO DEFINIDO") {
      setOsMsg({
        text: "Por favor, preencha a categoria da OS",
        color: "text-red-500",
      });
      return false;
    }
    if (osInfo.servicoExecutado.trim().length < 3) {
      setOsMsg({
        text: "Por favor, preencha o serviço a ser executado.",
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
  return (
    <div className="flex flex-col">
      <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 items-center px-2">
        <SelectFloatingInput
          label={"CATEGORIA DA OS"}
          value={osInfo.categoria}
          editable={editor}
          width={"100%"}
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
                    label: "OUTROS",
                    value: "OUTROS",
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
        <TextFloatingInput
          label={"SERVIÇO A SER EXECUTADO"}
          value={osInfo.servicoExecutado}
          editable={editor}
          width={"100%"}
          handleChange={(value) =>
            setOsInfo({
              ...osInfo,
              servicoExecutado: value.toUpperCase(),
            })
          }
        />
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2">
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            REALIZAR COBRANÇA ?
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={osInfo.realizarCobranca}
              onChange={(e) => {
                setOsInfo({
                  ...osInfo,
                  realizarCobranca: e.target.checked,
                  valorCobranca: e.target.checked ? osInfo.valorCobranca : 0,
                });
              }}
              type="checkbox"
              name="realizarCobranca"
              id="realizarCobranca"
            />
            <label className="ml-2" htmlFor="realizarCobranca">
              {osInfo.realizarCobranca ? "SIM" : "NÃO"}
            </label>
          </div>
        </div>
        {osInfo.realizarCobranca ? (
          <>
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                VALOR AINDA NÃO DEFINIDO ?
              </span>
              <div className="flex">
                <input
                  disabled={!editor}
                  checked={osInfo.valorCobranca == "NÃO DEFINIDO"}
                  onChange={(e) =>
                    setOsInfo({
                      ...osInfo,
                      valorCobranca: e.target.checked ? "NÃO DEFINIDO" : 0,
                    })
                  }
                  type="checkbox"
                  name="valorCobranca"
                  id="valorCobranca"
                />
                <label className="ml-2" htmlFor="valorCobranca">
                  {osInfo.valorCobranca ? "SIM" : "NÃO"}
                </label>
              </div>
            </div>
            {osInfo.valorCobranca != "NÃO DEFINIDO" && (
              <NumberFloatingInput
                label={"VALOR DO SERVIÇO A COBRAR"}
                value={osInfo.valorCobranca}
                editable={editor}
                handleChange={(value) =>
                  setOsInfo({ ...osInfo, valorCobranca: Number(value) })
                }
                marginBottom={"0px"}
              />
            )}
          </>
        ) : null}
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            PAGAMENTO DE TERCEIRO NECESSÁRIO ?
          </span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={osInfo.pagamentoTerceiro}
              onChange={(e) => {
                setOsInfo({
                  ...osInfo,
                  pagamentoTerceiro: e.target.checked,
                  valorCobranca: e.target.checked ? osInfo.valorCobranca : 0,
                });
              }}
              type="checkbox"
              name="pagamentoTerceiro"
              id="pagamentoTerceiro"
            />
            <label className="ml-2" htmlFor="pagamentoTerceiro">
              {osInfo.pagamentoTerceiro ? "SIM" : "NÃO"}
            </label>
          </div>
        </div>
        {osInfo.pagamentoTerceiro && (
          <>
            <NumberFloatingInput
              label={"VALOR A PAGAR AO TERCEIRO?"}
              editable={editor}
              value={osInfo.valorPagamentoTerceiro}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  valorPagamentoTerceiro: Number(value),
                })
              }
              marginBottom={"0px"}
            />
            <TextFloatingInput
              label={"NOME DO TERCEIRO"}
              editable={editor}
              value={osInfo.nomeTerceiro}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  nomeTerceiro: value.toUpperCase(),
                })
              }
              marginBottom={"0px"}
            />
          </>
        )}
      </div>
      <div className="flex gap-2 justify-center flex-wrap items-center mt-4">
        <SelectFloatingInput
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
        <DateFloatingInput
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
      </div>
      {osInfo.categoria == "MANUTENÇÃO PREVENTIVA" && (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-2 px-2">
            <TextFloatingInput
              label={"MODELO DO MICRO/INVERSOR"}
              editable={editor}
              width={"100%"}
              value={osInfo.inversor ? osInfo.inversor : ""}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  inversor: value.toUpperCase(),
                })
              }
            />
            <TextFloatingInput
              label={"SENHA DO WIFI"}
              editable={editor}
              width={"100%"}
              normalCase={true}
              value={osInfo.senhaDoWifi ? osInfo.senhaDoWifi : ""}
              handleChange={(value) =>
                setOsInfo({
                  ...osInfo,
                  senhaDoWifi: value,
                })
              }
            />
            <TextFloatingInput
              label={"PONTO DE AGUA"}
              editable={editor}
              width={"100%"}
              normalCase={true}
              value={osInfo.pontoDeAgua ? osInfo.pontoDeAgua : ""}
              handleChange={(value) =>
                setOsInfo({ ...osInfo, pontoDeAgua: value })
              }
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                CONFIGURAÇÃO NECESSÁRIA ?
              </span>
              <div className="flex">
                <input
                  disabled={!editor}
                  checked={osInfo.configurar}
                  onChange={(e) => {
                    setOsInfo({
                      ...osInfo,
                      configurar: e.target.checked,
                      valorCobranca: e.target.checked
                        ? osInfo.valorCobranca
                        : 0,
                    });
                  }}
                  type="checkbox"
                  name="configurar"
                  id="configurar"
                />
                <label className="ml-2" htmlFor="configurar">
                  {osInfo.configurar ? "SIM" : "NÃO"}
                </label>
              </div>
            </div>
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                POSSUI TRAFO ?
              </span>
              <div className="flex">
                <input
                  disabled={!editor}
                  checked={osInfo.trafo}
                  onChange={(e) => {
                    setOsInfo({
                      ...osInfo,
                      trafo: e.target.checked,
                      valorCobranca: e.target.checked
                        ? osInfo.valorCobranca
                        : 0,
                    });
                  }}
                  type="checkbox"
                  name="trafo"
                  id="trafo"
                />
                <label className="ml-2" htmlFor="trafo">
                  {osInfo.trafo ? "SIM" : "NÃO"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="flex items-center justify-center w-full">
        <SelectFloatingInput
          label={"EQUIPE"}
          editable={true}
          width={"450px"}
          value={osInfo.equipe ? osInfo.equipe : "NÃO DEFINIDO"}
          options={equipesTecnicas.map((equipe) => equipe)}
          handleChange={(value) => setOsInfo({ ...osInfo, equipe: value })}
        />
      </div>

      {/* <div className="flex gap-2 justify-center flex-wrap mt-4">
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
            <DateFloatingInput
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
            <DateFloatingInput
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
      </div> */}
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
