import axios from "axios";
import React, { useState } from "react";

function PadraoCard({ project }) {
  const [changes, setChanges] = useState({
    "projeto.fechamentoAC": project.projeto.fechamentoAC,
    "padrao.pagTerceiro": null,
  });
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
      <div className="flex items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
        <h1 className="font-bold">
          <strong className="text-[#15599a]">{project.qtde} </strong>
          {project.nomeDoContrato}
        </h1>
        <div className="flex flex-wrap gap-y-2 items-center grow justify-around">
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
      <div className="flex items-center justify-around mt-2">
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
                handleChanges({ "padrao.pagTerceiro": e.target.checked });
                setChanges({
                  ...changes,
                  "padrao.pagTerceiro": e.target.checked,
                });
              }}
            />
            <label className="ml-2" htmlFor="projetoconcluido">
              OK
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PadraoCard;
