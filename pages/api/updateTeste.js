import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  // const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  // const collection = db.collection("dados");
  // let arr = await collection.updateMany(
  //   {
  //     "conferencias.usinaLigada.data": {
  //       $lte: "2022-12-01T00:00:00.000Z",
  //     },
  //   },
  //   {
  //     $set: {
  //       "conferencias.energiaInjetada.data": "2023-01-20T00:00:00.000Z",
  //     },
  //   }
  // );
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
