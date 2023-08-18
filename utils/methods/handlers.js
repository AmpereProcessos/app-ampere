import axios, { AxiosError } from "axios";
import createHttpError from "http-errors";

export function errorHandler(err, res) {
  console.log("ERRO", err);
  if (createHttpError.isHttpError(err) && err.expose) {
    // Lidar com os erros lançados pelo módulo http-errors
    return res.status(err.statusCode).json({ error: { message: err.message } });
  } else {
    // Erro de servidor padrão 500
    return res.status(500).json({
      error: { message: "Internal Server Error", err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
}
export function getErrorMessage(error) {
  console.log(error);
  if (createHttpError.isHttpError(error) && error.expose) return error.message;
  if (error instanceof AxiosError) return error.message;
  return "Houve um erro desconhecido, por favor, comunique o setor de tecnologia.";
}
async function updateProject({ idCRMProject, changes }) {
  try {
    const { data } = await axios.post(
      `/api/crm/updateProjects?projectId=${idCRMProject}`,
      {
        changes,
      }
    );
    return "ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !";
  } catch (error) {
    return "HOUVE NA ATUALIZAÇÃO DO PROJETO CRM";
  }
}
async function updatePropose({ idCRMPropose, changes }) {
  try {
    const { data } = await axios.post(
      `/api/crm/updateProposes?proposeId=${idCRMPropose}`,
      {
        changes,
      }
    );
    return "ATUALIZAÇÕES DA PROPOSTA CRM BEM SUCEDIDAS !";
  } catch (error) {
    return "HOUVE NA ATUALIZAÇÃO DO PROPOSTA CRM";
  }
}
export async function handleCRMProjectUpdatesAutomations({
  projectId,
  idCRMProject,
  idCRMPropose,
  newData,
  previousData,
}) {
  if (!idCRMProject) return;
  if (!newData || !previousData) return;

  // Checking for signature event
  if (
    newData["contrato.status"] == "ASSINADO" ||
    !!newData["contrato.dataAssinatura"]
  ) {
    const changes = {
      contrato: {
        id: projectId,
        idProposta: idCRMPropose,
        dataAssinatura: newData["contrato.dataAssinatura"]
          ? newData["contrato.dataAssinatura"]
          : previousData.contrato?.dataAssinatura,
      },
    };
    const pipeline = [
      {
        $set: changes,
      },
    ];
    await updateProject({ idCRMProject: idCRMProject, changes: changes });
    // if (idCRMPropose)
    //   await updatePropose({ idCRMPropose: idCRMPropose, changes: changes });
    if (previousData.vendedor)
      await notifySellerInCRM(
        previousData.vendedor.nome,
        idCRMProject,
        "CONTRATO ATUALIZADO COMO ASSINADO."
      );
    return;
  }

  // Checking for unsigning or rescission
  if (newData["contrato.status"] && newData["contrato.status"] != "ASSINADO") {
    const changes = {
      contrato: null,
    };
    await updateProject({ idCRMProject: idCRMProject, changes: changes });
    // if (idCRMPropose)
    //   updatePropose({ idCRMPropose: idCRMPropose, changes: changes });
  }
}
export async function notifySellerInCRM(sellerName, idCRMProject, message) {
  if (!sellerName || !idCRMProject) return;
  const apiResponse = await axios.post(
    `/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`,
    {
      message: message,
    }
  );
  console.log(apiResponse);
  return apiResponse;
}
