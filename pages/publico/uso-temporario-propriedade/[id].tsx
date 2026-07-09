import VehicleUsage from "@/components/identificador/propriedades/usos-temporarios/VehicleUsage";
import ErrorPage from "@/components/utils/ErrorPage";
import {
  getTemporaryUsageByPropertyRoute,
  type TGetTemporaryUsageByPropertyOutput,
} from "@/pages/api/propriedades/uso-temporario/propriedade";
import { getErrorMessage } from "@/utils/methods/handlers";
import { PropertyUsageProvider, type TPropertyUsageStore } from "@/utils/stores/property-usage";
import type { GetServerSidePropsContext } from "next";

type PublicPropertyTemporaryUsagePageProps = {
  openUsage: TGetTemporaryUsageByPropertyOutput["data"] | null;
  errorMessage: string | null;
};

function PublicPropertyTemporaryUsagePage({
  openUsage,
  errorMessage,
}: PublicPropertyTemporaryUsagePageProps) {
  if (errorMessage) return <ErrorPage msg={errorMessage} />;
  if (!openUsage) return <></>;

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
}

export default PublicPropertyTemporaryUsagePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  if (!id || typeof id !== "string") {
    return {
      props: {
        openUsage: null,
        errorMessage: "ID da propriedade não informado.",
      } satisfies PublicPropertyTemporaryUsagePageProps,
    };
  }

  try {
    const result = await getTemporaryUsageByPropertyRoute({
      params: { openUsagePropertyId: id },
    });

    return {
      props: {
        openUsage: JSON.parse(JSON.stringify(result.data)),
        errorMessage: null,
      } satisfies PublicPropertyTemporaryUsagePageProps,
    };
  } catch (error) {
    return {
      props: {
        openUsage: null,
        errorMessage: getErrorMessage(error),
      } satisfies PublicPropertyTemporaryUsagePageProps,
    };
  }
}
