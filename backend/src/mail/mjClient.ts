// eslint-disable-next-line @typescript-eslint/no-require-imports
const Mailjet = require("node-mailjet");

export function getMailjet() {
  if (
    process.env.NODE_ENV === "testing" ||
    !process.env.MJ_APIKEY_PUBLIC ||
    !process.env.MJ_APIKEY_PRIVATE
  ) {
    return null;
  }

  return Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
}
