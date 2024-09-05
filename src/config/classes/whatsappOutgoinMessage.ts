import axios, { AxiosResponse } from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";
import { findMenu, handleMenuOption } from "../../functions";
export class WhatsappOutgoingMessage {

    constructor(
        private readonly name: string | undefined,
        private readonly phone: string,
        //private readonly identification: string,
        private readonly message: string,
        private readonly type: string,
        private readonly id: string,
        private readonly body: string,
        private readonly display_phone_number: string,
        private readonly phone_number_id: string
    ){}
    

    async checkType(){
        const headers = header
        const menu = findMenu(this.body);

        const payload={
            name: this.name,
            phone: this.phone,
           // identification: this.identification,
            message: this.message,
            type: this.type,
            id: this.id,
            body: this.body,
            display_phone_number: this.display_phone_number
        }

        if (menu) {
           
            handleMenuOption(menu, payload)

            this.sendMessageToMeta(menu)
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

    }catch(error){
        console.log(error)
     }
   }

}