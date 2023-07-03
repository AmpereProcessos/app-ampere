import axios from "axios";
import getBucket from "../../../utils/services/firebaseBucket";
import { companySignerKeys } from "../../../utils/constants";
import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const { filePath } = req.query;
    const { projectId, contractName, email, phone_number, documentation } =
      req.body;
    const formattedFileName = contractName
      ? contractName.split(" ").join("_")
      : "CONTRATO";
    try {
      const db = await connectToDatabase(process.env.DB_KEY, "projetos");
      const collection = db.collection("dados");

      if (typeof filePath === "string") {
        const bucket = await getBucket();
        const file = bucket.file(filePath);
        // Get the file metadata to retrieve the MIME type
        const [metadata] = await file.getMetadata();
        const mimeType = metadata.contentType;
        // Create a buffer to store the file data
        const buffers = [];
        // Create a read stream to read the file data
        const stream = file.createReadStream();
        // Stream the file data into the buffer
        stream.on("data", (data) => {
          buffers.push(data);
        });
        // Resolve the promise with the base64 encoding when the file stream ends
        const fileBase64 = await new Promise((resolve, reject) => {
          stream.on("end", () => {
            const fileData = Buffer.concat(buffers);
            const fileBase64 = `data:${mimeType};base64,${fileData.toString(
              "base64"
            )}`;
            resolve(fileBase64);
          });

          // Handle any errors that occur during the file stream
          stream.on("error", (error) => {
            reject(error);
          });
        });
        // Uploading document
        const { data: documentUploadResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/documents?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            document: {
              path: `/${formattedFileName}.pdf`,
              content_base64: fileBase64,
              deadline_at: null,
              auto_close: true,
              locale: "pt-BR",
              sequence_enabled: false,
              block_after_refusal: true,
            },
          }
        );

        const { data: createSignerResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/signers?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            signer: {
              email: "processos@ampereenergias.com.br", // email
              phone_number: null,
              auths: ["email"],
              name: contractName,
              documentation: null,
              birthday: null,
              has_documentation: true,
              selfie_enabled: true,
              handwritten_enabled: true,
              official_document_enabled: true,
              liveness_enabled: false,
              facial_biometrics_enabled: false,
            },
          }
        );

        // Adding Signers
        const documentKey = documentUploadResponse.document.key;

        // Update project with document key
        const digitalSignObject = {
          documentoKey: documentKey,
          assinaturaContratante: false,
          assinaturaContratada: false,
          assinaturaValidador: false,
        };
        await collection.updateOne(
          { _id: ObjectId(projectId) },
          { $set: { assinaturaDigital: digitalSignObject } }
        );
        const signerKey = createSignerResponse.signer.key;
        const validator = "8cb69cac-4044-48fd-8ada-1d699f64bd1d";
        const contractee = "06d287f1-ae2a-4e01-ba10-4ca31c944dd2";

        const { data: addClientSignerResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/lists?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            list: {
              document_key: documentKey,
              signer_key: signerKey,
              sign_as: "contractor",
              refusable: true,
              message:
                "Prezado,\nPor favor assine o documento.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,\nVolts",
            },
          }
        );
        const { data: addValidatorSignerResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/lists?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            list: {
              document_key: documentKey,
              signer_key: validator,
              sign_as: "validator",
              refusable: true,
              message:
                "Prezado,\nPor favor assine o documento.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,\nVolts",
            },
          }
        );
        const { data: addContracteeSignerResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/lists?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            list: {
              document_key: documentKey,
              signer_key: contractee,
              sign_as: "contractee",
              refusable: true,
              message:
                "Prezado,\nPor favor assine o documento.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,\nVolts",
            },
          }
        );
        // Send emails
        const { data: sendEmailClientResponse } = await axios.post(
          "https://sandbox.clicksign.com/api/v1/notifications?access_token=9686cf5e-a687-4b6e-85de-17d9d40da3f0",
          {
            request_signature_key:
              addClientSignerResponse.list.request_signature_key,
            message:
              "Prezado,\nPor favor assine o documento.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,\nVolts",
          }
        );
        // console.log("CLIENTE", addClientSignerResponse);
        // console.log("VALIDADOR", addValidatorSignerResponse);
        // console.log("CONTRATANTE", addContracteeSignerResponse);
        console.log(sendEmailClientResponse);
        // console.log(signerKey);
        res.json({ data: documentKey });
      } else {
        throw "FILE PATH INVALID";
      }
    } catch (error) {
      console.log(error);
      throw "Houve um erro.";
    }
  }
}
