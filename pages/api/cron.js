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
  const filteredCodes = signedContractCodes.filter((obj) => !!obj.codigoSVB);
  const arr = filteredCodes.map((obj) => Number(obj.codigoSVB));

  // Updating correspoding leads with contratoAssinado tag and setting them as closed deal for funnel control purposes
  const dbResp = await collection2.updateMany(
    { codigoSVB: { $in: arr } },
    { $set: { contratoAssinado: true, estagioFunil: 3 } }
  );
  //   console.log(arr.length);

  res.json(dbResp);
}
