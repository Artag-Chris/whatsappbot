import { sendMessageToApi } from "./sendMessageToApi";

export async function handleMenuOption(
  menu: any,
  payload: any
) {
  if (!menu) return;

  switch (menu) {
    case "customerService":
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      //websocket para transladar a customer Service
      break;
    case "creditRequest":
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      //websocket para transladar a credit Request
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      console.log("traslado a creditRequest");
      break;
    case "walletArea":
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      //websocket para transladar a walletArea
      console.log("traslado a walletArea");
      break;
    case "accounting":
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      //websocket para transladar a accounting
      console.log("traslado a accounting");
      break;
    default:
      await sendMessageToApi(payload).then((response) => {
        console.log(response.data);
      });
      console.log("traslado a customerService");

      break;
  }
}
