"use client";

import { Builder } from "@/components/builder";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Cable,
  CheckCircle2,
  CreditCard,
  Cpu,
  Home,
  Landmark,
  ScrollText,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { NEW_PROJECT_STAGE_ORDER, type TNewProjectStage } from "./types";
import { createDirectProject } from "./utils/submit-project";
import { validateFullDirectProject } from "./utils/validation";
import { useNovoProjetoBuilder } from "./useNovoProjetoBuilder";
import { ClienteStage } from "./stages/ClienteStage";
import { EstruturaStage } from "./stages/EstruturaStage";
import { PadraoStage } from "./stages/PadraoStage";
import { PagamentoStage } from "./stages/PagamentoStage";
import { RevisaoStage } from "./stages/RevisaoStage";
import { SistemaStage } from "./stages/SistemaStage";
import { VendaStage } from "./stages/VendaStage";
import { StageErrors } from "./stages/shared";

const stages = {
  cliente: { id: "cliente", label: "Cliente", icon: UserRound },
  venda: { id: "venda", label: "Venda", icon: ScrollText },
  padrao: { id: "padrao", label: "Padrão", icon: Cable },
  estrutura: { id: "estrutura", label: "Estrutura", icon: Home },
  sistema: { id: "sistema", label: "Sistema", icon: Cpu },
  pagamento: { id: "pagamento", label: "Pagamento", icon: CreditCard },
  revisao: { id: "revisao", label: "Revisão", icon: CheckCircle2 },
} satisfies Record<
  TNewProjectStage,
  { id: TNewProjectStage; label: string; icon: typeof UserRound }
>;

export default function NovoProjetoPageClient() {
  const { status } = useSession();
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  return <NovoProjetoPageContent />;
}

function NovoProjetoPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const builder = useNovoProjetoBuilder();
  const {
    draft,
    currentStage,
    setCurrentStage,
    furthestStageIndex,
    setFurthestStageIndex,
    updateClient,
    updateClientData,
    updateProjectWith,
    validation,
  } = builder;

  const createMutation = useMutation({
    mutationKey: ["create-direct-project"],
    mutationFn: async () => createDirectProject(draft.project),
    onSuccess: async (response) => {
      toast.success(response.message);
      await queryClient.invalidateQueries({ queryKey: ["projects-by-filters"] });
      await router.push("/gestao-de-projetos/banco-de-dados");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleNext() {
    const result = builder.goNext();
    if (result && !result.valid) {
      toast.error(result.errors[0]);
    }
  }

  function handleSubmit() {
    const result = validateFullDirectProject(draft);
    if (!result.valid) {
      toast.error(result.errors[0]);
      return;
    }
    createMutation.mutate();
  }

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 bg-background p-4 lg:p-6">
      <header className="flex w-full flex-col gap-3 border-b border-primary/15 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground">
            <Landmark className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Gestão de projetos</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-primary lg:text-3xl">
            NOVO PROJETO DIRETO
          </h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/gestao-de-projetos/banco-de-dados")}
        >
          <ArrowLeft className="h-4 w-4" />
          VOLTAR AO BANCO
        </Button>
      </header>

      <Builder.Root
        stages={stages}
        stageOrder={NEW_PROJECT_STAGE_ORDER}
        currentStage={currentStage}
        onStageChange={setCurrentStage}
        furthestStageIndex={furthestStageIndex}
        onFurthestStageIndexChange={setFurthestStageIndex}
        className="flex min-h-0 grow flex-col gap-4"
      >
        <Builder.Stepper />
        <Builder.Panel>
          <Builder.Stage>
            <StageErrors errors={validation.errors} />
            {currentStage === "cliente" ? (
              <ClienteStage
                draft={draft}
                updateClient={updateClient}
                updateClientData={updateClientData}
              />
            ) : null}
            {currentStage === "venda" ? (
              <VendaStage project={draft.project} updateProjectWith={updateProjectWith} />
            ) : null}
            {currentStage === "padrao" ? (
              <PadraoStage project={draft.project} updateProjectWith={updateProjectWith} />
            ) : null}
            {currentStage === "estrutura" ? (
              <EstruturaStage project={draft.project} updateProjectWith={updateProjectWith} />
            ) : null}
            {currentStage === "sistema" ? (
              <SistemaStage project={draft.project} updateProjectWith={updateProjectWith} />
            ) : null}
            {currentStage === "pagamento" ? (
              <PagamentoStage project={draft.project} updateProjectWith={updateProjectWith} />
            ) : null}
            {currentStage === "revisao" ? <RevisaoStage draft={draft} /> : null}
            <Builder.Footer
              onNext={currentStage === "revisao" ? undefined : handleNext}
              showNext={currentStage !== "revisao"}
              actions={
                currentStage === "revisao" ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {createMutation.isPending ? "Criando projeto..." : "Criar projeto"}
                  </Button>
                ) : null
              }
            />
          </Builder.Stage>
        </Builder.Panel>
      </Builder.Root>
    </div>
  );
}
