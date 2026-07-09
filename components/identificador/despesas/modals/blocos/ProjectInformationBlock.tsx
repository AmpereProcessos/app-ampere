import { formatLocation } from "@/utils/methods/formatting";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TExpense, TExpenseProjectDTO } from "@/utils/schemas/expenses";
import { TRevenue, TRevenueProjectDTO } from "@/utils/schemas/revenues";
import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { BsBank, BsPersonVcard, BsStack } from "react-icons/bs";
import { FaBolt, FaIndustry, FaPhone, FaUserAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import {
  MdLandscape,
  MdOutlineMiscellaneousServices,
  MdOutlinePayment,
  MdPhone,
} from "react-icons/md";

type ExpenseProjectInformationBlockProps = {
  expense: TExpense;
  project: TExpenseProjectDTO;
};
function ExpenseProjectInformationBlock({ expense, project }: ExpenseProjectInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">
        INFORMAÇÕES DO PROJETO
      </h1>

      <div className="flex w-full grow flex-col gap-2">
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">
          GERAIS
        </h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">PROJETO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project!.nomeDoContrato}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MdPhone />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.telefone}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.cpf_cnpj}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MdLandscape />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.inscricaoRural || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {formatLocation({
                    location: {
                      uf: project!.uf || "",
                      cidade: project!.cidade || "",
                      cep: project!.cep?.toString() || "",
                      bairro: project!.bairro,
                      endereco: project!.logradouro,
                      numeroOuIdentificador: project!.numeroResidencia?.toString() || "",
                      complemento: null,
                      latitude: null,
                      longitude: null,
                    },
                    includeCity: true,
                    includeUf: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">
          PAGAMENTO
        </h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">PAGADOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.pagador.nome}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.cpf_cnpjPagador || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaPhone />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.contatoPagador}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-foreground text-[0.65rem] font-medium">CREDOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <BsStack />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.forma || "NÃO DEFINIDO"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MdOutlinePayment />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.metodo || "NÃO DEFINIDO"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <BsBank />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.pagamento.credor || "NÃO DEFINIDO"}
                </p>
              </div>
              {project!.pagamento.forma === "FINANCIAMENTO" ? (
                <>
                  <div className="flex items-center gap-1">
                    <FaUserAlt />
                    <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                      {project?.pagamento.credorNomeGerente}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPhone />
                    <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                      {project?.pagamento.credorContatoGerente}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/2">
            <h1 className="text-primary w-full text-center text-[0.6rem] font-medium tracking-tight lg:text-start">
              OBSERVAÇÕES GERAIS SOBRE A NEGOCIAÇÃO
            </h1>
            <div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
              <h1 className="text-[0.6rem] font-medium">
                {project!.pagamento.negociacao || "OBSERVAÇÕES DA NEGOCIAÇÃO NÃO DEFINIDAS"}
              </h1>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
                   <div className="flex w-full flex-col lg:w-1/2">
                     <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-start">
                       OBSERVAÇÕES GERAIS SOBRE O PAGAMENTO
                     </h1>
                     <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                       <h1 className="text-[0.6rem] font-medium">{project!.pagamentoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}</h1>
                     </div>
                   </div>
                   {project!.pagamentoCreditoAplicavel ? (
                     <div className="flex w-full flex-col lg:w-1/2">
                       <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-end">
                         OBSERVAÇÕES GERAIS SOBRE CRÉDITO
                       </h1>
                       <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                         <h1 className="text-[0.6rem] font-medium">
                           {project!.pagamentoCreditoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}
                         </h1>
                       </div>
                     </div>
                   ) : null}
                 </div> */}
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">
          PRODUTOS
        </h1>
        <div className="flex w-full flex-wrap items-center gap-2">
          {project!.produtos && project!.produtos.length > 0 ? (
            project!.produtos.map((product) => (
              <div
                key={product.id}
                className="border-primary bg-background flex w-full flex-col gap-1 rounded-md border p-2 dark:bg-[#121212]"
              >
                <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                  <div className="flex w-full items-center gap-1 lg:grow">
                    <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-white">
                      {renderProductCategoryIcon(product.categoria, 15)}
                    </div>
                    <p className="text-sm leading-none font-bold tracking-tight">
                      <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
                    <div className="flex items-center gap-1">
                      <FaIndustry size={12} />
                      <p className="text-foreground text-[0.6rem] font-light lg:text-xs">
                        {product.fabricante}
                      </p>
                    </div>
                    {product.potencia ? (
                      <div className="flex items-center gap-1">
                        <FaBolt size={12} />
                        <p className="text-foreground text-[0.6rem] font-light lg:text-xs">
                          {product.potencia} W
                        </p>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1">
                      <AiOutlineSafety size={12} />
                      <p className="text-foreground text-[0.6rem] font-light lg:text-xs">
                        {product.garantia} ANOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum produto adicionado
            </div>
          )}
        </div>
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">
          SERVIÇOS
        </h1>
        <div className="flex w-full flex-wrap items-center gap-2">
          {!!project.servicos && project.servicos?.length > 0 ? (
            project.servicos?.map((service) => (
              <div
                key={service.id}
                className="border-primary bg-background flex w-full flex-col gap-1 rounded-md border p-2 dark:bg-[#121212]"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-white">
                      <MdOutlineMiscellaneousServices />
                    </div>
                    <p className="text-sm leading-none font-bold tracking-tight">
                      {service.descricao}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineSafety size={12} />
                    <p className="text-muted-foreground text-[0.6rem] font-light lg:text-xs">
                      {service.garantia} {service.garantia && service.garantia > 0 ? "ANOS" : "ANO"}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
                    <h1 className="text-[0.6rem] font-medium">
                      {service.observacoes || "OBSERVAÇÕES NÃO DEFINIDAS"}
                    </h1>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum serviço adicionado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseProjectInformationBlock;
