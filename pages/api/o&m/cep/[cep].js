import axios from "axios";
export default async function handler(req, res) {
  let { cep } = req.query;
  let info = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return res.json(info.data);
}
