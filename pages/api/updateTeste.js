import dayjs from "dayjs";
import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");
  // let clients = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         $and: [
  //           { "obra.saida": { $gte: "2023-01-01T00:00:00.000Z" } },
  //           { "obra.saida": { $lte: "2023-01-31T00:00:00.000Z" } },
  //         ],
  //       },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         "obra.saida": 1,
  //       },
  //     },
  //   ])
  //   .toArray();

  // clients = clients.map((x) => {
  //   return {
  //     "NOME DO CONTRATO": x.nomeDoContrato,
  //     "SAIDA DE OBRA": dayjs(x.obra.saida).add(4, "hours").format("DD/MM/YYYY"),
  //   };
  // });
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",

  //         "obra.statusDaObra": "CONCLUIDA",

  //         "jornada.entregaTecnica": { $ne: true },
  //       },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         qtde: 1,
  //         app: 1,
  //         conferencias: 1,
  //         cidade: 1,
  //         "medidor.data": 1,
  //         "obra.saida": 1,
  //         "obra.equipeResp": 1,
  //         "jornada.entregaTecnica": 1,
  //         "jornada.tipoEntregaTecnica": 1,
  //         "vendedor.nome": 1,
  //       },
  //     },
  //     {
  //       $sort: {
  //         "medidor.data": 1,
  //         "obra.saida": 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // let treatedArr = arr.map((item) => {
  //   return {
  //     qtde: item.qtde,
  //     nome: item.nomeDoContrato,
  //     cidade: item.cidade,
  //     vendedor: item.vendedor.nome,
  //     saidaObra: item.obra?.saida
  //       ? dayjs(item.obra.saida).format("DD/MM/YYYY")
  //       : null,
  //     equipeObra: item.obra?.equipeResp,
  //     trocaMedidor: item.medidor?.data
  //       ? dayjs(item.medidor.data).format("DD/MM/YYYY")
  //       : null,
  //     dataApp: item.app.data ? dayjs(item.app.data).format("DD/MM/YYYY") : null,
  //     usinaLigadaData: item.conferencias?.usinaLigada?.data
  //       ? dayjs(item.conferencias?.usinaLigada?.data).format("DD/MM/YYYY")
  //       : null,
  //     usinaLigadaStatus: item.conferencias?.usinaLigada?.status,
  //     monitoramentoFeitoData: item.conferencias?.monitoramentoFeito?.data
  //       ? dayjs(item.conferencias.monitoramentoFeito.data).format("DD/MM/YYYY")
  //       : null,
  //     monitoramentoFeitoStatus: item.conferencias?.monitoramentoFeito.status,
  //     energiaInjetadaData: item.conferencias?.energiaInjetada?.data
  //       ? dayjs(item.conferencias?.energiaInjetada?.data).format("DD/MM/YYYY")
  //       : null,
  //     energiaInjetadaStatus: item.conferencias?.energiaInjetada?.status,
  //     entregaTecnicaFeita: item.jornada.entregaTecnica == true ? "SIM" : "NÃO",
  //     tipoEntregaTecnica: item.jornada.tipoEntregaTecnica,
  //   };
  // });
  // const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  // const collection = db.collection("dados");
  // let arr = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",
  //         "sistema.valorProjeto": null,
  //       },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // let arr = await collection.updateMany(
  //   {
  //     "estruturaPersonalizada.respPagamento": "NÃO SE APLICA",
  //   },
  //   {
  //     $set: {
  //       "estruturaPersonalizada.respPagamento": "NÃO SE APLICA",
  //     },
  //   }
  // );
  res.json("DESATIVADA");
}
/*
  let arr = await collection.updateMany(
    {}
       {
        $lte: 524,
      },
    },
    {
      $set: {
        "compra.kitInfo":
          "- Perfil: • Parafuso Estrutural: \n -Grampo final: \n -Grampo intermediário: \n -Emenda para perfil: \n -Parafuso cabeça de martelo p/ micro:",
        "material.materialFaltante":
          '"- Perfil: • Parafuso Estrutural: \n -Grampo final: \n -Grampo intermediário: \n -Emenda para perfil: \n -Parafuso cabeça de martelo p/ micro:"',
      },
    }
  );
*/
