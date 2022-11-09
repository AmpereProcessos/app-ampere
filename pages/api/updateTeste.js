import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  /*let arr = await collection.updateMany(
    {
      "ordensDeServico.0.categoria": "PADRÃO",
    },
    {
      $set: {
        "ordensDeServico.0.realizarCobranca": true,
      },
    }
  );
  res.json(arr);*/
}
const info = [
  649, 836, 848, 849, 881, 919, 976, 992, 994, 1004, 1050, 1066, 1081, 1090,
  1103, 1111, 1116, 1119, 1121, 1122, 1133, 1138, 1144, 1150, 1151, 1153, 1162,
  1175, 1176, 1178, 1179, 1184, 1190, 1194, 1199, 1200, 1203, 1205, 1206, 1207,
  1211, 1212, 1213, 1214, 1215, 1217, 1218, 1219, 1221, 1222, 1224, 1225, 1226,
  1227, 1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1239, 1241,
  1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254,
  1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267,
  1268, 1269, 1270, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281,
  1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294,
  1295, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1308, 1309, 1310,
];
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
