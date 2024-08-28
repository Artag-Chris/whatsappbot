import { IncommingWhatsappMessage } from "../../config/interfaces/whatsappMessage.interface";
import { envs } from "../../config/envs/envs";
import axios from "axios";

export class BotServices {

constructor() {
    
}

onMessage(payload:IncommingWhatsappMessage ) :string{
let mensaje="hola mundo";

  const telefonoAEnviar=payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
  const business_phone_number_id =payload.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

  async function sendMessage() {

    try {
        await axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
           headers: {
              Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
            },
            data: {
             messaging_product: "whatsapp",
             to: telefonoAEnviar!,
             text: {body: 'Mesanje de devuelta'},
            },
          })
    }catch{
      console.log("error");
    }
   
    //console.log(telefonoAEnviar);
  
    
  }
  sendMessage();
  return mensaje;
}
}

 // mark incoming message as read
  //  await axios({
  //     method: "POST",
  //     url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
  //    headers: {
  //       Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
  //     },
  //     data: {
  //      messaging_product: "whatsapp",
  //    status: "read",
  //      message_id: message.id,
  //  },
  // });
  // }

//   

//await axios({
    //     method: "POST",
    //     url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    //     headers: {
    //       Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
    //     },
    //     data: {
    //       messaging_product: "whatsapp",
    //       to: message.status,
    //       text: {
    //         body: "Su mensaje sera atendido pronto: " + message.conversation.id,
    //       },
    //       context: {
    //         message_id: message.id, // shows the message as a reply to the original user message
    //       },
    //     },
          
      
    //   });