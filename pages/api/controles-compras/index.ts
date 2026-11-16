import { groupPurchaseStock, stockEntryQuantity, stockEntryValue } from "@/lib/projects/purchase-stock";
import { syncServiceOrdersDeliveryRelease } from "@/lib/service-orders/delivery-release";
import {
  assertPurchaseRevision,
  isPurchaseMaterialId,
  preservePurchaseAllocationMetadata,
  purchaseCompositionChanged,
  purchaseMaterialError,
  validatePurchaseComposition,
  validatePurchaseMaterialCatalog,
} from "@/lib/projects/purchase-materials";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import type { TAuthSession } from "@/lib/authentication/types";
import { notifyMaterialBelowMinimumIfCrossed } from "@/lib/notifications/materials";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import {
  GeneralPurchaseControlSchema,
  PurchaseControlKanbanSimplifiedProjection,
  PurchaseControlSimplifiedProjection,
  type TPurchaseControl,
  type TPurchaseControlWithProjectDTO,
} from "@/utils/schemas/purchases";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type ClientSession, type Collection, type Db, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
  data: TPurchaseControlWithProjectDTO | TPurchaseControl[];
};
const getPurchasesControlsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthenticationWithSession(req, res);
  console.log(req.query);
  const { id, projectId, queryTags, queryPendingConclusion } = req.query;
  const db: Db = await connectToDatabase();
  const collection = db.collection<TPurchaseControl>("controles-compras");

  if (id) {
    if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

    const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
    const lookup = {
      from: "dados",
      localField: "projectIdAsObjectId",
      foreignField: "_id",
      as: "projetoDados",
    };
    const purchaseControlArr = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $addFields: addFields },
        { $lookup: lookup },
        {
          $project: {
            status: 1,
            revisao: 1,
            titulo: 1,
            anotacoes: 1,
            projeto: 1,
            etiquetas: 1,
            atualizacoes: 1,
            totalPrevisto: 1,
            liberacao: 1,
            composicao: 1,
            dataRequisicaoPagamento: 1,
            dataLiberacaoPagamento: 1,
            dataPagamento: 1,
            dataPedido: 1,
            fornecedor: 1,
            total: 1,
            transporte: 1,
            faturamentos: 1,
            entrega: 1,
            autor: 1,
            dataInsercao: 1,
            dataEfetivacao: 1,
            "projetoDados._id": 1,
            "projetoDados.nomeDoContrato": 1,
            "projetoDados.qtde": 1,
            "projetoDados.cpf_cnpj": 1,
            "projetoDados.inscricaoRural": 1,
            "projetoDados.tipoDeServico": 1,
            "projetoDados.telefone": 1,
            "projetoDados.email": 1,
            "projetoDados.cep": 1,
            "projetoDados.uf": 1,
            "projetoDados.cidade": 1,
            "projetoDados.bairro": 1,
            "projetoDados.logradouro": 1,
            "projetoDados.numeroResidencia": 1,
            "projetoDados.pagamento.pagador": 1,
            "projetoDados.pagamento.contatoPagador": 1,
            "projetoDados.pagamento.cpf_cnpjPagador": 1,
            "projetoDados.pagamento.forma": 1,
            "projetoDados.pagamento.metodo": 1,
            "projetoDados.pagamento.credor": 1,
            "projetoDados.pagamento.credorNomeGerente": 1,
            "projetoDados.pagamento.credorContatoGerente": 1,
            "projetoDados.pagamento.negociacao": 1,
            "projetoDados.obra.observacoes": 1,
            "projetoDados.produtos": 1,
            "projetoDados.idVisitaTecnica": 1,
          },
        },
      ])
      .toArray();
    const purchaseControl = purchaseControlArr.map((p) => ({
      ...p,
      projetoDados: p.projetoDados[0],
    }))[0] as TPurchaseControlWithProjectDTO | undefined;
    // const purchaseControl = await collection.findOne({ _id: new ObjectId(id) })
    if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
    const dbClient = await clientPromise;
    const stockEntries = await dbClient
      .db("almoxarifado")
      .collection<TMaterialUpdateRegistry>("alteracoes")
      .find({ idCompra: id, tipo: "ENTRADA" })
      .sort({ dataInsercao: -1 })
      .toArray();
    const compositionWithStockEntries = purchaseControl.composicao.map((item) => ({
      ...item,
      entradasEstoque: stockEntries
        .filter((entry) => entry.material.id === item.materialId)
        .map((entry) => ({
          ...entry,
          _id: entry._id.toString(),
          alteracao:
            typeof entry.qtdeAnterior === "number" && typeof entry.qtdeNovo === "number"
              ? entry.qtdeNovo - entry.qtdeAnterior
              : entry.alteracao,
        })),
    }));

    return res.status(200).json({
      data: {
        ...purchaseControl,
        composicao: compositionWithStockEntries,
      } as TPurchaseControlWithProjectDTO,
    });
  }
  if (projectId) {
    if (typeof projectId !== "string" || !ObjectId.isValid(projectId))
      throw new createHttpError.BadRequest("ID do projeto inválido.");

    const purchaseControls = await collection
      .find({ "projeto.id": projectId }, { projection: PurchaseControlSimplifiedProjection })
      .toArray();

    return res.status(200).json({ data: purchaseControls });
  }

  const queryTagsIds = typeof queryTags === "string" ? queryTags.split(",").filter((q) => !!ObjectId.isValid(q)) : [];
  const queryPendingConclusionValue = queryPendingConclusion === "true";

  const queryTagsQuery: Filter<TPurchaseControl> =
    queryTagsIds.length > 0 ? { "etiquetas.id": { $in: queryTagsIds } } : {};
  const queryPendingConclusionQuery: Filter<TPurchaseControl> = queryPendingConclusionValue
    ? { dataEfetivacao: null }
    : {};
  console.log(queryTagsQuery);
  console.log(queryPendingConclusionQuery);
  const purchaseControls = await collection
    .find(
      { ...queryTagsQuery, ...queryPendingConclusionQuery },
      {
        projection: PurchaseControlKanbanSimplifiedProjection,
      },
    )
    .toArray();

  return res.status(200).json({ data: purchaseControls });
};

