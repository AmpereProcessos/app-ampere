import dayjs from "dayjs";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import TextFloatingInput from "./TextFloatingInput";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "40%",
  maxWidth: "97%",
  height: "87%",
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
function ModalBancoOS({ info, clientName, projectID, setModalIsOpen, index }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [infoHolder, setInfo] = useState(info);
  const [changes, setChanges] = useState({});
  console.log("HOLDER", infoHolder);
  console.log("CHANGES", changes);
  async function handleChanges() {
    let { data } = await axios
      .post(`/api/projects/update/${projectID}`, changes)
      .catch((err) => alert(err));
    if (data) {
      setMsg({ text: "Alterações feitas!", color: "text-green-500" });
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2500);
    }
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">{clientName}</h1>
            </div>
            <button>
              <VscChromeClose
                onClick={() => setModalIsOpen(false)}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex py-2 pr-3 flex-col gap-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">DATA DE ABERTURA</p>
              <p className="grow text-gray-500 font-bold text-center">
                {dayjs(infoHolder.dataDeAbertura)
                  .add(4, "hours")
                  .format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">CATEGORIA</p>
              <select
                value={infoHolder.categoria}
                onChange={(e) => {
                  setInfo({ ...infoHolder, categoria: e.target.value });
                  setChanges({
                    ...changes,
                    [`ordensDeServico.${index}.categoria`]: e.target.value,
                  });
                }}
                className={"h-full grow text-center outline-none"}
              >
                <option value={"PADRÃO"}>PADRÃO</option>
                <option value={"ESTRUTURA"}>ESTRUTURA</option>
                <option value={"MONTAGEM"}>MONTAGEM</option>
                <option value={"MANUTENÇÃO PREVENTIVA"}>
                  MANUTENÇÃO PREVENTIVA
                </option>
                <option value={"MANUTENÇÃO CORRETIVA"}>
                  MANUTENÇÃO CORRETIVA
                </option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">SERVIÇO EXECUTADO</p>
              <input
                type={"text"}
                className={"h-full grow text-center outline-none"}
                value={infoHolder.servicoExecutado}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    servicoExecutado: e.target.value.toUpperCase(),
                  });
                  setChanges({
                    ...changes,
                    [`ordensDeServico.${index}.servicoExecutado`]:
                      e.target.value.toUpperCase(),
                  });
                }}
              />
            </div>
            <div className="flex flex-col py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold mb-2">OBSERVAÇÕES</p>
              <textarea
                value={infoHolder.observacoes}
                onChange={(e) => {
                  setInfo({ ...infoHolder, observacoes: e.target.value });
                  setChanges({
                    ...changes,
                    [`ordensDeServico.${index}.observacoes`]: e.target.value,
                  });
                }}
                className="outline-none resize-none h-[80px] text-center text-xs border border-gray-300 w-full p-2"
              />
            </div>
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">REALIZAR COBRANÇA</p>
              <div className="grow h-full flex items-center justify-center">
                <input
                  type="checkbox"
                  name="realizarCobranca"
                  id="realizarCobranca"
                  checked={infoHolder.realizarCobranca}
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      realizarCobranca: e.target.checked,
                    });
                    setChanges({
                      ...changes,
                      [`ordensDeServico.${index}.realizarCobranca`]:
                        e.target.checked,
                    });
                  }}
                />
                <label className="ml-2" htmlFor="realizarCobranca">
                  {infoHolder.realizarCobranca ? "SIM" : "NÃO"}
                </label>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">
                VALOR DA COBRANÇA
                {infoHolder.valorCobranca == "NÃO DEFINIDO"
                  ? ` (${infoHolder.valorCobranca})`
                  : ""}
              </p>
              <input
                type={"number"}
                className={"h-full grow text-center outline-none"}
                value={
                  infoHolder.valorCobranca != "NÃO DEFINIDO"
                    ? infoHolder.valorCobranca
                    : null
                }
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    valorCobranca: Number(e.target.value),
                  });
                  setChanges({
                    ...changes,
                    [`ordensDeServico.${index}.valorCobranca`]: Number(
                      e.target.value
                    ),
                  });
                }}
              />
            </div>
            <div className="flex flex-col lg:flex-row py-2 items-center justify-center border-y border-[#15599a] w-full">
              <p className="text-gray-800 font-bold">PAGAMENTO DE TERCEIRO ?</p>
              <div className="grow h-full flex items-center justify-center">
                <input
                  type="checkbox"
                  name="pagamentoTerceiro"
                  id="pagamentoTerceiro"
                  checked={infoHolder.pagamentoTerceiro}
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      pagamentoTerceiro: e.target.checked,
                    });
                    setChanges({
                      ...changes,
                      [`ordensDeServico.${index}.pagamentoTerceiro`]:
                        e.target.checked,
                    });
                  }}
                />
                <label className="ml-2" htmlFor="pagamentoTerceiro">
                  {infoHolder.pagamentoTerceiro ? "SIM" : "NÃO"}
                </label>
              </div>
            </div>
            {infoHolder.pagamentoTerceiro && (
              <>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">
                    VALOR DO PAGAMENTO
                    {infoHolder.valorPagamentoTerceiro == "NÃO DEFINIDO"
                      ? ` (${infoHolder.valorPagamentoTerceiro})`
                      : ""}
                  </p>
                  <input
                    type={"number"}
                    className={"h-full grow text-center outline-none"}
                    value={
                      infoHolder.valorPagamentoTerceiro != "NÃO DEFINIDO"
                        ? infoHolder.valorPagamentoTerceiro
                        : null
                    }
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        valorPagamentoTerceiro: Number(e.target.value),
                      });
                      setChanges({
                        ...changes,
                        [`ordensDeServico.${index}.valorPagamentoTerceiro`]:
                          Number(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">NOME DO TERCEIRO</p>
                  <input
                    type={"text"}
                    className={"h-full grow text-center outline-none"}
                    value={infoHolder.nomeTerceiro}
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        nomeTerceiro: e.target.value.toUpperCase(),
                      });
                      setChanges({
                        ...changes,
                        [`ordensDeServico.${index}.nomeTerceiro`]:
                          e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
              </>
            )}
            {infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" && (
              <>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">
                    REALIZAR CONFIGURAÇÃO
                  </p>
                  <div className="grow h-full flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="configurar"
                      id="configurar"
                      checked={infoHolder.configurar}
                      onChange={(e) => {
                        setInfo({
                          ...infoHolder,
                          configurar: e.target.checked,
                        });
                        setChanges({
                          ...changes,
                          [`ordensDeServico.${index}.configurar`]:
                            e.target.checked,
                        });
                      }}
                    />
                    <label className="ml-2" htmlFor="configurar">
                      {infoHolder.configurar ? "SIM" : "NÃO"}
                    </label>
                  </div>
                </div>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">NOME DO TERCEIRO</p>
                  <input
                    type={"text"}
                    className={"h-full grow text-center outline-none"}
                    value={infoHolder.inversor}
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        inversor: e.target.value.toUpperCase(),
                      });
                      setChanges({
                        ...changes,
                        [`ordensDeServico.${index}.inversor`]:
                          e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">SENHA DO WI-FI</p>
                  <input
                    type={"text"}
                    className={"h-full grow text-center outline-none"}
                    value={infoHolder.senhaDoWifi}
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        senhaDoWifi: e.target.value.toUpperCase(),
                      });
                      setChanges({
                        ...changes,
                        [`ordensDeServico.${index}.senhaDoWifi`]:
                          e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">PONTO DE ÁGUA</p>
                  <input
                    type={"text"}
                    className={"h-full grow text-center outline-none"}
                    value={infoHolder.pontoDeAgua}
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        pontoDeAgua: e.target.value.toUpperCase(),
                      });
                      setChanges({
                        ...changes,
                        [`ordensDeServico.${index}.pontoDeAgua`]:
                          e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
                <div className="flex py-2 items-center justify-center border-y border-[#15599a] w-full">
                  <p className="text-gray-800 font-bold">POSSUI TRAFO?</p>
                  <div className="grow h-full flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="configurar"
                      id="configurar"
                      checked={infoHolder.trafo}
                      onChange={(e) => {
                        setInfo({
                          ...infoHolder,
                          trafo: e.target.checked,
                        });
                        setChanges({
                          ...changes,
                          [`ordensDeServico.${index}.trafo`]: e.target.checked,
                        });
                      }}
                    />
                    <label className="ml-2" htmlFor="trafo">
                      {infoHolder.trafo ? "SIM" : "NÃO"}
                    </label>
                  </div>
                </div>
              </>
            )}
            {msg.text && (
              <p className={`text-center italic py-2 ${msg.color}`}>
                {msg.text}
              </p>
            )}
            <div className="flex items-center justify-center mt-2">
              <SaveButton
                text={"SALVAR"}
                icon={<FaSave />}
                handleClick={handleChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalBancoOS;
