import axios from "axios";
import createHttpError from "http-errors";

export async function debitMaterials({
  formId,
  projectId,
  identifier,
  changes,
  tag,
}) {
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
      idProjeto: projectId,
      tag: tag,
      identificador: identifier,
      changes: updateChangesObj,
    });
    return { status: "success", statusCode: 201 };
  } catch (error) {
    throw error;
  }
}
export async function returnMaterials({ formId, identifier, changes, tag }) {
  console.log("ID DO FORMULÁRIO", formId);
  console.log("MATERIAIS DEBITADOS", changes);
  console.log("TAG DA ALTERAÇÃO", tag);
  try {
    if (!changes)
      throw new createHttpError.BadRequest(
        "Array de mudanças não especificado."
      );
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
    throw error;
  }
}
export async function handleMaterialEntrance({ materialId, newPrice, diff }) {
  try {
    if (!materialId)
      throw new createHttpError.BadRequest("ID do material não fornecido.");
    if (!newPrice)
      throw new createHttpError.BadRequest("Novo preço não fornecido.");
    if (!diff) new createHttpError.BadRequest("Diferença não fornecida.");

    const changes = { id: materialId, price: newPrice, diff: diff };
    const response = await axios.patch("/api/almoxarifado/materiais", {
      changes: changes,
    });
    return "Material atualizado com sucesso!";
  } catch (error) {
    throw error;
  }
}
export async function addMaterial(newMaterialObj) {
  const {
    nome: nome,
    qtde: quantidade,
    qtdeMinima: quantidadeMinima,
    grandeza: grandeza,
    preco: preco,
    codigo: codigo,
    localizacao: localizacao,
    anotacoes: anotacoes,
  } = newMaterialObj;
  try {
    if (!nome) throw new createHttpError.BadRequest("Nome não fornecido.");
    if (!quantidade || Number(quantidade) <= 0)
      throw new createHttpError.BadRequest("Quantidade inválida!");
    if (!preco || Number(preco) <= 0)
      throw new createHttpError.BadRequest("Preço inválido!");
    const response = await axios.post("/api/almoxarifado/novoMaterial", {
      nome: nome,
      qtde: quantidade,
      qtdeMinima: quantidadeMinima,
      grandeza: grandeza,
      preco: preco,
      codigo: codigo,
      localizacao: localizacao,
      anotacoes: anotacoes,
    });
    return "Material adicionado com sucesso !";
  } catch (error) {
    throw error;
  }
}
