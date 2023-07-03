import axios from "axios";
import connectToDatabase from "../../../utils/connectDb";
import connectToTestDatabase from "../../../utils/auxiliaresDb";
async function sendSignEmail(signatureKey) {
  if (signatureKey) {
    try {
      await axios.post(
        "https://sandbox.clicksign.com/api/v1/notifications?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
        {
          request_signature_key: signatureKey,
          message:
            "Prezado,\nPor favor assine o documento.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,\nVolts",
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
export default async function handler(req, res) {
  if (req.method == "POST") {
    const testDb = await connectToTestDatabase(process.env.DB_KEY);
    const testCollection = testDb.collection("webhook");
    await testCollection.insertOne(req.body);
    try {
      const db = await connectToDatabase(process.env.DB_KEY, "projetos");
      const collection = db.collection("dados");
      const { event, document } = req.body;
      const signerType = event.data.signer.sign_as;
      var updateTag;
      if (signerType) {
        if (signerType == "contractor") {
          updateTag = "assinaturaDigital.assinaturaContratante";
          const contracteeSignatureKey = document.signers.find(
            (signer) => signer.sign_as == "contractee"
          )?.request_signature_key;
          const validatorSignatureKey = document.signers.find(
            (signer) => signer.sign_as == "validator"
          )?.request_signature_key;
          // Sending emails to contractee and validator
          await sendSignEmail(contracteeSignatureKey);
          await sendSignEmail(validatorSignatureKey);
          // Updating project in DB
          if (document.key)
            await collection.updateOne(
              {
                "assinaturaDigital.documentoKey": document.key,
              },
              {
                $set: {
                  "assinaturaDigital.assinaturaContratante": true,
                },
              }
            );
        }
        if (signerType == "contractee") {
          if (document.key)
            await collection.updateOne(
              {
                "assinaturaDigital.documentoKey": document.key,
              },
              {
                $set: {
                  "assinaturaDigital.assinaturaContratada": true,
                },
              }
            );
        }
        if (signerType == "validator") {
          if (document.key)
            await collection.updateOne(
              {
                "assinaturaDigital.documentoKey": document.key,
              },
              {
                $set: {
                  "assinaturaDigital.assinaturaValidador": true,
                },
              }
            );
        }
      }
      await collection.insertOne(req.body);
      res.status(201).json({ message: "Execução bem sucedida" });
    } catch (error) {
      res.status(501).json({ message: "Erro de execução." });
    }
  }
}
