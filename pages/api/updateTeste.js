import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  /*const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  let arr = await collection.updateMany(
    {
      qtde: {
        $in: [
          554, 571, 604, 812, 813, 814, 815, 816, 817, 818, 821, 822, 823, 906,
          1065, 1067, 1069, 1071, 1072, 1073, 1074, 1077, 1080, 1081, 1082,
          1084, 1085, 1086, 1091, 1094, 1096, 1098, 1102, 1110, 1113, 1125,
          1126, 1174, 1175, 1178, 1181, 1183, 1184,
        ],
      },
    },
    {
      $set: {
        "comissionamento.comercial": true,
        "comissionamento.suprimentos": true,
      },
    }
  );*/
  res.json("INATIVADO");
}
