import axios from "axios";
import connectToDatabase from "../../../utils/insideSalesDb";
import { errorHandler } from "../../../utils/methods/handlers";
const cf_qual_o_valor_da_sua_conta_de_luz = [
  {
    parametros: {
      min: 0,
      max: 300,
    },
    value: "Até R$ 300,00",
  },
  {
    parametros: {
      min: 300,
      max: 2000,
    },
    value: "de R$301 até R$ 2.000",
  },
  {
    parametros: {
      min: 2000,
      max: 5000,
    },
    value: "de R$ 2.001 até R$ 5.000",
  },
  {
    parametros: {
      min: 5000,
      max: 9999999,
    },
    value: "Acima de de R$ 5.001",
  },
];
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("leads");
  const {
    telefone,
    nome,
    email,
    responsavel,
    uf,
    cidade,
    canal,
    campanha,
    dataDeAquisicao,
    consumo,
    vendedor,
    dataDeEnvio,
    codigoSVB,
    nicho,
    leadscoreProduto,
    leadscoreBranding,
  } = req.body;
  try {
    const dbResp = await collection.insertOne({
      ...req.body,
    });
    const value_cf_qual_o_valor_da_sua_conta_de_luz =
      cf_qual_o_valor_da_sua_conta_de_luz.find(
        (rdParam) =>
          consumo > rdParam.parametros.min && consumo <= rdParam.parametros.max
      );
    console.log(value_cf_qual_o_valor_da_sua_conta_de_luz);
    // Creating oportunity on RD
    const { data: rdResponse } = await axios.post(
      `https://api.rd.services/platform/conversions?api_key=${process.env.RD_API_KEY}`,
      {
        event_type: "CONVERSION",
        event_family: "CDP",
        payload: {
          conversion_identifier: "CALCULADORA",
          email: email,
          personal_phone: telefone,
          name: nome,
          cf_qual_o_valor_da_sua_conta_de_luz:
            value_cf_qual_o_valor_da_sua_conta_de_luz
              ? value_cf_qual_o_valor_da_sua_conta_de_luz.value
              : undefined,
          state: uf,
          city: cidade,
        },
      }
    );
    res.json(dbResp);
  } catch (error) {
    errorHandler(error, res);
  }
}
