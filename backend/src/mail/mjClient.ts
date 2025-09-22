const Mailjet = require("node-mailjet");

export function getMailjet() {
  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    throw new Error("Mailjet API keys are not set in environment variables");
  }

  return Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );
}
