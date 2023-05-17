import admin from "firebase-admin";
import serviceAccount from "../../sistemaampere-firebase-adminsdk-5srhq-e6de8630c7.json";

export default async function getBucket() {
  var sdkApp = admin.apps.find((app) => app.name == "SDK");
  if (!sdkApp) {
    sdkApp = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "sistemaampere.appspot.com",
      },
      "SDK"
    );
  }

  const bucket = sdkApp.storage().bucket();
  return bucket;
}
