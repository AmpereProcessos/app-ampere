import connectToDatabase from "../../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const { year } = req.query;
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let graphData = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
            "contrato.dataAssinatura": { $ne: "-" },
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: { dateString: "$contrato.dataAssinatura" },
                },
              },
              mes: {
                $month: {
                  $dateFromString: { dateString: "$contrato.dataAssinatura" },
                },
              },
            },
            total: {
              $sum: "$sistema.potPico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": Number(year),
          },
        },
      ])
      .toArray();
    var graph = graphData.map((info) => {
      return {
        name: `${info._id.mes}/${info._id.ano}`,
        Total: info.total.toFixed(2),
      };
    });
    return res.json(graph);
  } else if (req.method === "POST") {
    const { year } = req.query;
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var queryKey;
    var queryValue;
    if (req.body.filtrarPor == "REGIONAL") {
      queryKey = "regional";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "VENDEDOR") {
      queryKey = "vendedor.nome";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "INSIDE") {
      queryKey = "insider";
      queryValue = req.body.parametro;
    }
    let graphData = await collection
      .aggregate([
        {
          $match: {
            [`${queryKey}`]: queryValue,
            "contrato.status": "ASSINADO",
            "contrato.dataAssinatura": { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: "$contrato.dataAssinatura",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$contrato.dataAssinatura",
                  },
                },
              },
            },
            total: {
              $sum: "$sistema.potPico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": Number(year),
          },
        },
      ])
      .toArray();
    var graph = graphData.map((info) => {
      return {
        name: `${info._id.mes}/${info._id.ano}`,
        Total: info.total.toFixed(2),
      };
    });
    res.json(graph);
  }
}
