import axios from "axios";
import connectToDatabase from "../../utils/connectDb";
import connectToInsideDb from "../../utils/insideSalesDb";
export default async function handler(req, res) {
  // DB of projects
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");

  // DB of leads
  const db2 = await connectToInsideDb(process.env.DB_KEY);
  const collection2 = db2.collection("leads");

  // Goal: daily update leads regarding the status of contracts originated from them

  // Fetching all signed contract's SVB codes
  const signedContractCodes = await collection
    .aggregate([
      {
        $match: {
          "contrato.status": "ASSINADO",
        },
      },
      {
        $project: {
          codigoSVB: 1,
        },
      },
    ])
    .toArray();

  //Filtering the existing/valid codes and generate an array of numbers from them
  const filteredCodes = signedContractCodes.filter(
    (obj) => !!obj.codigoSVB || !isNaN(obj.codigoSVB)
  );
  var arr = filteredCodes.map((obj) => Number(obj.codigoSVB));

  // Getting opportunities won in RD and adding their ids to arr
  const { data } = await axios.get(
    `https://crm.rdstation.com/api/v1/deals?token=${process.env.RD_TOKEN}&win=true&deal_pipeline_id=649c763d8a4e9d002444731b`
  );
  const { deals } = data;
  const dealsIdArr = deals.map((deal) => deal.id);

  dealsIdArr.forEach((x) => arr.push(x));
  // Filtering arr for non null and non 0 values
  arr = arr.filter((x) => x != null && x != 0);
  // Updating correspoding leads with contratoAssinado tag and setting them as closed deal for funnel control purposes
  const dbResp = await collection2.updateMany(
    { codigoSVB: { $in: arr } },
    { $set: { contratoAssinado: true, estagioFunil: 3 } }
  );
  //   console.log(arr.length);

  res.json({ dbResp });
}
