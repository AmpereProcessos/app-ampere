import ErrorPage from "@/components/utils/ErrorPage";
import LoadingPage from "@/components/utils/LoadingPage";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useOpenPropertyTemporaryUsageByPropertyId } from "@/utils/methods/query/properties";
import { useRouter } from "next/router";

import { PropertyUsageProvider, TPropertyUsageStore } from "@/utils/stores/property-usage";
import VehicleUsage from "@/components/identificador/propriedades/usos-temporarios/VehicleUsage";

function PublicPropertyTemporaryUsagePage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") return <ErrorPage msg="ID da propriedade não informado." />;

  return <PublicPropertyTemporaryUsagePageContent id={id as string} />;
}

export default PublicPropertyTemporaryUsagePage;

type PublicPropertyTemporaryUsagePageContentProps = {
  id: string;
};
function PublicPropertyTemporaryUsagePageContent({
  id,
}: PublicPropertyTemporaryUsagePageContentProps) {
  const {
    data: openUsage,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useOpenPropertyTemporaryUsageByPropertyId({ id });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage msg={getErrorMessage(error)} />;

  if (isSuccess) {
    // Preparar dados iniciais para a store
    const openUsageRegistry = openUsage.openUsage;
    let initialPropertyUsage: TPropertyUsageStore["propertyUsage"] = {
      propriedade: {
        id: "",
        nome: "",
        identificador: "",
        imagemUrl: "",
      },
      metadados: {
        tipo: "USO DE VEÍCULO",
        kmInicial: 0,
      },
      autor: {
        id: "",
        nome: "",
        telefone: "",
        cpf: "",
        avatar_url: null,
      },
      dataInsercao: new Date().toISOString(),
      responsaveis: [],
      arquivos: [],
      justificativa: null,
      dataFim: null,
    };

    if (openUsageRegistry) {
      // Se existe um registro de uso aberto, inicializa com esses dados
      initialPropertyUsage = {
        propriedade: openUsageRegistry.propriedade,
        metadados: openUsageRegistry.metadados,
        responsaveis: openUsageRegistry.responsaveis,
        autor: openUsageRegistry.autor,
        dataInsercao: openUsageRegistry.dataInsercao,
        dataFim: openUsageRegistry.dataFim,
        arquivos: openUsageRegistry.arquivos,
        justificativa: openUsageRegistry.justificativa,
      };
    } else {
      // Se não existe registro aberto, inicializa apenas com os dados da propriedade
      initialPropertyUsage = {
        propriedade: {
          id: openUsage.property._id,
          nome: openUsage.property.nome,
          identificador: openUsage.property.identificador,
          imagemUrl: openUsage.property.imagemUrl,
        },
        metadados: {
          tipo: "USO DE VEÍCULO",
          kmInicial: openUsage.property.metadados.kmAcumulado,
        },
        autor: {
          id: "",
          nome: "",
          telefone: "",
          cpf: "",
          avatar_url: null,
        },
        dataInsercao: new Date().toISOString(),
        responsaveis: [],
        arquivos: [],
        justificativa: null,
        dataFim: null,
      };
    }

    return (
      <PropertyUsageProvider propertyUsage={initialPropertyUsage} attachments={[]}>
        {openUsage.property.metadados.tipo === "VEÍCULO" ? (
          <VehicleUsage usageId={openUsage.openUsage?._id} property={openUsage.property} />
        ) : (
          <p className="w-full text-center text-sm font-light tracking-tight">
            Tipo de uso não suportado.
          </p>
        )}
      </PropertyUsageProvider>
    );
  } else return <></>;
}
