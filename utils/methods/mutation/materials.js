import axios from "axios";
import createHttpError from "http-errors";

export async function debitMaterials({ formId, identifier, changes, tag }) {
  console.log("ID DO FORMULÁRIO", formId);
  console.log("MATERIAIS DEBITADOS", changes);
  console.log("TAG DA ALTERAÇÃO", tag);
  try {
    if (!changes)
      throw new createHttpError.BadRequest(
        "Array de mudanças não específicado."
      );
    const filteredChangesByStockableItems = changes.filter(
      (change) => !!change.id
    );
    const updateChangesObj = filteredChangesByStockableItems.map((x) => {
      return {
        id: x.id,
        diff: -x.qtdeSaida,
      };
    });
    console.log("UPDATE CHANGE OBJ", updateChangesObj);
    await axios.post("/api/almoxarifado/materiais", {
      idFormulario: formId,
      tag: tag,
      identificador: identifier,
      changes: updateChangesObj,
    });
    return { status: "success", statusCode: 201 };
  } catch (error) {
    if (createHttpError.isHttpError(error)) throw error;
    else new createHttpError.InternalServerError("Erro desconhecido.");
  }
}
export async function returnMaterials({ formId, identifier, changes, tag }) {
  console.log("ID DO FORMULÁRIO", formId);
  console.log("MATERIAIS DEBITADOS", changes);
  console.log("TAG DA ALTERAÇÃO", tag);
  try {
    if (!changes)
      return {
        status: "fail",
        statusCode: 400,
        message: "Array de mudanças não especificado.",
      };
    const filteredChangesByStockableItems = changes.filter(
      (change) => !!change.id
    );
    const updateChangesObj = filteredChangesByStockableItems.map((x) => {
      return {
        id: x.id,
        diff: x.qtdeDevolucao,
      };
    });
    console.log("UPDATE CHANGE OBJ", updateChangesObj);
    await axios.post("/api/almoxarifado/materiais", {
      idFormulario: formId,
      tag: tag,
      identificador: identifier,
      changes: updateChangesObj,
    });
    return { status: "success", statusCode: 201 };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      message: "Erro ao retornar materiais.",
    };
  }
}
