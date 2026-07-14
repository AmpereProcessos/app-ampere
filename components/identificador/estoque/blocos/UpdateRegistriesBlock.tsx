import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { useMaterialLogs } from "@/utils/methods/query/materials";
import React from "react";

import { FileStack } from "lucide-react";
import UpdateRegistriesCard from "./UpdateRegistriesCard";

type UpdateRegistriesProps = {
  materialId: string;
};
function UpdateRegistries({ materialId }: UpdateRegistriesProps) {
  const { data: logs, isLoading, isError, isSuccess } = useMaterialLogs(materialId);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="bg-primary/20 flex w-fit items-center justify-start gap-2 rounded-lg px-4 py-1.5">
        <FileStack className="h-4 min-h-4 w-4 min-w-4" />
        <h1 className="w-full text-start text-xs leading-none font-medium tracking-tight">
          REGISTROS DE ATUALIZAÇÕES
        </h1>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={"Erro ao buscar registros de atualização."} /> : null}
      {isSuccess ? (
        <div className="w-full flex flex-col gap-2">
          {logs.length > 0 ? (
            logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} />)
          ) : (
            <p className="text-foreground w-full text-center font-medium tracking-tight italic">
              Não há registros de atualizações.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default UpdateRegistries;
