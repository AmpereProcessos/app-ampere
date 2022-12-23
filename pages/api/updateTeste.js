import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
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
