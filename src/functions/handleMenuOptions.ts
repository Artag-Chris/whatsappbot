import { IncomingWhatsappMessage } from "../config/interfaces";
import { sendMessageToApi } from "./sendMessageToApi";

export async function handleMenuOption(menu:any, payload: IncomingWhatsappMessage) {
    if (!menu) return;

    switch (menu) {
        case "customerService":
           await sendMessageToApi(payload).then((response) => {
                console.log(response.data);
            })
            break;
        case "creditRequest":
            console.log("traslado a creditRequest");
            break;
        case "walletArea":
            console.log("traslado a walletArea");
            break;
        case "accounting":
            console.log("traslado a accounting");
            break;
        default:
            console.log("traslado a customerService");
           
            break;
    }
}