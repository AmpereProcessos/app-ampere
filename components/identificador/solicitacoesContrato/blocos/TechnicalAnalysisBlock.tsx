import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { editContractRequest } from "@/utils/methods/mutation/contract-requests";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { fetchTechnicalAnalysisById } from "@/utils/methods/query/technical-analysis";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import TechnicalAnalysis from "./TechnicalAnalysis";

type TechnicalAnalysisBlockProps = {
  infoHolder: TContractRequestDTO;
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>;
  userHasEditPermission: boolean;
};
function TechnicalAnalysisBlock({
  infoHolder,
  setInfoHolder,
  userHasEditPermission,
}: TechnicalAnalysisBlockProps) {
  const queryClient = useQueryClient();
  const [analysisIdHolder, setAnalysisIdHolder] = useState<string | null>(
    infoHolder.idVisitaTecnica ? infoHolder.idVisitaTecnica : null,
  );

  async function handleAnalysisVinculation(analysisId: string) {
    try {
      if (analysisId.trim().length < 10) return toast.error("Preencha um ID válido.");
      const analysis = await fetchTechnicalAnalysisById({ id: analysisId });
      const updateData = {
        ...infoHolder,
        nomeDoProjeto: analysis.nome,
        visitaTecnica: "REALIZADA",
        respVisitaTecnica: analysis.analista?.nome,
        materialEstrutura: analysis.detalhes.tipoEstrutura,
        tipoDaTelha: analysis.detalhes.tipoTelha,
        idVisitaTecnica: analysisId,
      };
      const resp = await editContractRequest({ id: infoHolder._id, changes: { ...updateData } });

      return "Análise vinculada com sucesso !";
    } catch (error) {
      console.error("Error vinculating technical analysis", error);
      return toast.error("Erro ao vincular análise técnica.");
    }
  }
  const { mutate: handleVinculate, isPending } = useMutationWithFeedback({
    mutationKey: ["vinculate-technical-analysis"],
    mutationFn: handleAnalysisVinculation,
    queryClient: queryClient,
    affectedQueryKey: ["contract-request-by-id", infoHolder._id],
  });
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES DE ANÁLISE TÉCNICA"
      sectionTitleIcon={<ClipboardCheck className="h-4 w-4 min-h-4 min-w-4" />}
    >
      <div className="border-border flex w-[90%] flex-col items-center gap-2 self-center rounded border p-3 md:w-[85%] lg:w-[50%]">
        <TextInput
          label="ID DE ANÁLISE TÉCNICA"
          placeholder="Preencha aqui, se aplicavél, o ID da análise técnica do projeto."
          value={analysisIdHolder || ""}
          handleChange={(value) => setAnalysisIdHolder(value)}
          width="100%"
        />

        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              // @ts-ignore
              handleVinculate(analysisIdHolder);
            }}
            className="disabled:bg-primary/60 h-9 rounded bg-blue-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-blue-800 enabled:hover:text-white disabled:text-white"
          >
            VINCULAR
          </button>
        </div>
      </div>
      {infoHolder.idVisitaTecnica && infoHolder.idVisitaTecnica?.trim().length > 12 ? (
        <TechnicalAnalysis analysisId={infoHolder.idVisitaTecnica} />
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}

export default TechnicalAnalysisBlock;
