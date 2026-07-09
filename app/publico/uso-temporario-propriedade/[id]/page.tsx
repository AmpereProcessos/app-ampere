import ErrorPage from "@/components/utils/ErrorPage";
import {
  getTemporaryUsageByPropertyRoute,
  type TGetTemporaryUsageByPropertyOutput,
} from "@/pages/api/propriedades/uso-temporario/propriedade";
import { getErrorMessage } from "@/utils/methods/handlers";
import { type TPropertyUsageStore } from "@/utils/stores/property-usage";
import PublicTemporaryPropertyUsagePage from "./public-temporary-property-usage-page";

export const dynamic = "force-dynamic";

type PublicPropertyTemporaryUsagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicPropertyTemporaryUsagePage({
  params,
}: PublicPropertyTemporaryUsagePageProps) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return <ErrorPage msg="ID da propriedade não informado." />;
  }

  let openUsage: TGetTemporaryUsageByPropertyOutput["data"] | null = null;
  try {
    const result = await getTemporaryUsageByPropertyRoute({
      params: { openUsagePropertyId: id },
    });
    openUsage = JSON.parse(JSON.stringify(result.data));
  } catch (error) {
    return <ErrorPage msg={getErrorMessage(error)} />;
  }

  if (!openUsage) return <ErrorPage msg="Uso temporário não encontrado." />;

  const openUsageRegistry = openUsage.openUsage;
  let initialPropertyUsage: TPropertyUsageStore["propertyUsage"];

  if (openUsageRegistry) {
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
    <PublicTemporaryPropertyUsagePage
      initialPropertyUsage={initialPropertyUsage}
      openUsage={openUsage}
    />
  );
}
