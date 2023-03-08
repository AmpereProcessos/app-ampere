export default async function handler(req, res) {
  console.log(req.query);
  let errorMsg = req.query?.msg
    ? req.query?.msg
    : "Erro não identificado, por favor tente novamente mais tarde.";
  let statusCode = req.query.statusCode ? req.query.statusCode : 500;
  res.status(401).json({ msg: errorMsg, statusCode: statusCode });
}
