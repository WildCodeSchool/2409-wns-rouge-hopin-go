import type { LibraryResponse, SendEmailV3_1 } from "node-mailjet";
import { getMailjet } from "./mjClient";

const mailjet = getMailjet();

type SendEmailOptions = {
  toEmail: string;
  toName?: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail({
  toEmail,
  toName,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<boolean> {
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: process.env.MJ_SENDER_EMAIL!,
          Name: "Hopin'Go",
        },
        To: [{ Email: toEmail, Name: toName || toEmail }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  };
  try {
    const result: LibraryResponse<SendEmailV3_1.Response> | null = await mailjet
      .post("send", { version: "v3.1" })
      .request(data);

    if (result) {
      console.log(
        "✅ Mail envoyé à",
        toEmail,
        "status:",
        result.body.Messages[0].Status
      );
    }
    return true;
  } catch (err: any) {
    console.error("❌ Erreur Mailjet :", err.statusCode || err);
    return false;
  }
}
