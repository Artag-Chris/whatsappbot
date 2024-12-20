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
       
    ){ 
      
    }
    async checkType() {
      const ws = new WebSocket(`ws://${envs.URL_BASE}/ws`);
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
   async sendMessageToMeta(menu: string){
    const headers = header
    const messageData = {
        messaging_product: "whatsapp",
        to: this.phone,
        text: { body: `Sera atendido prontamente en ${menu}` },
      };
      const statusData = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: this.id,
      };
    try{

        await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, messageData, { headers });
        await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, statusData, { headers });

    }catch(error:any){
      logger.error("Error enviando mensaje al usuario", error.message)
     }
   }
   async reSendMessage(){
    const headers = header
    const messageData = {
        messaging_product: "whatsapp",
        to: this.phone,
        //esto se cambiara segun necesidad
        text: { body: 
          `Bienvenido a nuestro servicio de atencion por favor escoja a continuacion algunas de nuestras opciones
          1. atencion al cliente
          2. solicitar prestamo
          3. cartera o juridica
          4 contabilidad. ` },
      };
      const statusData = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: this.id,
      };
    try{

        await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, messageData, { headers });
        await axios.post(`https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`, statusData, { headers });

    }catch(error:any){
      logger.error("Error enviando la plantilla de primera vez al usuario", error.message)
     }
   }

   async inNotWorkingHours(){
    const headers = header
    const messageData = {
        messaging_product: "whatsapp",
        to: this.phone,
        text: { body: `Sera atendido prontamente en horas habiles de lunes a viernes de 8:00 am a 5:00 pm y sabado de 9:00 am a 1:00 pm` },
      };

      const payload={
            name: this.name,
            phone: this.phone,
            message: this.message,
            type: this.type,
            id: this.id,
            body: this.body,
            display_phone_number: this.display_phone_number,
            phone_number_id:this.phone_number_id
        }

      try{
        await axios.post(
          `https://graph.facebook.com/${envs.Version}/${this.phone_number_id}/messages`,
          messageData,
          { headers }
        );
         sendMessageToApi(payload)

      }catch(error:any){
        logger.error("Error en InNotWorkingHours", error.message)
      }
   }

}