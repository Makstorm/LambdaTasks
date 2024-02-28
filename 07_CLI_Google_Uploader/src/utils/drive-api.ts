import { google } from "googleapis";
import { JWT } from "google-auth-library";
import * as path from "path";
import * as fs from "fs";

const folder_id = "16dNXRvUlat7e-ShixnkcsraUrLJPgD51";
const KEY_FILE_PATH = path.join("drive-apploader-498e64608fcb.json");

// const serviceAccountAuth = new JWT({
//   email: client_email,
//   key: client_secret,
//   scopes: ["https://www.googleapis.com/auth/cloud-platform"],
// });

const authorise = async () => {
  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const client_secret = process.env.GOOGLE_PRIVATE_KEY.split(
    String.raw`\n`
  ).join("\n");

  const serviceAccountAuth = new JWT({
    email: client_email,
    key: client_secret,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return serviceAccountAuth;
};

export const uploadFile = async (filePath: string, newName?: string) => {
  const file = getFileObject(filePath);

  const auth = await authorise();

  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: { mimeType: file.mimeType, body: fs.createReadStream(filePath) },
    requestBody: {
      name: newName ? newName : file.originalname,
      parents: [folder_id],
    },
    fields: "id, name, webViewLink",
  });

  return data.webViewLink;
};

const getFileObject = (filePath) => {
  const fileStats = fs.statSync(filePath);
  const fileExtension = path.extname(filePath);

  return {
    originalname: path.basename(filePath),
    mimeType: getMimeType(fileExtension),
    path: filePath,
    size: fileStats.size,
  };
};

const getMimeType = (extension) => {
  switch (extension.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream"; // Default MIME type
  }
};
