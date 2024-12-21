
import logger from "../config/adapters/winstonAdapter";
import { sendMessageToApi } from "./sendMessageToApi";

export async function handleMenuOption(
  menu: any,
  payload: any
) {
  if (!menu) return;

  switch (menu) {
    case "customerService":
      await sendMessageToApi(payload).then((response) => {
        logger.info("Mensaje enviado a customerService");
      });
      //websocket para transladar a customer Service
      break;
    case "creditRequest":
      await sendMessageToApi(payload).then((response) => {
        logger.info("Mensaje enviado a creditRequest");
      });
      //websocket para transladar a credit Request
      await sendMessageToApi(payload).then((response) => {
       logger.info("Mensaje enviado desdse el websocket a creditRequest");
      });
      break;
    case "walletArea":
      await sendMessageToApi(payload).then((response) => {
        logger.info("Mensaje enviado a walletArea");
      });
      //websocket para transladar a walletArea
      break;
    case "accounting":
      await sendMessageToApi(payload).then((response) => {
        logger.info("Mensaje enviado a accounting");
      });
      //websocket para transladar a accounting
      logger.info("traslado a accounting por ws");
      break;
    default:
      await sendMessageToApi(payload).then((response) => {
        logger.info("Mensaje enviado a customerService");
      });

      break;
  }
}
