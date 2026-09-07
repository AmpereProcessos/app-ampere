import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import NumberInput from "@/components/inputs/Number";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { formatDecimalPlaces } from "@/utils/constants";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createPurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import { createWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { usePurchaseControlByProjectId } from "@/utils/methods/query/purchase-controls";
import { useWarehouseFormsByProjectId } from "@/utils/methods/query/warehouse-forms";
import type { TServiceOrderProject } from "@/utils/schemas/service-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Box,
  Info,
  NotepadText,
  PackagePlus,
  Plus,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axios from "axios";
import ProjectAllocationsTable from "./ProjectAllocationsTable";

export default function ServiceOrderProjectAllocationsList({
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
  const [newAllocationMenuIsOpen, setNewAllocationMenuIsOpen] = useState(true);
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

      const response = await axios.post<{ data: typeof currentAllocations }>(
        "/api/projects/allocations",
        {
          projectId: project._id,
          materialId: newAllocation.idMaterial,
          quantidadePrevista: newAllocation.quantidadePrevista,
        },
      );
      return response.data.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["service-order-project", project._id] });
    },
    onSuccess: (updatedAllocations) => {
      setCurrentAllocations(updatedAllocations);
      setNewAllocationMenuIsOpen(true);
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
        <ProjectAllocationsTable
          allocations={currentAllocations}
          projectId={project._id}
          onSaved={(materialId, quantity) => {
            setCurrentAllocations((rows) =>
              rows.map((row) =>
                row.idMaterial === materialId ? { ...row, quantidadePrevista: quantity } : row,
              ),
            );
          }}
        />
        {newAllocationMenuIsOpen ? (
          <div className="grid w-full grid-cols-1 items-end gap-3 border-t border-dashed border-border bg-muted/20 p-3 lg:grid-cols-[minmax(0,1fr)_160px_auto]">
            <MaterialSelector
              key={newAllocation.idMaterial || "new-allocation"}
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
      </div>
    </div>
  );
}
