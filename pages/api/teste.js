import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import { google } from "googleapis";
const KEYFILEPATH = "./utils/serviceAccount.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const drive = google.drive({
  version: "v3",
  auth: auth,
});

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const upload2 = multer({ dest: "./public/uploads" });
const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("theFiles"));
apiRoute.post(async (req, res) => {
  req.files.forEach(async (file) => {
    try {
      const fileMetadata = {
        name: file.filename,
        parents: ["1ILtrL6glYzz0ArbR_y7ciAI8wKyTbSe6"],
      };
      const media = {
        mimeType: "image/jpeg",
        body: fs.createReadStream(file.path),
      };
      var file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
    } catch (err) {
      console.log(err);
    }
  });
  res.json("FORMULÁRIO ENVIADO");
});
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
