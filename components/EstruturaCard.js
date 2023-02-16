import axios from "axios";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import OSCreationBlock from "./OSCreationBlock";
import dayjs from "dayjs";
function EstruturaCard({ project, credentials }) {
  const [changes, setChanges] = useState({
    "estruturaPersonalizada.dataMontagem":
      project.estruturaPersonalizada.dataMontagem,
    "estruturaPersonalizada.status": project.estruturaPersonalizada.status,
  });
  const [osVisible, setOSVisible] = useState(false);
  const [ordensDeServico, setOrdens] = useState(project.ordensDeServico);
  function handleChanges(mudancas) {
    axios
      .post("/api/gestaoDeObras/estruturas", {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data));
  }
  return (
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex flex-col lg:grid lg:grid-cols-10 items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col justify-center items-center col-span-2">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="font-bold text-center">{project.nomeDoContrato}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center grow justify-around col-span-8">
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              PAGAMENTO DO KIT
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusLiberacao}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              LOGRADOURO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.logradouro}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">
              {project.numeroResidencia}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              STATUS DA ENTREGA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusEntrega
                ? project.compra.statusEntrega
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              {project.compra.statusEntrega == "ENTREGUE"
                ? "DATA DE ENTREGA"
                : "PREVISÃO DE ENTREGA"}
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusEntrega == "ENTREGUE"
                ? project.compra.dataEntrega
                  ? dayjs(new Date(project.compra.dataEntrega))
                      .add(4, "hours")
                      .format("DD/MM/YYYY")
                  : dayjs(new Date(project.compra.previsaoEntrega))
                      .add(4, "hours")
                      .format("DD/MM/YYYY")
                : project.compra.previsaoEntrega
                ? dayjs(new Date(project.compra.previsaoEntrega))
                    .add(4, "hours")
                    .format("DD/MM/YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              TIPO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.tipo
                ? project.estruturaPersonalizada?.tipo
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              RESP.PAGAMENTO DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.respPagamento
                ? project.estruturaPersonalizada?.respPagamento
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              VALOR DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.valor
                ? project.estruturaPersonalizada?.valor
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              ENTREGA DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.statusEntrega
                ? project.estruturaPersonalizada?.statusEntrega
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              DATA DE ENTREGA DA ESTRUTURA
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.dataEntrega
                ? dayjs(project.estruturaPersonalizada?.dataEntrega)
                    .add(4, "hours")
                    .format("DD/MM/YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
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
            <OSCreationBlock
              editor={true}
              credentials={credentials}
              qtde={project.qtde}
              nomeDoContrato={project.nomeDoContrato}
              id={project._id}
              ordensDeServico={project.ordensDeServico}
              handleUpdates={(obj) => {
                if (project.ordensDeServico) {
                  setOrdens([...project.ordensDeServico]);
                } else {
                  setOrdens([obj]);
                }
              }}
              categories={[
                { label: "ESTRUTURA", value: "ESTRUTURA" },
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
              ]}
            />
          </>
        ) : (
          false
        )}
      </div>
      {ordensDeServico != undefined && ordensDeServico?.length > 0 && (
        <div className="w-full flex flex-col px-10 border-t border-gray-200 mt-2">
          <h1 className="text-[#fead61] font-bold">OSs GERADAS DO PROJETO</h1>
          {ordensDeServico.map((ordem, index) => (
            <div
              key={index}
              className={`${
                ordem.categoria != "ESTRUTURA" ? "hidden" : "flex"
              } mt-1 items-center justify-around`}
            >
              <div className="flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">CATEGORIA</p>
                <p className="text-xxs uppercase">{ordem.categoria}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  SERVIÇO PARA EXECUÇÃO
                </p>
                <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  PAGAR TERCEIRO?
                </p>
                <p className="text-xs uppercase">
                  {ordem.pagamentoTerceiro ? "SIM" : "NÃO"}
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  VALOR PAGAMENTO TERCEIRO
                </p>
                <p className="text-xs uppercase">
                  R${" "}
                  {Number(ordem.valorPagamentoTerceiro)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  REALIZAR COBRANÇA?
                </p>
                <p className="text-xs uppercase">
                  {ordem.realizarCobranca ? "SIM" : "NÃO"}
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  VALOR DA COBRANÇA
                </p>
                <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">EMISSOR DA OS</p>
                <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  DATA DE ABERTURA
                </p>
                <p className="text-xs uppercase">
                  {new Date(ordem.dataDeAbertura).toLocaleDateString()}
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-sm uppercase text-gray-500">
                  GRAU DE URGÊNCIA
                </p>
                <p className="text-xs uppercase">{ordem.grauDeUrgencia}</p>
              </div>
              <Link href={`/ordemDeServico/pdf/${project._id}?index=${index}`}>
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
