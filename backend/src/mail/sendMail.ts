import type { LibraryResponse, SendEmailV3_1 } from "node-mailjet";
import { getMailjet } from "./mjClient";

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
  const mailjet = getMailjet();

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

  // Short circuit if Mailjet is disabled
  if (!mailjet) {
    if (process.env.NODE_ENV === "testing") {
      console.info("Mailjet disabled in test mode, simulated sending.");
    } else {
      console.warn("Mailjet not configured, email not sent.");
    }
    return true; // simulated success
  }

  try {
    const result: LibraryResponse<SendEmailV3_1.Response> | null = await mailjet
      .post("send", { version: "v3.1" })
      .request(data);

    if (result) {
      console.log("✅ Mail envoyé");
    }
    return true;
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "statusCode" in err) {
      console.error("❌ Error Mailjet :", (err as { statusCode?: unknown }).statusCode);
    } else {
      console.error("❌ Error Mailjet :", err);
    }
    return false;
  }
}
