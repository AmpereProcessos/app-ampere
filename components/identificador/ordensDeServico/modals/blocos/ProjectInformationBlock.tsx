import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import NumberInput from "@/components/inputs/Number";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import { createPurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import { createWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { usePurchaseControlByProjectId } from "@/utils/methods/query/purchase-controls";
import { useWarehouseFormsByProjectId } from "@/utils/methods/query/warehouse-forms";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Box,
  Building2,
  Code,
  IdCard,
  Info,
  LayoutGrid,
  MapPin,
  NotepadText,
  PackagePlus,
  Plus,
  ShoppingCart,
  UserRound,
  Warehouse,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSafety } from "react-icons/ai";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent } from "react-icons/bs";
import { FaBolt, FaIndustry, FaUserAlt } from "react-icons/fa";
import { MdOutlineMiscellaneousServices, MdSync } from "react-icons/md";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";

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

function ServiceOrderProjectAllocationsList({
  session,
  project,
  allocations,
}: {
  session: TAuthSession;
  project: TServiceOrderProject;
  allocations: Exclude<TServiceOrderProject["alocacoes"], undefined | null>;
}) {
  const queryClient = useQueryClient();
  const [currentAllocations, setCurrentAllocations] = useState(allocations);
  const [newAllocationMenuIsOpen, setNewAllocationMenuIsOpen] = useState(false);
  const [newAllocation, setNewAllocation] = useState<
    Exclude<TServiceOrderProject["alocacoes"], undefined | null>[number]
  >({
    idMaterial: "",
    nome: "",
    unidade: "UN",
    quantidadePrevista: 0,
    quantidade: 0,
    movimentacoes: [],
    precoUnitario: 0,
  });

  useEffect(() => setCurrentAllocations(allocations), [allocations]);

  const { data: warehouseForms, isSuccess: isWarehouseFormsQuerySuccessful } =
    useWarehouseFormsByProjectId({ projectId: project._id });
  const { data: purchaseControls, isLoading: purchaseControlsAreLoading } =
    usePurchaseControlByProjectId({ projectId: project._id });
  const pendingAllocations = currentAllocations.filter(
    (allocation) => allocation.quantidadePrevista > allocation.quantidade,
  );
  const pendingPurchaseTitle = `MATERIAIS PENDENTES - ${project.nomeDoContrato || project.qtde}`;
  const pendingMaterialPurchases =
    purchaseControls?.filter((purchaseControl) =>
      purchaseControl.titulo.startsWith("MATERIAIS PENDENTES - "),
    ) || [];
  const hasOpenPendingMaterialPurchase = pendingMaterialPurchases.some(
    (purchaseControl) => !purchaseControl.dataEfetivacao,
  );

  const { mutate: addAllocation, isPending: isAddingAllocation } = useMutation({
    mutationKey: ["add-project-allocation", project._id],
    mutationFn: async () => {
      if (!newAllocation.idMaterial)
        throw new Error("Selecione um material para adicionar à alocação.");
      if (newAllocation.quantidadePrevista <= 0)
        throw new Error("A quantidade prevista deve ser maior que zero.");
      if (
        currentAllocations.some((allocation) => allocation.idMaterial === newAllocation.idMaterial)
      )
        throw new Error("Esse material já possui uma alocação no projeto.");

      const updatedAllocations = [...currentAllocations, newAllocation];
      await updateProject({ id: project._id, changes: { alocacoes: updatedAllocations } });
      return updatedAllocations;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["service-order-project", project._id] });
    },
    onSuccess: (updatedAllocations) => {
      setCurrentAllocations(updatedAllocations);
      setNewAllocationMenuIsOpen(false);
      setNewAllocation({
        idMaterial: "",
        nome: "",
        unidade: "UN",
        quantidadePrevista: 0,
        quantidade: 0,
        movimentacoes: [],
        precoUnitario: 0,
      });
      toast.success("Alocação adicionada ao projeto.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["service-order-project", project._id] });
      if (project.idOrdemServico) {
        await queryClient.invalidateQueries({
          queryKey: ["service-order", project.idOrdemServico],
        });
      }
    },
  });

  const { mutate: generateWarehouseFormulary, isPending: isGeneratingWarehouseForm } = useMutation({
    mutationKey: ["generate-warehouse-formulary", currentAllocations],
    mutationFn: async () => {
      const result = await createWarehouseFormulary({
        warehouseFormulary: {
          titulo: `FORMULÁRIO DE SAÍDA - ${project.nomeDoContrato}`,
          categoria: "SAÍDA",
          projeto: {
            id: project._id,
            nome: project.nomeDoContrato || "",
          },
          localizacao: {
            cep: project.cep,
            uf: project.uf,
            cidade: project.cidade,
            bairro: project.bairro,
            endereco: project.logradouro,
            numeroOuIdentificador: project.numeroResidencia?.toString() || "",
            complemento: "",
            distancia: null,
          },
          materiais: pendingAllocations.map((allocation) => ({
            id: allocation.idMaterial,
            nome: allocation.nome,
            preco: allocation.precoUnitario,
            qtdeRetirada: allocation.quantidadePrevista - allocation.quantidade,
            qtdeDevolucao: 0,
            grandeza: allocation.unidade,
          })),
          responsaveis: project.obra.equipeResp ?? "NÃO DEFINIDO",
        },
      });
      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["warehouse-forms-by-project-id", project._id],
      });
    },
    onSuccess: async (data) => {
      return toast.success(data.message);
    },
    onError: async (error) => {
      return toast.error(getErrorMessage(error));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["warehouse-forms-by-project-id", project._id],
      });
    },
  });

  const { mutate: requestPendingMaterialsPurchase, isPending: isRequestingPurchase } = useMutation({
    mutationKey: ["request-pending-materials-purchase", project._id],
    mutationFn: async () => {
      if (pendingAllocations.length === 0)
        throw new Error("Não há materiais pendentes para solicitar.");
      if (hasOpenPendingMaterialPurchase)
        throw new Error("Já existe uma solicitação aberta para os materiais pendentes.");

      return createPurchaseControl({
        status: "PENDENTE",
        registrosStatus: {},
        titulo: pendingPurchaseTitle,
        anotacoes:
          "Solicitação criada a partir das alocações pendentes do projeto na ordem de serviço.",
        projeto: {
          id: project._id,
          nome: project.nomeDoContrato || project.qtde.toString(),
        },
        etiquetas: [],
        atualizacoes: [],
        totalPrevisto: pendingAllocations.reduce(
          (total, allocation) =>
            total +
            (allocation.quantidadePrevista - allocation.quantidade) * allocation.precoUnitario,
          0,
        ),
        liberacao: { autor: {} },
        composicao: pendingAllocations.map((allocation) => ({
          materialId: allocation.idMaterial,
          categoria: "OUTROS",
          descricao: allocation.nome,
          unidade: allocation.unidade || "UN",
          valor: allocation.precoUnitario,
          qtde: allocation.quantidadePrevista - allocation.quantidade,
        })),
        fornecedor: {},
        total: 0,
        transporte: { transportadora: {} },
        faturamentos: [],
        entrega: {
          status: "AGUARDANDO COMPRA",
          localizacao: {
            cep: project.cep?.toString(),
            uf: project.uf,
            cidade: project.cidade,
            bairro: project.bairro,
            endereco: project.logradouro,
            numeroOuIdentificador: project.numeroResidencia?.toString() || "",
            complemento: "",
          },
        },
        autor: {
          id: session.user.id,
          nome: session.user.nome,
          avatar_url: session.user.avatar_url,
        },
        dataInsercao: new Date().toISOString(),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["purchase-control-by-project-id", project._id],
      });
    },
    onSuccess: (message) => toast.success(message),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["purchase-control-by-project-id", project._id],
      });
      await queryClient.invalidateQueries({ queryKey: ["purchase-controls"] });
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
          <Box className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-xs tracking-tight font-medium text-start w-fit">ALOCAÇÕES</h1>
        </div>
        <Button
          type="button"
          size="xs"
          variant="outline"
          aria-expanded={newAllocationMenuIsOpen}
          onClick={() => setNewAllocationMenuIsOpen((isOpen) => !isOpen)}
        >
          <Plus className="h-3.5 w-3.5" />
          {newAllocationMenuIsOpen ? "FECHAR" : "ADICIONAR ALOCAÇÃO"}
        </Button>
      </div>
      <div className="w-full flex flex-col gap-3 border border-border rounded p-3 bg-card">
        {newAllocationMenuIsOpen ? (
          <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-md p-3">
            <div>
              <p className="text-sm font-semibold">Nova alocação</p>
              <p className="text-muted-foreground text-xs">
                Selecione o material e informe quanto está previsto para o projeto.
              </p>
            </div>
            <MaterialSelector
              initialMaterialState={{
                materialId: newAllocation.idMaterial || null,
                materialName: newAllocation.nome,
              }}
              vinculateMaterial={(material) =>
                setNewAllocation((allocation) => ({
                  ...allocation,
                  idMaterial: material._id,
                  nome: material.nome,
                  unidade: material.grandeza || "UN",
                  precoUnitario: material.preco,
                }))
              }
              unvinculateMaterial={() =>
                setNewAllocation((allocation) => ({
                  ...allocation,
                  idMaterial: "",
                  nome: "",
                  unidade: "UN",
                  precoUnitario: 0,
                }))
              }
            />
            <NumberInput
              label="QUANTIDADE PREVISTA"
              value={newAllocation.quantidadePrevista || null}
              handleChange={(quantidadePrevista) =>
                setNewAllocation((allocation) => ({ ...allocation, quantidadePrevista }))
              }
              placeholder="Informe a quantidade prevista."
              labelClassName="text-xs"
              holderClassName="min-h-10 p-2 text-sm"
              width="100%"
            />
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setNewAllocationMenuIsOpen(false)}
              >
                CANCELAR
              </Button>
              <LoadingButton
                type="button"
                size="sm"
                loading={isAddingAllocation}
                onClick={() => addAllocation()}
              >
                ADICIONAR ALOCAÇÃO
              </LoadingButton>
            </div>
          </div>
        ) : null}
        {pendingAllocations.length > 0 ? (
          <div className="flex w-full flex-col gap-3 rounded-md bg-amber-100 p-3 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Existem materiais pendentes</p>
                <p className="text-xs">
                  Escolha se o atendimento será feito pelo almoxarifado ou pelo setor de
                  suprimentos.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {isWarehouseFormsQuerySuccessful && warehouseForms.length === 0 ? (
                <LoadingButton
                  size="xs"
                  className="text-xs flex items-center gap-1.5"
                  variant="outline"
                  loading={isGeneratingWarehouseForm}
                  onClick={() => generateWarehouseFormulary()}
                >
                  <Warehouse className="h-3.5 w-3.5" />
                  <span>GERAR FORMULÁRIO DE SAÍDA</span>
                </LoadingButton>
              ) : null}
              <LoadingButton
                size="xs"
                className="text-xs flex items-center gap-1.5"
                loading={isRequestingPurchase}
                disabled={purchaseControlsAreLoading || hasOpenPendingMaterialPurchase}
                onClick={() => requestPendingMaterialsPurchase()}
              >
                <PackagePlus className="h-3.5 w-3.5" />
                <span>
                  {hasOpenPendingMaterialPurchase ? "COMPRA JÁ SOLICITADA" : "SOLICITAR COMPRA"}
                </span>
              </LoadingButton>
            </div>
          </div>
        ) : null}
        {pendingMaterialPurchases.length > 0 ? (
          <div className="bg-muted/50 flex w-full flex-col gap-2 rounded-md px-3 py-2">
            <p className="text-xs font-semibold">Solicitações ao setor de suprimentos</p>
            {pendingMaterialPurchases.map((purchaseControl) => (
              <div
                key={purchaseControl._id}
                className="flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">{purchaseControl.titulo}</span>
                </div>
                <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 font-semibold">
                  {purchaseControl.status}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {isWarehouseFormsQuerySuccessful && warehouseForms.length > 0 ? (
          <div className="w-full flex flex-col gap-2 px-2 py-1 pb-3 rounded-lg bg-blue-200">
            <p className="text-xs font-medium tracking-tight">
              Existem formulários de saída de materiais para esse projeto.
            </p>
            {warehouseForms.map((form) => (
              <div key={form._id} className="w-full flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <NotepadText className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-xs font-medium tracking-tight">{form.titulo}</p>
                  <h3
                    className={cn(
                      "text-[0.65rem] font-medium tracking-tight px-2 py-0.5 rounded-lg",
                      {
                        "bg-green-600 text-white": form.dataEfetivacao,
                        "bg-blue-600 text-white": form.dataInsercao,
                        "bg-primary/20 text-primary": !form.dataEfetivacao && !form.dataInsercao,
                      },
                    )}
                  >
                    {form.dataEfetivacao
                      ? "EFETIVADO"
                      : form.dataInsercao
                        ? "EM ABERTO"
                        : "RASCUNHO"}
                  </h3>
                </div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Info className="w-4 h-4 min-w-4 min-h-4" />
                  </HoverCardTrigger>
                  <HoverCardContent className="flex flex-col gap-2 w-[300px]">
                    <p className="text-xs font-medium tracking-tight">{form.titulo}</p>
                    <div className="w-full flex flex-col gap-2 px-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20">
                      {form.materiais.map((material) => (
                        <div
                          key={material.id}
                          className="w-full flex items-center justify-between gap-2"
                        >
                          <p className="text-[0.65rem] font-medium tracking-tight truncate">
                            - {material.nome}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-tight">
                              <ArrowUp className="w-3 h-3 min-w-3 min-h-3" />
                              {formatDecimalPlaces(material.qtdeRetirada)}{" "}
                              {material.grandeza || "UN"}
                            </div>
                            <div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-tight">
                              <ArrowDown className="w-3 h-3 min-w-3 min-h-3" />
                              {formatDecimalPlaces(material.qtdeDevolucao)}{" "}
                              {material.grandeza || "UN"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))}
          </div>
        ) : null}
        {currentAllocations.length > 0 ? (
          currentAllocations.map((allocation, index) => (
            <ServiceOrderProjectAllocationCard
              key={`allocation-${allocation.idMaterial}-${index}`}
              allocation={allocation}
            />
          ))
        ) : (
          <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
            Nenhuma alocação adicionada
          </div>
        )}
      </div>
    </div>
  );
}
function ServiceOrderProjectAllocationCard({
  allocation,
}: {
  allocation: Exclude<TServiceOrderProject["alocacoes"], undefined | null>[number];
}) {
  function getAllocationStatus({ preview, actual }: { preview: number; actual: number }) {
    if (actual === 0)
      return {
        text: "NÃO ALOCADO",
        color: "bg-red-200 text-red-600",
      };
    if (preview < actual)
      return {
        text: "PARCIALMENTE ALOCADO",
        color: "bg-orange-200 text-orange-600",
      };
    if (preview > actual)
      return {
        text: "ALOCADO",
        color: "bg-green-200 text-green-600",
      };
    return {
      text: "ALOCADO",
      color: "bg-green-200 text-green-600",
    };
  }
  const allocationStatus = getAllocationStatus({
    preview: allocation.quantidadePrevista,
    actual: allocation.quantidade,
  });

  return (
    <div key={allocation.idMaterial} className="w-full flex flex-col gap-1">
      <div className="flex w-full items-start lg:items-center justify-between gap-y-1 gap-x-2 p-2 flex-col lg:flex-row">
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "bg-primary text-primary-foreground flex items-center gap-1 rounded-lg px-2 py-1 text-xs min-w-fit",
              allocationStatus.color,
            )}
          >
            <h3 className="text-xs font-bold">{allocationStatus.text}</h3>
          </div>
          <h1 className="text-sm leading-none font-medium tracking-tight">{allocation.nome}</h1>
        </div>
        <div className="w-full lg:w-fit flex items-center gap-y-1 gap-x-2 flex-col lg:flex-row">
          <div className={cn("text-primary flex items-center gap-1 rounded-lg px-2 py-1")}>
            <Box className="h-4 w-4" />
            <h3 className="text-xs font-medium">
              {formatDecimalPlaces(allocation.quantidadePrevista)} {allocation.unidade || "UN"}{" "}
              PREVISTOS
            </h3>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div
                className={cn(
                  "bg-primary text-primary-foreground flex items-center gap-1 rounded-lg px-2 py-1",
                )}
              >
                <Box className="h-4 w-4" />
                <h3 className="text-xs font-bold">
                  {formatDecimalPlaces(allocation.quantidade)} {allocation.unidade || "UN"}
                </h3>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-tight">MOVIMENTAÇÕES</p>
              <div className="flex flex-col gap-1">
                {allocation.movimentacoes.map((movement) => (
                  <p
                    key={`${movement.idCompra}-${movement.idFormularioSaida}`}
                    className="text-foreground text-[0.65rem] lg:text-xs"
                  >
                    {formatDecimalPlaces(movement.quantidade)}
                    {allocation.unidade || "UN"} - VIA{" "}
                    {movement.idCompra ? "COMPRA" : "FORMULÁRIO DE SAÍDA"}
                  </p>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
