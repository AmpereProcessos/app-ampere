import axios from "axios";
import React, { useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import OSCreationBlock from "./OSCreationBlock";
function PadraoCard({ project, credentials }) {
  const [changes, setChanges] = useState({
    "projeto.fechamentoAC": project.projeto.fechamentoAC,
    "projeto.acStatus": project.projeto.acStatus,
  });
  const [osVisible, setOSVisible] = useState(false);
  const [ordensDeServico, setOrdens] = useState(
    project.ordensDeServico ? project.ordensDeServico : []
  );
  function handleChanges(mudancas) {
    axios
      .post("/api/gestaoDeObras/padroes", {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data));
  }
  return (
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex flex-col justify-center lg:flex-row items-center gap-x-2 lg:justify-between border-b border-gray-200 pb-2">
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
              TIPO DO PADRÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.padrao?.tipo ? project.padrao.tipo : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              RESP.PAGAMENTO DO PADRÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.padrao?.respPagamento
                ? project.padrao.respPagamento
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              RESP.INSTALAÇÃO DO PADRÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.padrao?.respInstalacao
                ? project.padrao.respInstalacao
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              VALOR DO PADRÃO
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.padrao?.valor ? project.padrao.valor : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              SAIDA DO CLIENTE
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.visitaTecnica.saidaDoCliente
                ? project.visitaTecnica.saidaDoCliente
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              AMPERAGEM
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.visitaTecnica?.amperagem
                ? project.visitaTecnica.amperagem
                : "-"}
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
              changes["projeto.fechamentoAC"]
                ? new Date(changes["projeto.fechamentoAC"])
                    .toISOString()
                    .slice(0, 10)
                : null
            }
            onChange={(e) => {
              handleChanges({
                "projeto.fechamentoAC": new Date(e.target.value),
              });
              setChanges({
                ...changes,
                "projeto.fechamentoAC": new Date(e.target.value),
              });
            }}
          />
        </div>
        <SelectInput
          label={"STATUS AUMENTO DE CARGA"}
          editable={true}
          value={changes["projeto.acStatus"]}
          options={[
            {
              label: "PENDÊNCIA",
              value: "PENDÊNCIA",
            },
            {
              label: "REALIZADO",
              value: "REALIZADO",
            },
            {
              label: "SOLICITADO COM G.D",
              value: "SOLICITADO COM G.D",
            },
          ]}
          handleChange={(value) => {
            handleChanges({ "projeto.acStatus": value });
            setChanges({
              ...changes,
              "projeto.acStatus": value,
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
                { label: "PADRÃO", value: "PADRÃO" },
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
        <div className="w-full flex flex-col px-3 border-t border-gray-200 mt-2">
          <h1 className="text-[#fead61] font-bold">OSs GERADAS DO PROJETO</h1>
          {ordensDeServico.map((ordem, index) => (
            <div
              key={index}
              className={`${
                ordem.categoria != "PADRÃO" ? "hidden" : "flex"
              } mt-1 items-center justify-around`}
            >
              <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-gray-500">CATEGORIA</p>
                <p className="text-xxs uppercase">{ordem.categoria}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-gray-500">
                  SERVIÇO PARA EXECUÇÃO
                </p>
                <p className="text-xxs uppercase">{ordem.servicoExecutado}</p>
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
                <p className="text-xs uppercase text-gray-500">
                  PAGAR TERCEIRO?
                </p>
                <p className="text-xxs uppercase">
                  {ordem.pagamentoTerceiro ? "SIM" : "NÃO"}
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-xs text-xsuppercase text-gray-500">
                  VALOR DA COBRANÇA
                </p>
                <p className="text-xxs uppercase">R$ {ordem.valorCobranca}</p>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <p className="text-xs uppercase text-gray-500">EMISSOR DA OS</p>
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

export default PadraoCard;
