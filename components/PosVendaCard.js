import React, { useState } from "react";
import NumberInput from "../components/NumberInput";
import axios from "axios";
function PosVendaCard({ project, getUpdates }) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
  }
  function handleChanges(mudancas) {
    axios.post(`/api/projects/update/${project._id}`, mudancas).then((res) => {
      getUpdates();
    });
  }
  return (
    <div className="w-full border border-gray-200 p-3 hover:bg-blue-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <p className="text-gray-700 font-bold">{infoHolder.nomeDoContrato}</p>
        <div className="flex items-center flex-wrap grow justify-between px-6">
          <div>
            <span className="text-xs">TELEFONE</span>
            <p className="text-gray-600">
              {infoHolder.telefone ? infoHolder.telefone : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs">VENDEDOR</span>
            <p className="text-gray-600">
              {infoHolder.vendedor?.nome ? infoHolder.vendedor?.nome : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs">STATUS DO PARECER</span>
            <p className="text-gray-600">
              {infoHolder.parecer?.statusDoParecerDeAcesso
                ? infoHolder.parecer?.statusDoParecerDeAcesso
                : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs">STATUS DA COMPRA</span>
            <p className="text-center text-gray-600">
              {infoHolder.compra?.statusLiberacao
                ? infoHolder.compra?.statusLiberacao
                : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs">PREV. ENTREGA</span>
            <p className="text-gray-600 text-center">
              {infoHolder.compra?.previsaoEntrega
                ? new Date(
                    infoHolder.compra.previsaoEntrega
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs">PREV. OBRA</span>
            <p className="text-gray-600 text-center">
              {infoHolder.obra?.entrada
                ? new Date(infoHolder.obra.entrada).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
        <p className="text-[#15599a]">#{infoHolder.qtde}</p>
      </div>
      <div className="mt-1">
        <h1 className="text-[#fead61] font-bold">JORNADA</h1>
        <div className="flex">
          <div className="flex items-center flex-col gap-y-2 px-2 border-r border-gray-200">
            {infoHolder.jornada?.dataUltimoContato ? (
              getDateDiff(
                new Date(),
                new Date(infoHolder.jornada?.dataUltimoContato)
              ) > 7 ? (
                <button
                  onClick={() => {
                    handleChanges({
                      jornada: {
                        ...infoHolder.jornada,
                        dataUltimoContato: new Date().toISOString(),
                      },
                    });
                    setInfo({
                      ...infoHolder,
                      jornada: {
                        ...infoHolder.jornada,
                        dataUltimoContato: new Date().toISOString(),
                      },
                    });
                  }}
                  className="font-bold bg-[#15599a] w-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
                >
                  CONTATO REALIZADO?
                </button>
              ) : (
                <p className="text-gray-600 text-center">
                  {infoHolder.jornada?.dataUltimoContato != undefined
                    ? new Date(
                        infoHolder.jornada.dataUltimoContato
                      ).toLocaleDateString()
                    : "-"}
                </p>
              )
            ) : (
              <button
                onClick={() => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      dataUltimoContato: new Date().toISOString(),
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      dataUltimoContato: new Date().toISOString(),
                    },
                  });
                }}
                className="font-bold bg-[#15599a] w-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded "
              >
                CONTATO REALIZADO?
              </button>
            )}
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                NOTA NPS
              </span>
              <div className="flex items-center justify-center">
                <input
                  className="text-xs w-fit text-center uppercase text-gray-600 outline-none"
                  type="number"
                  min={0}
                  step={1}
                  value={infoHolder.nps ? infoHolder.nps : 0}
                  onChange={(e) => {
                    handleChanges({
                      jornada: {
                        ...infoHolder.jornada,
                        dataNps: new Date().toISOString(),
                      },
                      nps: Math.ceil(e.target.value),
                    });
                    setInfo({ ...infoHolder, nps: Math.ceil(e.target.value) });
                  }}
                />
              </div>
              <div className="w-fit mt-1">
                <input
                  checked={infoHolder.jornada?.jornadaConcluida ? true : false}
                  onChange={(e) => {
                    handleChanges({
                      jornada: {
                        ...infoHolder.jornada,
                        jornadaConcluida: e.target.checked,
                      },
                    });
                    setInfo({
                      ...infoHolder,
                      jornada: {
                        ...infoHolder.jornada,
                        jornadaConcluida: e.target.checked,
                      },
                    });
                  }}
                  type="checkbox"
                  name="boasVindas"
                  id="boasVindas"
                />
                <label className="ml-2" htmlFor="boasVindas">
                  JORNADA CONCLUIDA
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-around w-full">
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.boasVindas ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      boasVindas: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      boasVindas: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="boasVindas"
                id="boasVindas"
              />
              <label className="ml-2" htmlFor="boasVindas">
                BOAS VINDAS
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.assDocumentacoes ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      assDocumentacoes: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      assDocumentacoes: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="assDocumentacoes"
                id="assDocumentacoes"
              />
              <label className="ml-2" htmlFor="assDocumentacoes">
                ASSINATURA DAS DOCUMENTAÇÕES
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.compraDoKit ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      compraDoKit: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      compraDoKit: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="compraDoKit"
                id="compraDoKit"
              />
              <label className="ml-2" htmlFor="compraDoKit">
                COMPRA DO KIT
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.nfFaturada ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      nfFaturada: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      nfFaturada: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="nfFaturada"
                id="nfFaturada"
              />
              <label className="ml-2" htmlFor="nfFaturada">
                NF FATURADA
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.prevChegada ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      prevChegada: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      prevChegada: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="prevChegada"
                id="prevChegada"
              />
              <label className="ml-2" htmlFor="prevChegada">
                PREVISÃO DE CHEGADA
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.respConcessionaria ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      respConcessionaria: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      respConcessionaria: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="respConcessionaria"
                id="respConcessionaria"
              />
              <label className="ml-2" htmlFor="respConcessionaria">
                RESP.CONCESSIONÁRIA
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.entregaDoKit ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      entregaDoKit: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      entregaDoKit: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="entregaDoKit"
                id="entregaDoKit"
              />
              <label className="ml-2" htmlFor="entregaDoKit">
                ENTREGA DO KIT
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.instalacaoAgendada ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      instalacaoAgendada: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      instalacaoAgendada: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="instalacaoAgendada"
                id="instalacaoAgendada"
              />
              <label className="ml-2" htmlFor="instalacaoAgendada">
                INST.AGENDADA
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={
                  infoHolder.jornada?.vistoriaConcessionaria ? true : false
                }
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      vistoriaConcessionaria: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      vistoriaConcessionaria: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="vistoriaConcessionaria"
                id="vistoriaConcessionaria"
              />
              <label className="ml-2" htmlFor="vistoriaConcessionaria">
                VISTORIA DA CONCESSIONÁRIA
              </label>
            </div>
            <div className="w-fit">
              <input
                checked={infoHolder.jornada?.sistemaLigado ? true : false}
                onChange={(e) => {
                  handleChanges({
                    jornada: {
                      ...infoHolder.jornada,
                      sistemaLigado: e.target.checked,
                    },
                  });
                  setInfo({
                    ...infoHolder,
                    jornada: {
                      ...infoHolder.jornada,
                      sistemaLigado: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="sistemaLigado"
                id="sistemaLigado"
              />
              <label className="ml-2" htmlFor="sistemaLigado">
                SISTEMA LIGADO
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PosVendaCard;
