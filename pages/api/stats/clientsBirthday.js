import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            dataNascimento: { $ne: "-" },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            dataNascimento: 1,
            data: {
              ano: {
                $year: { $dateFromString: { dateString: "$dataNascimento" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$dataNascimento" } },
              },
            },
          },
        },
        {
          $match: {
            "data.mes": 11,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
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
    }
    let arr = await collection
      .aggregate([
        {
          $match: {
            [`${queryKey}`]: queryValue,
            dataNascimento: { $ne: "-" },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            dataNascimento: 1,
            data: {
              ano: {
                $year: {
                  $dateFromString: { dateString: "$dataNascimento" },
                },
              },
              mes: {
                $month: {
                  $dateFromString: { dateString: "$dataNascimento" },
                },
              },
            },
          },
        },
        {
          $match: {
            "data.mes": 11,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
