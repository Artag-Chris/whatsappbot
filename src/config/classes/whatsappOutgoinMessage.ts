import axios from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";
import { findMenu, handleMenuOption, sendMessageToApi } from "../../functions";
import WebSocket from 'ws';
import logger from "../adapters/winstonAdapter";

const welcomeMessagesSent: { [phone: string]: boolean } = {};
export class WhatsappOutgoingMessage {
  private hasSentWelcomeMessage = false;
  constructor(
    private readonly name: string | undefined,
    private readonly phone: string,
    private readonly message: string,
    private readonly type: string,
    private readonly id: string,
    private readonly body: string,
    private readonly display_phone_number: string,
    private readonly phone_number_id: string,

  ) {

  }
  async checkType() {
    const ws = new WebSocket(`ws://${envs.URL_BASE}/ws`, {
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });

    const payload = {
      name: this.name,
      phone: this.phone,
      message: this.message,
      type: this.type,
      id: this.id,
      body: this.body,
      display_phone_number: this.display_phone_number,
      phone_number_id: this.phone_number_id,
    };
    const menu = findMenu(this.body);

    if (!menu && !welcomeMessagesSent[this.phone]) {
      // Si no es la primera vez y no pasa el filtro, envíe el template de bienvenida
      await this.reSendMessage();
      welcomeMessagesSent[this.phone] = true;
      ws.send(JSON.stringify(payload));

    } else if (menu) {
      // Si pasa el filtro, maneje la opción del menú

      handleMenuOption(menu, {
        name: this.name,
        phone: this.phone,
        message: this.message,
        type: this.type,
        id: this.id,
        body: this.body,
        display_phone_number: this.display_phone_number,
        phone_number_id: this.phone_number_id,
      });
      this.sendMessageToMeta(menu);

      ws.on('open', () => {
        ws.send(JSON.stringify(payload));
      });

      ws.on("close", () => {
      });
    } else {
      // Si no es la primera vez y no pasa el filtro, envíe el mensaje utilizando el WebSocket

      ws.on('open', () => {
        ws.send(JSON.stringify(payload));
      });
      ws.on('message', (data) => {
      });
      ws.on('error', (error) => {
      });
      ws.on("close", () => {
      });
    }
  }
  async sendMessageToMeta(menu: string) {
    const headers = header
    const messageData = {
      messaging_product: "whatsapp",
      to: this.phone,
      text: { body: `${menu}` },
    };
    const statusData = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: this.id,
    };
    try {

      await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, messageData, { headers });
      await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, statusData, { headers });

    } catch (error: any) {
      logger.error("Error enviando mensaje al usuario", error.message)
    }
  }
  async reSendMessage() {
    const headers = header
    const messageData = {
      messaging_product: "whatsapp",
      to: this.phone,
      //esto se cambiara segun necesidad
      text: {
        body:
          `*¡Hola! Bienvenido a nuestro servicio de atención*. 😊

*Por favor, selecciona una de las siguientes opciones para que podamos ayudarte mejor*:

          1️⃣ *Atención al cliente* 🧑‍💼
          2️⃣ *Cartera o jurídica* ⚖️
          3️⃣ *Contabilidad* 💼

Estamos para ayudarte, ¡gracias por contactarnos con *Finova S.A.S*! 🤝`
         },
    };
    const statusData = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: this.id,
    };
    try {

      await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, messageData, { headers });
      await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, statusData, { headers });

    } catch (error: any) {
      logger.error("Error enviando la plantilla de primera vez al usuario", error.message)
    }
  }

  async inNotWorkingHours() {
    const headers = header
    const messageData = {
      messaging_product: "whatsapp",
      to: this.phone,
      text: {
        body: `Estimado cliente,

Gracias por contactarnos. *e informamos que será atendido prontamente durante nuestro horario de atención*:

 *Lunes a Viernes: 8:00 am a 5:00 pm*

 *Sábados: 9:00 am a 1:00 pm*

Agradecemos su paciencia y comprensión.
Saludos cordiales,

 *Finova Sas*`

      },
    };

    const payload = {
      name: this.name,
      phone: this.phone,
      message: this.message,
      type: this.type,
      id: this.id,
      body: this.body,
      display_phone_number: this.display_phone_number,
      phone_number_id: this.phone_number_id
    }

    try {
      await axios.post(
        `https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`,
        messageData,
        { headers }
      );
      sendMessageToApi(payload)

    } catch (error: any) {
      logger.error("Error en InNotWorkingHours", error.message)
    }
  }

}