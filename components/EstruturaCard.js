import axios from "axios";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
function EstruturaCard({ project, credentials }) {
  const [changes, setChanges] = useState({
    "estruturaPersonalizada.dataMontagem":
      project.estruturaPersonalizada.dataMontagem,
    "estruturaPersonalizada.pagTerceiro":
      project.estruturaPersonalizada.pagTerceiro,
    "estruturaPersonalizada.status": project.estruturaPersonalizada.status,
  });
  const [osVisible, setOSVisible] = useState(false);
  const [osInfo, setOsInfo] = useState({
    categoria: "ESTRUTURA",
    servicoExecutado: "",
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: "",
    grauDeUrgencia: "NÃO DEFINIDO",
    observacoes: "",
    dataDeAbertura: new Date(),
  });
  const [osMsg, setOsMsg] = useState({
    text: "",
    color: "text-red-500",
  });
  function handleChanges(mudancas) {
    axios
      .post("/api/gestaoDeObras/estruturas", {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data));
  }
  function handleOSCreation() {
    var arr;
    if (osInfo.servicoExecutado.trim().length < 5) {
      setOsMsg({
        text: "Por favor, preencha o serviço a ser executado.",
        color: "text-red-500",
      });
      return;
    } else {
      if (
        project.ordensDeServico != undefined &&
        project.ordensDeServico?.length > 0
      ) {
        project.ordensDeServico.push({
          ...osInfo,
          usuarioEmissor: credentials.nome,
          index: project.ordensDeServico?.length,
          cobrancaRealizada: false,
        });
        arr = project.ordensDeServico;
      } else {
        arr = [
          {
            ...osInfo,
            usuarioEmissor: credentials.nome,
            index: 0,
            cobrancaRealizada: false,
          },
        ];
        project.ordensDeServico = arr;
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
            dataDeAbertura: new Date(),
          });
        });
    }
  }
  return (
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col justify-center items-center">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="font-bold text-center">{project.nomeDoContrato}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center grow justify-around">
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              PAGAMENTO DO KIT
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusLiberacao}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              LOGRADOURO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.logradouro}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">
              {project.numeroResidencia}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              DATA ASS.DOCUMENTAÇÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.projeto?.dataAssDocumentacao
                ? new Date(
                    project.projeto.dataAssDocumentacao
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              TIPO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.tipo
                ? project.estruturaPersonalizada?.tipo
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              RESP.PAGAMENTO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.respPagamento
                ? project.estruturaPersonalizada?.respPagamento
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              VALOR DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.valor
                ? project.estruturaPersonalizada?.valor
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              NºModulos
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.sistema.qtdeModulos ? project.sistema.qtdeModulos : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-around mt-2">
        <div className="flex flex-col">
          <h1 className="font-bold">DIA DA MONTAGEM</h1>
          <input
            type="date"
            value={
              changes["estruturaPersonalizada.dataMontagem"]
                ? new Date(changes["estruturaPersonalizada.dataMontagem"])
                    .toISOString()
                    .slice(0, 10)
                : null
            }
            onChange={(e) => {
              handleChanges({
                "estruturaPersonalizada.dataMontagem": new Date(e.target.value),
              });
              setChanges({
                ...changes,
                "estruturaPersonalizada.dataMontagem": new Date(e.target.value),
              });
            }}
          />
        </div>
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            PAGAMENTO TERCEIRO
          </span>
          <div className="flex">
            <input
              type="checkbox"
              name="projetoconcluido"
              id="projetoconcluido"
              onChange={(e) => {
                handleChanges({
                  "estruturaPersonalizada.pagTerceiro": e.target.checked,
                });
                setChanges({
                  ...changes,
                  "estruturaPersonalizada.pagTerceiro": e.target.checked,
                });
              }}
            />
            <label className="ml-2" htmlFor="projetoconcluido">
              OK
            </label>
          </div>
        </div>
        <SelectInput
          label={"STATUS da estrutura personalizada"}
          editable={true}
          value={changes["estruturaPersonalizada.status"]}
          options={[
            { label: "PRONTA", value: "PRONTA" },
            { label: "PENDÊNCIA", value: "PENDÊNCIA" },
            { label: "N/A", value: "N/A" },
          ]}
          handleChange={(value) => {
            handleChanges({
              "estruturaPersonalizada.status": value,
            });
            setChanges({
              ...changes,
              "estruturaPersonalizada.status": value,
            });
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            ORDEM DE SERVIÇO
          </span>
          <button
            onClick={() => setOSVisible(!osVisible)}
            className="px-1 h-[20px] rounded bg-[#fead41] mb-2 hover:bg-[#15599a] hover:text-white"
          >
            <AiFillEye />
          </button>
        </div>
        {osVisible ? (
          <>
            <div className="flex gap-2 justify-center flex-wrap">
              <SelectInput
                label={"CATEGORIA DA OS"}
                value={osInfo.categoria}
                editable={false}
                options={[{ label: "ESTRUTURA", value: "ESTRUTURA" }]}
              />
              <TextInput
                label={"Serviço a ser executado"}
                value={osInfo.servicoExecutado}
                editable={true}
                handleChange={(value) =>
                  setOsInfo({ ...osInfo, servicoExecutado: value })
                }
              />
              <div>
                <input
                  disabled={!true}
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
                  REALIZAR COBRANÇA
                </label>
              </div>
              <NumberInput
                label={"VALOR DO SERVIÇO A COBRAR"}
                value={osInfo.valorCobranca}
                editable={true}
                handleChange={(value) =>
                  setOsInfo({ ...osInfo, valorCobranca: Number(value) })
                }
              />
              <SelectInput
                label={"GRAU DE URGÊNCIA"}
                value={osInfo.grauDeUrgencia}
                editable={true}
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
                editable={true}
                value={new Date(osInfo.dataDeAbertura)
                  .toISOString()
                  .slice(0, 10)}
                handleChange={(value) =>
                  setOsInfo({
                    ...osInfo,
                    dataDeAbertura: new Date(value).toISOString(),
                  })
                }
              />
            </div>
            {osInfo.categoria != "MONTAGEM" &&
              osInfo.categoria != "NÃO DEFINIDO" && (
                <div className="flex flex-col w-[450px] self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES DA OS
                  </span>
                  <textarea
                    readOnly={!true}
                    value={osInfo.observacoes}
                    onChange={(e) =>
                      setOsInfo({ ...osInfo, observacoes: e.target.value })
                    }
                    placeholder="Observações da OS..."
                    className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  />
                </div>
              )}
            {osMsg.text.length > 0 && (
              <p className={`text-center ${osMsg.color} italic`}>
                {osMsg.text}
              </p>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleOSCreation}
                className="p-2 bg-[#fead61] font-bold rounded"
              >
                GERAR OS
              </button>
            </div>
          </>
        ) : (
          false
        )}
      </div>
      {project.ordensDeServico != undefined &&
        project.ordensDeServico?.length > 0 && (
          <div className="w-full flex flex-col px-10 border-t border-gray-200 mt-2">
            <h1 className="text-[#fead61] font-bold">OSs GERADAS DO PROJETO</h1>
            {project.ordensDeServico.map((ordem, index) => (
              <div
                key={index}
                className={`${
                  ordem.categoria != "ESTRUTURA" ? "hidden" : "flex"
                } mt-1 items-center justify-around`}
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-gray-500">CATEGORIA</p>
                  <p className="text-xs uppercase">{ordem.categoria}</p>
                </div>
                <div className="text-xs flex flex-col items-center">
                  <p className="text-xxs uppercase text-gray-500">
                    SERVIÇO PARA EXECUÇÃO
                  </p>
                  <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <p className="text-xs uppercase text-gray-500">
                    REALIZAR COBRANÇA?
                  </p>
                  <p className="text-xxs uppercase">
                    {ordem.realizarCobranca ? "SIM" : "NÃO"}
                  </p>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <p className="text-xsuppercase text-gray-500">
                    VALOR DA COBRANÇA
                  </p>
                  <p className="text-xxs uppercase">R$ {ordem.valorCobranca}</p>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <p className="text-xs uppercase text-gray-500">
                    EMISSOR DA OS
                  </p>
                  <p className="text-xxs uppercase">{ordem.usuarioEmissor}</p>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <p className="text-xs uppercase text-gray-500">
                    DATA DE ABERTURA
                  </p>
                  <p className="text-xxs uppercase">
                    {new Date(ordem.dataDeAbertura).toLocaleDateString()}
                  </p>
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <p className="text-xs uppercase text-gray-500">
                    GRAU DE URGÊNCIA
                  </p>
                  <p className="text-xxs uppercase">{ordem.grauDeUrgencia}</p>
                </div>
                <Link
                  href={`/ordemDeServico/pdf/${project._id}?index=${index}`}
                >
                  <button className="p-2 bg-[#fead61] font-bold rounded">
                    VER OS
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default EstruturaCard;
