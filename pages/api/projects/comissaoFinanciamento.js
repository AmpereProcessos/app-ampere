import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/connectDb";
import { vendedores } from "../../../utils/constants";
import dayjs from "dayjs";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    try {
      var depois = new Date(
        dayjs(req.query.depois).subtract(3, "hours").$d
      ).toISOString();
      var antes = new Date(
        dayjs(req.query.antes).subtract(3, "hours").$d
      ).toISOString();

      var arr = await collection
        .aggregate([
          {
            $match: {
              "pagamento.forma": "FINANCIAMENTO",
              $and: [
                {
                  "compra.dataPagamento": { $gte: depois },
                },
                {
                  "compra.dataPagamento": { $lte: antes },
                },
              ],
            },
          },
          {
            $group: {
              _id: "$pagamento.credor",
              valorProjeto: {
                $sum: "$sistema.valorProjeto",
              },
              valorPadrao: {
                $sum: "$padrao.valor",
              },
              valorEstrutura: {
                $sum: "$estruturaPersonalizada.valor",
              },
            },
          },
        ])
        .toArray();
      if (arr.length > 0) {
        arr = arr.map((item) => {
          return {
            CREDOR: item._id,
            "VALOR TOTAL DE PROJETO": item.valorProjeto,
            "VALOR TOTAL DE PADRÃO": item.valorPadrao,
            "VALOR TOTAL DE ESTRUTURA": item.valorEstrutura,
          };
        });
        res.status(200).json(arr);
      } else {
        res.json("SEM FINANCIAMENTOS NO PERÍODO");
      }
    } catch (error) {
      res.status(500).send("Erro na comunicação com o servidor.");
    }
  }
}
