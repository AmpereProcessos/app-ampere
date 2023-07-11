import axios from "axios";
import { pipeline } from "stream";
import { promisify } from "util";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { documentKey } = req.query;
    try {
      if (!documentKey) throw "Chave de documento inválida.";
      const { data } = await axios.get(
        `https://sandbox.clicksign.com/api/v1/documents/${documentKey}?access_token=${process.env.CLICKSIGN_TOKEN}`
      );
      if (data.document.downloads.signed_file_url) {
        const response = await axios.get(
          data.document.downloads.signed_file_url,
          {
            responseType: "stream",
          }
        );
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=filename.pdf"
        );

        const pipelineAsync = promisify(pipeline);
        await pipelineAsync(response.data, res);
      }
    } catch (error) {
      console.log(error);
      res.status("ERRO NA BUSCA DO ARQUIVO");
    }
  } else {
    res.status(400).json("Invalid method.");
  }
}
