import axios from "axios";
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
  idCRMProject,
  idCRMPropose,
  newData,
  previousData,
}) {
  if (!idCRMProject) return;
  if (!newData || !previousData) return;

  // Checking for signature event
  if (
    newData["contrato.status"] == "ASSINADO" &&
    previousData.contrato?.status != "ASSINADO"
  ) {
    const changes = {
      assinado: true,
      dataAssinatura: new Date().toISOString(),
    };
    await updateProject({ idCRMProject: idCRMProject, changes: changes });
    if (idCRMPropose)
      updatePropose({ idCRMPropose: idCRMPropose, changes: changes });
    return;
  }

  // Checking for unsigning or rescission
  if (
    newData["contrato.status"] != "ASSINADO" &&
    previousData.contrato?.status == "ASSINADO"
  ) {
    const changes = {
      assinado: false,
      dataAssinatura: null,
    };
    await updateProject({ idCRMProject: idCRMProject, changes: changes });
    if (idCRMPropose)
      updatePropose({ idCRMPropose: idCRMPropose, changes: changes });
  }
}
