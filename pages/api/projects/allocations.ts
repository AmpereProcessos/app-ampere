import { ObjectId } from "mongodb";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { TProject } from "@/utils/schemas/projects";
import type { TMaterial } from "@/utils/schemas/materials";
import {
  AddProjectAllocationSchema,
  EditProjectAllocationSchema,
} from "@/lib/projects/allocations";

async function handleAllocation(req: NextApiRequest, res: NextApiResponse) {
  const session = await validateAuthenticationWithSession(req, res);
  const input =
    req.method === "POST"
      ? AddProjectAllocationSchema.parse(req.body)
      : EditProjectAllocationSchema.parse(req.body);
  const db = await connectToDatabase();
  const projects = db.collection<TProject>("dados");
  const projectId = new ObjectId(input.projectId);
  const project = await projects.findOne({ _id: projectId }, { projection: { _id: 1 } });
  if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");

  let result;
  if ("quantidadePrevistaAnterior" in input) {
    // Compare the edited value only: concurrent stock movements must remain intact.
    result = await projects.findOneAndUpdate(
      {
        _id: projectId,
        alocacoes: {
          $elemMatch: {
            idMaterial: input.materialId,
            quantidadePrevista: input.quantidadePrevistaAnterior,
          },
        },
      },
      { $set: { "alocacoes.$.quantidadePrevista": input.quantidadePrevista } },
      { returnDocument: "after", projection: { alocacoes: 1 } },
    );
    if (!result.value)
      throw new createHttpError.Conflict(
        "A alocação foi alterada ou removida. Atualize os dados e tente novamente.",
      );
  } else {
    const warehouseDb = await connectToWarehouseDatabase();
    const material = await warehouseDb
      .collection<TMaterial>("material")
      .findOne({ _id: new ObjectId(input.materialId), dataExclusao: null });
    if (!material) throw new createHttpError.NotFound("Material não encontrado.");
    const allocation = {
      idMaterial: input.materialId,
      nome: material.nome,
      unidade: material.grandeza || "UN",
      precoUnitario: material.preco,
      quantidadePrevista: input.quantidadePrevista,
      quantidade: 0,
      movimentacoes: [],
    };
    result = await projects.findOneAndUpdate(
      { _id: projectId, "alocacoes.idMaterial": { $ne: input.materialId } },
      // Legacy projects can have null/missing allocations. Append without replacing concurrent rows.
      [
        {
          $set: {
            alocacoes: {
              $concatArrays: [{ $ifNull: ["$alocacoes", []] }, { $literal: [allocation] }],
            },
          },
        },
      ],
      { returnDocument: "after", projection: { alocacoes: 1 } },
    );
    if (!result.value)
      throw new createHttpError.Conflict("Esse material já possui uma alocação no projeto.");
  }

  const now = new Date();
  await db.collection("logAlteracoes").insertOne({
    autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
    idProjetoAlterado: input.projectId,
    alteracoes: {
      alocacao: { ...input, operacao: req.method === "POST" ? "ADICIONAR" : "EDITAR_PREVISTO" },
    },
    dataAlteracao: now.toISOString(),
    dataAlteracaoFormatada: now.toLocaleString("pt-br"),
  });
  return res.json({ data: result.value.alocacoes || [], message: "Alocação salva com sucesso." });
}

export default apiHandler({ POST: handleAllocation, PATCH: handleAllocation });
