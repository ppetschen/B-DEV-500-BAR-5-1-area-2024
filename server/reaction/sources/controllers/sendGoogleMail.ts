import { google } from "googleapis";

const gmail = google.gmail("v1");
const drive = google.drive("v3");

export const googleSendEmail = async (
  emailContext: { access_token: string; subject: string; body: any },
) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: emailContext.access_token });
  google.options({ auth });

  const utf8Subject = `=?utf-8?B?${
    Buffer.from(emailContext.subject).toString("base64")
  }?=`;

  const profile = await gmail.users.getProfile({ userId: "me" });
  const userEmail = profile.data.emailAddress;

  const messageParts = [
    "From: AREA Project",
    `To: ${userEmail}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    `<div>${emailContext.body}</div>`,
    "<br>",
    "<div>This is an autogenerated message.</div>", 
  ];
  
  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
  if( !res ) {
    throw new Error("Failed to send email");
  };
  return res;
};

export const googleCreateDriveFile = async ( 
   driveContext: { access_token: string, file_name: string, file_content: string },
) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: driveContext.access_token });
  google.options({ auth });

  const fileMetaData = {
    name: driveContext.file_name,
  }
  const media = {
    mimeType: "text/plain",
    body: driveContext.file_content,
  }

  const file = await drive.files.create({
    requestBody: fileMetaData,
    media: media,
  });
  return file;
};