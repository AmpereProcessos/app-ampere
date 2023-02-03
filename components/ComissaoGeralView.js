import axios from "axios";
import dayjs from "dayjs";
import React from "react";

function ComissaoGeralView({ projects, setProjects }) {
  function validateComissions() {
    axios
      .post("/api/projects/comissao", projects)
      .then((res) => alert(res.data));
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <button
          onClick={validateComissions}
          className="mt-4 rounded bg-green-400 p-2 hover:bg-green-500 hover:text-white font-bold transition duration-300 ease-in-out hover:scale-105"
        >
          VALIDAR INFORMAÇÕES
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {projects?.map((project, index) => (
          <div
            key={index}
            className="flex flex-col w-full p-2 rounded border border-gray-300"
          >
            <h1 className="font-bold text-[#15599a] text-md col-span-2 text-center pb-2">
              #{project.qtde} - {project.nomeDoContrato}
            </h1>
            <div className="flex items-center justify-between flex-wrap pb-1 border-b border-gray-200">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">CÓDIGO SVB</p>
                <p className="text-xs text-gray-600">
                  {project.codigoSVB ? project.codigoSVB : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  DATA ASSINATURA
                </p>
                <p className="text-xs text-gray-600">
                  {project.contrato.dataAssinatura
                    ? dayjs(project.contrato.dataAssinatura)
                        .add(4, "hours")
                        .format("DD/MM/YYYY")
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  DATA PAGAMENTO
                </p>
                <p className="text-xs text-gray-600">
                  {project.compra && project.compra.dataPagamento
                    ? dayjs(project.compra.dataPagamento)
                        .add(4, "hours")
                        .format("DD/MM/YYYY")
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">CIDADE</p>
                <p className="text-xs text-gray-600">
                  {project.cidade ? project.cidade : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">VENDEDOR</p>
                <p className="text-xs text-gray-600">
                  {project.vendedor ? project.vendedor.nome : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">POTÊNCIA PICO</p>
                <p className="text-xs text-gray-600">
                  {project.sistema ? `${project.sistema.potPico} kWp` : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  CANAL DE VENDA
                </p>
                <p className="text-xs text-gray-600">
                  {typeof project.canalVenda == "string"
                    ? project.canalVenda
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">INSIDER</p>
                <p className="text-xs text-gray-600">
                  {project.insider ? project.insider : "NÃO POSSUI"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  VALOR DO PROJETO
                </p>
                <p className="text-xs text-gray-600">
                  {project.sistema?.valorProjeto
                    ? `R$ ${project.sistema.valorProjeto.toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  VALOR DO PADRÃO
                </p>
                <p className="text-xs text-gray-600">
                  {project.padrao?.valor
                    ? `R$ ${project.padrao.valor.toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-700 font-bold">
                  VALOR DA ESTRUTURA
                </p>
                <p className="text-xs text-gray-600">
                  {project.estruturaPersonalizada?.valor
                    ? `R$ ${project.estruturaPersonalizada.valor.toFixed(2)}`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold text-gray-700 text-center">
                    PORCENTAGEM DE COMISSÃO
                  </p>
                  <input
                    type="number"
                    value={
                      project.porcentagemComissao
                        ? project.porcentagemComissao
                        : 0
                    }
                    className="outline-none p-2 text-xs text-gray-600 text-center"
                    onChange={(e) => {
                      let arr = [...projects];
                      arr[index].porcentagemComissao = Number(e.target.value);
                      setProjects([...arr]);
                    }}
                  />
                </div>
                {project.insider && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold text-gray-700 text-center">
                      PORCENTAGEM DE COMISSÃO INSIDER
                    </p>
                    <input
                      type="number"
                      value={
                        project.porcentagemComissaoInsider
                          ? project.porcentagemComissaoInsider
                          : 0
                      }
                      className="outline-none p-2 text-xs text-gray-600 text-center"
                      onChange={(e) => {
                        let arr = [...projects];
                        arr[index].porcentagemComissaoInsider = Number(
                          e.target.value
                        );
                        setProjects([...arr]);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold text-gray-700 text-center">
                    VALOR (PROJETO)
                  </p>
                  <p className="text-xs  text-gray-600 p-2 text-center">
                    R$
                    {project.sistema.valorProjeto
                      ? (
                          (project.sistema.valorProjeto *
                            project.porcentagemComissao) /
                          100
                        ).toFixed(2)
                      : 0}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold text-gray-700 text-center">
                    VALOR (PADRÃO)
                  </p>
                  <p className="text-xs  text-gray-600 p-2 text-center">
                    R$
                    {project.padrao.valor
                      ? (
                          (project.padrao.valor * project.porcentagemComissao) /
                          100
                        ).toFixed(2)
                      : 0}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold text-gray-700 text-center">
                    VALOR (ESTRUTURA)
                  </p>
                  <p className="text-xs  text-gray-600 p-2 text-center">
                    R$
                    {project.estruturaPersonalizada.valor
                      ? (
                          (project.estruturaPersonalizada.valor *
                            project.porcentagemComissao) /
                          100
                        ).toFixed(2)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ComissaoGeralView;
