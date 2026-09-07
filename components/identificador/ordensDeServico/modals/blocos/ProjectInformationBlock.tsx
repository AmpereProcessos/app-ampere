import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { updateProject } from "@/utils/methods/mutation/clients";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Code,
  IdCard,
  Info,
  LayoutGrid,
  MapPin,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AiOutlineSafety } from "react-icons/ai";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent } from "react-icons/bs";
import { FaBolt, FaIndustry, FaUserAlt } from "react-icons/fa";
import { MdOutlineMiscellaneousServices, MdSync } from "react-icons/md";

import ServiceOrderProjectAllocationsList from "./ProjectAllocations";

type ServiceOrderProjectInformationBlockProps = {
  session: TAuthSession;
  project: TServiceOrderProject;
  infoHolder: TServiceOrder;
};
function ServiceOrderProjectInformationBlock({
  session,
  project,
  infoHolder,
}: ServiceOrderProjectInformationBlockProps) {
  async function handleUpdateProject() {
    try {
      const changes = {
        "obra.entrada": !project.obra.entrada ? infoHolder.periodo.inicio : project.obra.entrada,
        "obra.saida": !project.obra.saida ? infoHolder.periodo.fim : project.obra.saida,
        "obra.statusDaObra": !project.obra.statusDaObra
          ? infoHolder.status
          : project.obra.statusDaObra,
        "obra.equipeResp": !project.obra.equipeResp
          ? infoHolder.responsavel.nome
          : project.obra.equipeResp,
        "obra.responsaveis": !project.obra.responsaveis
          ? infoHolder.responsaveis
          : project.obra.responsaveis,
        "obra.observacoes": infoHolder.observacoes.join("/"),
      };
      await updateProject({ id: project._id, changes });
      return "Dados sincronizados com sucesso !";
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  }
  const { mutate, isPending } = useMutation({
    mutationKey: ["sync-project-data", project._id],
    mutationFn: handleUpdateProject,
    onSuccess: () => toast.success("Dados sincronizados no projeto."),
  });
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES DO PROJETO"
      sectionTitleIcon={<Building2 size={15} />}
    >
      <div className="flex w-full items-center justify-center">
        {project.idOrdemServico ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate()}
            className={cn(
              "disabled:bg-primary/60 disabled:hover:bg-primary/60 flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-white duration-300 ease-in-out hover:bg-blue-700",
            )}
          >
            <MdSync />
            <h1 className="text-xs font-medium tracking-tight">SINCRONIZAR DADOS NO PROJETO</h1>
          </button>
        ) : null}
      </div>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
          <LayoutGrid className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-xs tracking-tight font-medium text-start w-fit">GERAIS</h1>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">PROJETO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.qtde}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <UserRound className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.nomeDoContrato}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <IdCard className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.cpf_cnpj}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {formatLocation({
                    location: {
                      uf: project.uf || "",
                      cidade: project.cidade || "",
                      cep: project.cep?.toString() || "",
                      bairro: project.bairro,
                      endereco: project.logradouro,
                      numeroOuIdentificador: project.numeroResidencia?.toString() || "",
                      complemento: null,
                      latitude: null,
                      longitude: null,
                    },
                    includeCity: true,
                    includeUf: true,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <UserRound className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  VENDIDO POR: {project.vendedor?.nome || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">COMPRA</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <BsCalendarEvent className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.compra.previsaoEntrega
                    ? `ENTREGA PREVISTA P/ ${formatDateAsLocale(project.compra.previsaoEntrega)}`
                    : "ENTREGA SEM PREVISÃO DEFINIDA"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.compra.dataPagamento
                    ? `PAGAMENTO REALIZADO EM: ${formatDateAsLocale(project.compra.dataPagamento)}`
                    : "PAGAMENTO NÃO REALIZADO"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendarCheck className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.compra.dataEntrega
                    ? `ENTREGA REALIZADA EM: ${formatDateAsLocale(project.compra.dataEntrega)}`
                    : "ENTREGA NÃO REALIZADA"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">HOMOLOGAÇÃO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.homologacao?.acesso?.dataResposta
                    ? `PARECER LIBERADO EM: ${formatDateAsLocale(project.homologacao.acesso.dataResposta)}`
                    : "SEM PARECER DE ACESSO"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project.homologacao?.vistoria?.dataEfetivacao
                    ? `VISTORIA REALIZADA EM: ${formatDateAsLocale(project.homologacao.vistoria.dataEfetivacao)}`
                    : "VISTORIA NÃO REALIZADA"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-stretch gap-2 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
              <ShoppingCart className="w-4 h-4 min-w-4 min-h-4" />
              <h1 className="text-xs tracking-tight font-medium text-start w-fit">PRODUTOS</h1>
            </div>
            <div className="w-full flex flex-col gap-3 border border-border rounded p-3 bg-card">
              {project.produtos && project.produtos.length > 0 ? (
                project.produtos.map((product, index) => (
                  <ServiceOrderProjectProductCard
                    key={`product-${product.id}-${index}`}
                    product={product}
                  />
                ))
              ) : (
                <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
                  Nenhum produto adicionado
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
              <MdOutlineMiscellaneousServices className="w-4 h-4 min-w-4 min-h-4" />
              <h1 className="text-xs tracking-tight font-medium text-start w-fit">SERVIÇOS</h1>
            </div>
            <div className="w-full flex flex-col gap-3 border border-border rounded p-3 bg-card">
              {project.servicos && project.servicos.length > 0 ? (
                project.servicos.map((service, index) => (
                  <ServiceOrderProjectServiceCard
                    key={`service-${service.id}-${index}`}
                    service={service}
                  />
                ))
              ) : (
                <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
                  Nenhum serviço adicionado
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
          <Building2 className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-xs tracking-tight font-medium text-start w-fit">DADOS DA OBRA</h1>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-foreground text-[0.65rem] font-medium">EXECUÇÃO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.obra.equipeResp}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendar />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {project?.obra.entrada
                    ? `${formatDateAsLocale(project?.obra.entrada, true)} - ${project?.obra.saida ? formatDateAsLocale(project?.obra.saida, true) : "N/A"}`
                    : "N/A"}
                </p>
              </div>
              <h1 className="bg-primary text-xxs rounded-md px-2 py-0.5 leading-none font-medium tracking-tight text-white">
                {project?.obra.statusDaObra}
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-foreground text-[0.65rem] font-medium">OUTROS</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
              {project.padrao.aumentoCarga.aplicavel ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-200 text-orange-800">
                  <AlertCircle className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                    AUMENTO DE CARGA - TIPO: {project.padrao.tipo}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-200 text-gray-800">
                  <AlertCircle className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                    NÃO POSSUI AUMENTO DE CARGA
                  </p>
                </div>
              )}
              {project.obra.pendencias ? (
                <h1 className="text-xxs rounded-md bg-orange-500 px-2 py-0.5 leading-none font-medium tracking-tight text-white">
                  {project?.obra.pendencias}
                </h1>
              ) : (
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  PENDÊNCIAS: N/A
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/2">
            <h1 className="text-primary w-full text-center text-[0.6rem] font-medium tracking-tight lg:text-start">
              OBSERVAÇÕES GERAIS SOBRE A OBRA
            </h1>
            <div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
              <h1 className="text-[0.6rem] font-medium whitespace-pre-wrap">
                {project.obra.observacoes || "OBSERVAÇÕES DA OBRA NÃO DEFINIDAS"}
              </h1>
            </div>
          </div>
        </div>
        <ServiceOrderProjectAllocationsList
          session={session}
          project={project}
          allocations={project.alocacoes || []}
        />
      </div>
    </ResponsiveDialogDrawerSection>
  );
}

export default ServiceOrderProjectInformationBlock;

function ServiceOrderProjectProductCard({
  product,
}: {
  product: Exclude<TServiceOrderProject["produtos"], undefined | null>[number];
}) {
  return (
    <div key={product.id} className="w-full flex flex-col gap-1">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full items-center gap-1 lg:grow">
          {renderProductCategoryIcon(product.categoria, 15)}
          <p className="text-sm leading-none font-medium tracking-tight">
            <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaIndustry size={12} />
            <p className="text-foreground text-[0.6rem] lg:text-xs">{product.fabricante}</p>
          </div>
          {product.potencia ? (
            <div className="flex items-center gap-1">
              <FaBolt size={12} />
              <p className="text-foreground text-[0.6rem] lg:text-xs">{product.potencia} W</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <AiOutlineSafety size={12} />
            <p className="text-foreground text-[0.6rem] lg:text-xs">{product.garantia} ANOS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceOrderProjectServiceCard({
  service,
}: {
  service: Exclude<TServiceOrderProject["servicos"], undefined | null>[number];
}) {
  return (
    <div key={service.id} className="w-full flex flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <MdOutlineMiscellaneousServices className="w-4 h-4 min-w-4 min-h-4" />
          <p className="text-sm leading-none font-medium tracking-tight">{service.descricao}</p>
        </div>
        <div className="flex items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <AiOutlineSafety size={12} />
            <p className="text-muted-foreground text-[0.6rem] lg:text-xs">
              {service.garantia} {service.garantia && service.garantia > 0 ? "ANOS" : "ANO"}
            </p>
          </div>
          {service.observacoes ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 min-w-4 min-h-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{service.observacoes}</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
}