type PostResponse = {
  data: { insertedId: string };
  message: string;
};

const createPurchaseControlRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const userSession = await validateAuthenticationWithSession(req, res);
  const purchaseControl = GeneralPurchaseControlSchema.parse(req.body);
  validatePurchaseComposition(purchaseControl.composicao);
  const client = await clientPromise;
  const db = client.db("projetos");
  const warehouse = client.db("almoxarifado");
  const collection = db.collection<TPurchaseControl>("controles-compras");
  const materialsCollection = warehouse.collection<TMaterial>("material");
  const dbSession = client.startSession();
  let insertedId = "";
  try {
    await dbSession.withTransaction(async () => {
      await validatePurchaseMaterialCatalog(purchaseControl.composicao, materialsCollection, dbSession);
      const purchase = {
        ...purchaseControl,
        revisao: 0,
        composicao: purchaseControl.composicao.map((item) => ({ ...item, dataAlocacao: null, qtdeAlocada: 0 })),
        registrosStatus: { [purchaseControl.status]: { entrada: new Date().toISOString() } },
      };
      const result = await collection.insertOne(purchase, { session: dbSession });
      if (!result.acknowledged) throw new createHttpError.InternalServerError("Não foi possível criar a compra.");
      insertedId = result.insertedId.toString();
      if (purchase.entrega.dataEfetivacao)
        await handlePurchaseControlAllocationsImproved({
          type: "ALLOCATING",
          purchaseControlId: insertedId,
          purchaseControlTitle: purchase.titulo,
          purchaseControlDeliveryDate: purchase.entrega.dataEfetivacao,
          purchaseControlComposition: purchase.composicao,
          projectId: purchase.projeto.id,
          purchaseControlsCollection: collection,
          projectsCollection: db.collection<TProject>("dados"),
          materialsCollection,
          materialsLogsCollection: warehouse.collection<TMaterialUpdateRegistry>("alteracoes"),
          dbSession,
          userSession,
        });
    });
  } finally {
    await dbSession.endSession();
  }
  return res.status(201).json({ data: { insertedId }, message: "Controle de compra criado com sucesso !" });
};

