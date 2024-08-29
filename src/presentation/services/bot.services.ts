import { IncomingWhatsappMessage } from "../../config/interfaces/whatsappMessage.interface";
import { envs } from "../../config/envs/envs";
import axios from "axios";

export class BotServices {
  constructor() {}

  async onMessage(payload: IncomingWhatsappMessage): Promise<string> {
    let mensaje = "hola mundo";
    const telefonoAEnviar = payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
    const businessPhoneNumberId = payload.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const idMessage = payload.entry?.[0].changes?.[0].value?.messages?.[0].id;
    const cuerpoDelMensaje = payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const bodyMessage = cuerpoDelMensaje?.text?.body;

    if (!telefonoAEnviar || !businessPhoneNumberId || !idMessage || !bodyMessage) {
      console.error("Missing required data from payload");
      return mensaje;
    }
   
    console.log(bodyMessage);
    try {
      const headers = {
        Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
      };

      const messageData = {
        messaging_product: "whatsapp",
        to: telefonoAEnviar,
        text: { body: 'Mensaje de devuelta' },
      };

      const statusData = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: idMessage,
      };

      await axios.post(`https://graph.facebook.com/${envs.Version}/${businessPhoneNumberId}/messages`, messageData, { headers });
      await axios.post(`https://graph.facebook.com/${envs.Version}/${businessPhoneNumberId}/messages`, statusData, { headers });

    } catch (error) {
      console.error("Error sending message:", error);
    }

    return mensaje;
  }
}