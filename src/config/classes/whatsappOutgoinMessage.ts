import axios, { AxiosResponse } from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";
import { findMenu, handleMenuOption, sendMessageToApi } from "../../functions";
import WebSocket from 'ws';

export class WhatsappOutgoingMessage {

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
    

    async checkType(){
      const ws = new WebSocket(`ws://${envs.URL_BASE}/ws`);
      
        const menu = findMenu(this.body);

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

        if (menu) {
            handleMenuOption(menu, payload)
            this.sendMessageToMeta(menu)
        }else{
          ws.on('open', () => {
            ws.send(JSON.stringify(payload));
            console.log('Mensaje enviado al servidor WebSocket:', payload);
        });
        }ws.on('message', (data) => {
          console.log('Mensaje recibido del servidor WebSocket:', data.toString());
        });
        ws.on('error', (error) => {
        console.error('Error en el WebSocket:', error);
        });
        ws.on("close", () => {
        console.log("Conexión WebSocket cerrada");
        });

        //implementar el ws aqui enviar a la api el payload por ws
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

    }catch(error){
        console.log(error)
     }
   }

   async inNotWorkingHours(){
    const headers = header
    const messageData = {
        messaging_product: "whatsapp",
        to: this.phone,
        text: { body: `Sera atendido prontamente en horas habiles de lunes a viernes de 8:00 am a 5:00 pm y sabado de 9:00 am a 1:00 pm` },
      };
      const statusData = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: this.id,
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

      }catch(error){
        console.log(error)}


   }

}