type PutResponse = {
  message: string;
};
const updatePurchaseControlRoute: NextApiHandler<PutResponse> = async (req, res) => {
  console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando atualização do controle de compra.");
  const session = await validateAuthenticationWithSession(req, res);

  const { id } = req.query;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

  console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] ID recebido: ${id}`);

  const { revisao: expectedRevision, ...changes } = GeneralPurchaseControlSchema.partial().parse(req.body);
  console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Mudanças recebidas para update:", changes);

  const dbClient = await clientPromise;
  const db: Db = dbClient.db("projetos");
  const warehouseDb: Db = dbClient.db("almoxarifado");
  const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
  const projectsCollection = db.collection<TProject>("dados");

  const materialsCollection = warehouseDb.collection<TMaterial>("material");
  const materialsLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

  const dbSession = dbClient.startSession();

  try {
    console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando transação para controle de compra ${id}`);
    await dbSession.withTransaction(async () => {
      console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Buscando controle de compra anterior: ${id}`);
      const previousPurchaseControl = await purchaseControlsCollection.findOne(
        { _id: new ObjectId(id) },
        { session: dbSession },
      );

      if (!previousPurchaseControl) {
        console.error(`[ERROR] [UPDATE-PURCHASE-CONTROL] Controle de compra não encontrado: ${id}`);
        throw new createHttpError.NotFound("Controle de compra não encontrado.");
      }
      if (changes.composicao) {
        assertPurchaseRevision(expectedRevision, previousPurchaseControl.revisao);
        validatePurchaseComposition(changes.composicao, previousPurchaseControl.composicao);
        await validatePurchaseMaterialCatalog(
          changes.composicao,
          materialsCollection,
          dbSession,
          previousPurchaseControl.composicao,
        );
        changes.composicao = preservePurchaseAllocationMetadata(changes.composicao, previousPurchaseControl.composicao);
      }
      if (
        changes.projeto &&
        (changes.projeto.id || null) !== (previousPurchaseControl.projeto.id || null) &&
        previousPurchaseControl.entrega.dataEfetivacao
      ) {
        throw new createHttpError.BadRequest("Desfaça a entrega antes de mudar o projeto de destino da compra.");
      }
      console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra anterior encontrado:", previousPurchaseControl);

      console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Atualizando controle de compra: ${id} com mudanças:`, changes);
      const updateResponse = await purchaseControlsCollection.updateOne(
        {
          _id: new ObjectId(id),
          ...(changes.composicao ? { revisao: previousPurchaseControl.revisao ?? { $exists: false } } : {}),
        },
        { $set: { ...changes }, $inc: { revisao: 1 } },
        { session: dbSession },
      );
      if (updateResponse.matchedCount === 0) {
        throw new createHttpError.Conflict(
          "Esta compra foi alterada por outra operação. Reabra a compra antes de salvar.",
        );
      }
      if (!updateResponse.acknowledged) {
        console.error(`[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao atualizar controle de compra: ${id}`);
        throw new createHttpError.InternalServerError(
          "Oops, houve um erro desconhecido ao atualizar controle de compra.",
        );
      }

      console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra atualizado: ${id}`);
      const updatedPurchaseControl = await purchaseControlsCollection.findOne(
        { _id: new ObjectId(id) },
        { session: dbSession },
      );
      if (!updatedPurchaseControl) {
        console.error(`[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao buscar controle de compra atualizado: ${id}`);
        throw new createHttpError.InternalServerError(
          "Oops, houve um erro desconhecido ao atualizar controle de compra.",
        );
      }
      console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra atualizado encontrado:", updatedPurchaseControl);

      const isAllocating =
        !previousPurchaseControl?.entrega.dataEfetivacao && updatedPurchaseControl.entrega.dataEfetivacao;
      if (
        (previousPurchaseControl.entrega.dataEfetivacao || null) !==
          (updatedPurchaseControl.entrega.dataEfetivacao || null) &&
        updatedPurchaseControl.projeto.id
      ) {
        const projectId = new ObjectId(updatedPurchaseControl.projeto.id);
        await projectsCollection.updateOne(
          { _id: projectId },
          {
            $set: { "compra.dataEntrega": updatedPurchaseControl.entrega.dataEfetivacao || null },
          },
          { session: dbSession },
        );
        const project = await projectsCollection.findOne({ _id: projectId }, { session: dbSession });
        if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
        await syncServiceOrdersDeliveryRelease({
          project,
          serviceOrdersCollection: db.collection<TServiceOrder>("ordensDeServico"),
          session: dbSession,
        });
      }
      const isDeallocating =
        previousPurchaseControl?.entrega.dataEfetivacao && !updatedPurchaseControl.entrega.dataEfetivacao;
      const isUpdating =
        previousPurchaseControl?.entrega.dataEfetivacao &&
        updatedPurchaseControl.entrega.dataEfetivacao &&
        (purchaseCompositionChanged(previousPurchaseControl.composicao, updatedPurchaseControl.composicao) ||
          previousPurchaseControl.entrega.dataEfetivacao !== updatedPurchaseControl.entrega.dataEfetivacao);

      console.log(
        `[INFO] [UPDATE-PURCHASE-CONTROL] Flags - isAllocating: ${isAllocating}, isDeallocating: ${isDeallocating}, isUpdating: ${isUpdating}`,
      );

      if (isAllocating) {
        console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando alocação para controle: ${id}`);
        await handlePurchaseControlAllocationsImproved({
          type: "ALLOCATING",
          purchaseControlId: id,
          purchaseControlTitle: updatedPurchaseControl.titulo,
          purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
          purchaseControlComposition: updatedPurchaseControl.composicao,
          previousComposition: previousPurchaseControl.composicao,
          projectId: updatedPurchaseControl.projeto.id,
          purchaseControlsCollection,
          projectsCollection,
          materialsCollection,
          materialsLogsCollection,
          dbSession,
          userSession: session,
        });
      }
      if (isDeallocating) {
        console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando devolução para controle: ${id}`);
        await handlePurchaseControlAllocationsImproved({
          type: "DEALLOCATING",
          purchaseControlId: id,
          purchaseControlTitle: updatedPurchaseControl.titulo,
          purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
          purchaseControlComposition: updatedPurchaseControl.composicao,
          previousComposition: previousPurchaseControl.composicao,
          projectId: previousPurchaseControl.projeto.id,
          purchaseControlsCollection,
          projectsCollection,
          materialsCollection,
          materialsLogsCollection,
          dbSession,
          userSession: session,
        });
      }
      if (isUpdating) {
        console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando atualização de alocação para controle: ${id}`);
        await handlePurchaseControlAllocationsImproved({
          type: "UPDATING",
          purchaseControlId: id,
          purchaseControlTitle: updatedPurchaseControl.titulo,
          purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
          purchaseControlComposition: updatedPurchaseControl.composicao,
          previousComposition: previousPurchaseControl.composicao,
          projectId: updatedPurchaseControl.projeto.id,
          purchaseControlsCollection,
          projectsCollection,
          materialsCollection,
          materialsLogsCollection,
          dbSession,
          userSession: session,
        });
      }
    });
  } catch (error) {
    console.error(`[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao atualizar controle de compra ${id}:`, error);
    throw error;
  } finally {
    console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Transação finalizada para controle de compra ${id}`);
    await dbSession.endSession();
  }

  console.log(`[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compras atualizado com sucesso: ${id}`);
  return res.status(201).json({ message: "Controle de compras atualizado com sucesso !" });
};

const deletePurchaseControlRoute: NextApiHandler<{ data: string; message: string }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);

  const { id } = req.query;
  console.log("ID PARA DELETE", id);
  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

  const dbClient = await clientPromise;
  const db: Db = dbClient.db("projetos");
  const warehouseDb: Db = dbClient.db("almoxarifado");
  const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
  const projectsCollection = db.collection<TProject>("dados");

  const materialsCollection = warehouseDb.collection<TMaterial>("material");
  const materialsLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

  const dbSession = dbClient.startSession();

  try {
    await dbSession.withTransaction(async () => {
      const currentPurchaseControl = await purchaseControlsCollection.findOne(
        { _id: new ObjectId(id) },
        { session: dbSession },
      );

      // Handling the deallocation for the purchase control in case it was allocated
      if (currentPurchaseControl?.entrega.dataEfetivacao) {
        await handlePurchaseControlAllocationsImproved({
          type: "DEALLOCATING",
          purchaseControlId: id,
          purchaseControlTitle: currentPurchaseControl.titulo,
          purchaseControlDeliveryDate: currentPurchaseControl.entrega.dataEfetivacao,
          purchaseControlComposition: currentPurchaseControl.composicao,
          projectId: currentPurchaseControl.projeto.id,
          purchaseControlsCollection,
          projectsCollection,
          materialsCollection,
          materialsLogsCollection,
          dbSession,
          userSession: session,
        });
      }
      // Then, we delete the purchase control
      const deleteResponse = await purchaseControlsCollection.deleteOne(
        { _id: new ObjectId(id) },
        { session: dbSession },
      );
      if (!deleteResponse.acknowledged)
        throw new createHttpError.InternalServerError(
          "Oops, houve um erro desconhecido ao excluir o controle de compra.",
        );
      if (deleteResponse.deletedCount === 0) throw new createHttpError.NotFound("Controle de compra não encontrado.");
    });
  } catch (error) {
    console.log("[ERROR] [DELETE-PURCHASE-CONTROL] Error deleting purchase control.", error);
    throw error;
  } finally {
    console.log("[INFO] [DELETE-PURCHASE-CONTROL] Transaction ended.");
    await dbSession.endSession();
  }
  return res.status(201).json({
    data: "Controle de compra excluído com sucesso !",
    message: "Controle de compra excluído com sucesso !",
  });
};

type SyncStockEntryResponse = {
  data: { expectedQuantity: number; previousQuantity: number; adjustment: number };
  message: string;
};

const syncPurchaseStockEntryRoute: NextApiHandler<SyncStockEntryResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  const { id } = req.query;
  const { materialId } = req.body as { materialId?: unknown };

  if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID da compra inválido.");
  if (!isPurchaseMaterialId(materialId))
    throw new createHttpError.BadRequest("ID do material inválido.");

  const dbClient = await clientPromise;
  const projectsDb = dbClient.db("projetos");
  const warehouseDb = dbClient.db("almoxarifado");
  const purchaseControlsCollection = projectsDb.collection<TPurchaseControl>("controles-compras");
  const materialsCollection = warehouseDb.collection<TMaterial>("material");
  const materialsLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");
  const dbSession = dbClient.startSession();
  let result = { expectedQuantity: 0, previousQuantity: 0, adjustment: 0 };

  try {
    await dbSession.withTransaction(async () => {
      const purchase = await purchaseControlsCollection.findOne({ _id: new ObjectId(id) }, { session: dbSession });
      if (!purchase) throw new createHttpError.NotFound("Controle de compra não encontrado.");
      if (!purchase.entrega.dataEfetivacao) throw new createHttpError.BadRequest("A compra ainda não foi entregue.");
      if (purchase.projeto.id)
        throw new createHttpError.BadRequest("Esta compra foi alocada a um projeto, não ao estoque.");

      const matchingItems = purchase.composicao.filter((item) => item.materialId === materialId);
      validatePurchaseComposition(matchingItems, matchingItems);
      if (matchingItems.length === 0)
        throw new createHttpError.NotFound("Material não encontrado na composição da compra.");

      const expectedQuantity = matchingItems.reduce((total, item) => total + item.qtde, 0);
      const purchaseUnitPrice =
        expectedQuantity === 0
          ? matchingItems[0].valor
          : matchingItems.reduce((total, item) => total + item.qtde * item.valor, 0) / expectedQuantity;
      const entries = await materialsLogsCollection
        .find({ idCompra: id, tipo: "ENTRADA", "material.id": materialId }, { session: dbSession })
        .toArray();
      const previousQuantity = entries.reduce(
        (total, entry) =>
          total +
          (typeof entry.qtdeAnterior === "number" && typeof entry.qtdeNovo === "number"
            ? entry.qtdeNovo - entry.qtdeAnterior
            : entry.alteracao),
        0,
      );
      const adjustment = expectedQuantity - previousQuantity;
      result = { expectedQuantity, previousQuantity, adjustment };

      if (adjustment === 0) return;

      const material = await materialsCollection.findOne({ _id: new ObjectId(materialId) }, { session: dbSession });
      if (!material) throw new createHttpError.NotFound("Material não encontrado no estoque.");

      const { newQty, newPrice } = calculateWeightedPrice(
        material.qtde,
        material.preco,
        adjustment,
        purchaseUnitPrice,
        `estoque.sincronizacao.${materialId}`,
      );

      await materialsCollection.updateOne(
        { _id: material._id },
        { $set: { qtde: newQty, preco: newPrice } },
        { session: dbSession },
      );
      await materialsLogsCollection.insertOne(
        {
          alteracao: adjustment,
          idCompra: id,
          tipo: "ENTRADA",
          material: { id: materialId, nome: material.nome },
          projeto: { id: null, nome: null },
          qtdeAnterior: material.qtde,
          qtdeNovo: newQty,
          precoAnterior: material.preco,
          precoNovo: newPrice,
          autor: {
            id: session.user.id,
            nome: session.user.nome,
            avatar_url: session.user.avatar_url,
          },
          dataInsercao: new Date().toISOString(),
        },
        { session: dbSession },
      );
      await purchaseControlsCollection.updateOne(
        { _id: purchase._id },
        {
          $inc: { revisao: 1 },
          $set: {
            composicao: purchase.composicao.map((item) =>
              item.materialId === materialId
                ? { ...item, dataAlocacao: purchase.entrega.dataEfetivacao, qtdeAlocada: item.qtde }
                : item,
            ),
          },
        },
        { session: dbSession },
      );
    });
  } finally {
    await dbSession.endSession();
  }

  return res.status(200).json({
    data: result,
    message:
      result.adjustment === 0 ? "A entrada já está sincronizada." : "Entrada de estoque sincronizada com sucesso.",
  });
};

export default apiHandler({
  GET: getPurchasesControlsRoute,
  POST: createPurchaseControlRoute,
  PUT: updatePurchaseControlRoute,
  PATCH: syncPurchaseStockEntryRoute,
  DELETE: deletePurchaseControlRoute,
});

type HandlePurchaseControlAllocationsImprovedParams = {
  type: "ALLOCATING" | "UPDATING" | "DEALLOCATING";
  purchaseControlId: string;
  purchaseControlTitle: TPurchaseControl["titulo"];
  purchaseControlDeliveryDate: TPurchaseControl["entrega"]["dataEfetivacao"];
  purchaseControlComposition: TPurchaseControl["composicao"];
  previousComposition?: TPurchaseControl["composicao"];
  projectId: TPurchaseControl["projeto"]["id"];
  purchaseControlsCollection: Collection<TPurchaseControl>;
  projectsCollection: Collection<TProject>;
  materialsCollection: Collection<TMaterial>;
  materialsLogsCollection: Collection<TMaterialUpdateRegistry>;
  dbSession: ClientSession;
  userSession: TAuthSession;
};

function assertFiniteNumber(value: unknown, context: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    console.error(`[ERROR] [HANDLE-ALLOCATIONS] Valor numérico inválido em ${context}:`, value);
    throw new createHttpError.BadRequest(`Valor numérico inválido em ${context}.`);
  }
}

function calculateWeightedPrice(
  currentQty: number,
  currentPrice: number,
  quantityDiff: number,
  diffUnitPrice: number,
  context: string,
) {
  assertFiniteNumber(currentQty, `${context}.quantidadeAtual`);
  assertFiniteNumber(currentPrice, `${context}.precoAtual`);
  assertFiniteNumber(quantityDiff, `${context}.diferencaQuantidade`);
  assertFiniteNumber(diffUnitPrice, `${context}.precoUnitario`);

  const newQty = currentQty + quantityDiff;
  assertFiniteNumber(newQty, `${context}.novaQuantidade`);

  if (newQty < 0) throw new createHttpError.BadRequest(`A operação resultaria em estoque negativo em ${context}.`);
  if (newQty === 0) return { newQty, newPrice: 0 };

  const newPrice = (currentQty * currentPrice + quantityDiff * diffUnitPrice) / newQty;
  assertFiniteNumber(newPrice, `${context}.novoPreco`);

  return { newQty, newPrice };
}

function calculateMovementsWeightedPrice(
  movements: Exclude<TProject["alocacoes"], undefined | null>[number]["movimentacoes"],
  context: string,
) {
  const quantity = movements.reduce((acc, curr, index) => {
    assertFiniteNumber(curr.quantidade, `${context}.movimentacoes.${index}.quantidade`);
    return acc + curr.quantidade;
  }, 0);
  assertFiniteNumber(quantity, `${context}.quantidade`);

  if (quantity < 0) throw new createHttpError.BadRequest(`A operação resultaria em alocação negativa em ${context}.`);
  if (quantity === 0) return { quantity, price: 0 };

  const price =
    movements.reduce((acc, curr, index) => {
      assertFiniteNumber(curr.precoUnitario, `${context}.movimentacoes.${index}.precoUnitario`);
      return acc + curr.quantidade * curr.precoUnitario;
    }, 0) / quantity;
  assertFiniteNumber(price, `${context}.precoUnitario`);

  return { quantity, price };
}

export async function handlePurchaseControlAllocationsImproved({
  type,
  purchaseControlId,
  purchaseControlTitle,
  purchaseControlDeliveryDate,
  purchaseControlComposition,
  previousComposition,
  projectId,
  purchaseControlsCollection,
  projectsCollection,
  materialsCollection,
  materialsLogsCollection,
  dbSession,
  userSession,
}: HandlePurchaseControlAllocationsImprovedParams) {
  validatePurchaseComposition(purchaseControlComposition, purchaseControlComposition);
  console.log(
    `[INFO] [HANDLE-ALLOCATIONS] Iniciando operação ${type} para controle ${purchaseControlId} (projeto: ${projectId})`,
  );
  // There are two paths for the purchase allocation procces:
  // 1. The purchase control is vinculated to a project, therefore, we gotta allocate the items to the project
  // 2. The purchase control is not vinculated to a project, therefore, we gotta allocate the items to stock

  if (projectId) {
    const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) }, { session: dbSession });
    if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
    const expected =
      type === "DEALLOCATING"
        ? new Map<string, { quantity: number; value: number }>()
        : groupPurchaseStock(purchaseControlComposition);
    const handled = new Set<string>();
    const allocations = (project.alocacoes || []).map((allocation) => {
      const target = expected.get(allocation.idMaterial);
      if (!target && !allocation.movimentacoes.some((movement) => movement.idCompra === purchaseControlId))
        return allocation;
      const movements = allocation.movimentacoes.filter((movement) => movement.idCompra !== purchaseControlId);
      if (target && !handled.has(allocation.idMaterial)) {
        movements.push({
          idCompra: purchaseControlId,
          titulo: purchaseControlTitle,
          data: purchaseControlDeliveryDate as string,
          quantidade: target.quantity,
          precoUnitario: target.value / target.quantity,
        });
        handled.add(allocation.idMaterial);
      }
      const { quantity, price } = calculateMovementsWeightedPrice(
        movements,
        `projeto.${projectId}.${allocation.idMaterial}`,
      );
      return { ...allocation, quantidade: quantity, precoUnitario: price, movimentacoes: movements };
    });
    for (const [materialId, target] of expected) {
      if (handled.has(materialId)) continue;
      const item = purchaseControlComposition.find((row) => row.materialId === materialId)!;
      allocations.push({
        idMaterial: materialId,
        nome: item.descricao,
        unidade: item.unidade,
        quantidade: target.quantity,
        quantidadePrevista: target.quantity,
        precoUnitario: target.value / target.quantity,
        movimentacoes: [
          {
            idCompra: purchaseControlId,
            titulo: purchaseControlTitle,
            data: purchaseControlDeliveryDate as string,
            quantidade: target.quantity,
            precoUnitario: target.value / target.quantity,
          },
        ],
      });
    }
    await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: { alocacoes: allocations } },
      { session: dbSession },
    );
    await purchaseControlsCollection.updateOne(
      { _id: new ObjectId(purchaseControlId) },
      {
        $set: {
          composicao: purchaseControlComposition.map((item) =>
            isPurchaseMaterialId(item.materialId)
              ? {
                  ...item,
                  dataAlocacao: type === "DEALLOCATING" ? null : purchaseControlDeliveryDate,
                  qtdeAlocada: type === "DEALLOCATING" ? 0 : item.qtde,
                }
              : item,
          ),
        },
      },
      { session: dbSession },
    );
    return { message: "Controle de compra atualizado com sucesso !" };
  }

  // Reconcile the entire purchase by material, including removed/replaced lines.
  // Allocation flags alone do not prove that stock was actually received.
  const previousStock = groupPurchaseStock(previousComposition ?? purchaseControlComposition);
  const expected =
    type === "DEALLOCATING"
      ? new Map<string, { quantity: number; value: number }>()
      : groupPurchaseStock(purchaseControlComposition);
  const entries = await materialsLogsCollection
    .find({ idCompra: purchaseControlId, tipo: "ENTRADA" }, { session: dbSession })
    .toArray();
  const materialIds = new Set([...expected.keys(), ...entries.map((entry) => entry.material.id)]);
  for (const materialId of materialIds) {
    if (!isPurchaseMaterialId(materialId))
      throw new createHttpError.BadRequest("Movimentação de estoque com material inválido.");
    const target = expected.get(materialId) || { quantity: 0, value: 0 };
    const related = entries.filter((entry) => entry.material.id === materialId);
    const entered = related.reduce((sum, entry) => sum + stockEntryQuantity(entry), 0);
    const reference = previousStock.get(materialId) ?? target;
    const fallbackPrice = reference.quantity ? reference.value / reference.quantity : 0;
    const enteredValue = related.reduce((sum, entry) => sum + stockEntryValue(entry, fallbackPrice), 0);
    const adjustment = target.quantity - entered;
    const valueAdjustment = target.value - enteredValue;
    assertFiniteNumber(adjustment, "estoque.quantidade");
    assertFiniteNumber(valueAdjustment, "estoque.valor");
    if (Math.abs(adjustment) < 0.000001 && Math.abs(valueAdjustment) < 0.000001) continue;
    const material = await materialsCollection.findOne({ _id: new ObjectId(materialId) }, { session: dbSession });
    if (!material) {
      const item = purchaseControlComposition.find((row) => row.materialId === materialId)
        ?? previousComposition?.find((row) => row.materialId === materialId);
      const entry = related[0];
      throw new createHttpError.NotFound(purchaseMaterialError({
        materialId,
        descricao: item?.descricao || entry?.material.nome || "Sem descrição",
      }));
    }
    assertFiniteNumber(material.qtde, "estoque.quantidadeAtual");
    assertFiniteNumber(material.preco, "estoque.precoAtual");
    const newQty = material.qtde + adjustment;
    if (newQty < -0.000001) throw new createHttpError.BadRequest("A operação resultaria em estoque negativo.");
    const newPrice = newQty <= 0 ? 0 : (material.qtde * material.preco + valueAdjustment) / newQty;
    assertFiniteNumber(newPrice, "estoque.novoPreco");
    if (newPrice < -0.000001)
      throw new createHttpError.BadRequest(
        "A operação resultaria em valor de estoque negativo. Confira as movimentações do material.",
      );
    await materialsCollection.updateOne(
      { _id: material._id },
      {
        $set: { qtde: Math.max(0, newQty), preco: Math.max(0, newPrice) },
      },
      { session: dbSession },
    );
    await materialsLogsCollection.insertOne(
      {
        idCompra: purchaseControlId,
        tipo: "ENTRADA",
        alteracao: adjustment,
        material: { id: materialId, nome: material.nome },
        projeto: { id: null, nome: null },
        qtdeAnterior: material.qtde,
        qtdeNovo: Math.max(0, newQty),
        precoAnterior: material.preco,
        precoNovo: Math.max(0, newPrice),
        autor: { id: userSession.user.id, nome: userSession.user.nome, avatar_url: userSession.user.avatar_url },
        dataInsercao: new Date().toISOString(),
      },
      { session: dbSession },
    );
    await notifyMaterialBelowMinimumIfCrossed({
      materialId,
      materialName: material.nome,
      previousQuantity: material.qtde,
      newQuantity: Math.max(0, newQty),
      minimumQuantity: material.qtdeMinima,
    });
  }
  const composition = purchaseControlComposition.map((item) =>
    isPurchaseMaterialId(item.materialId)
      ? {
          ...item,
          dataAlocacao: type === "DEALLOCATING" ? null : purchaseControlDeliveryDate,
          qtdeAlocada: type === "DEALLOCATING" ? 0 : item.qtde,
        }
      : item,
  );
  await purchaseControlsCollection.updateOne(
    { _id: new ObjectId(purchaseControlId) },
    {
      $set: { composicao: composition },
    },
    { session: dbSession },
  );
  return { message: "Controle de compra atualizado com sucesso !" };
}
