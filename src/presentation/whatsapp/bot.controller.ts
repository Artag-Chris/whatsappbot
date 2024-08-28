import { Request, Response } from "express";
import { inWorkingHours } from "../../functions";

import { BotServices } from "../services/bot.services";
export class BotController {

    constructor(
      private readonly botServices= new BotServices
    ) {}

    webhook=async(req: Request, res: Response)=>  {
      const payload = req.body;
      let checked= payload.entry[0].changes[0].value.messages[0].type ? payload.entry[0].changes[0].value.messages[0].type : "text";
      //const headers = req.headers;
      //console.log(headers);
      
      //TODO: funcion por si es la primera vez que hace contacto
        //console.log(payload.entry[0].changes[0].value.messages[0].type);

     
      //onst message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
     // const itsFirstMessage =req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].type;
      const whatsappEvent = req.headers;

      console.log(checked)
      switch(checked) {
        case "text":
          this.botServices.onMessage(payload);
          //console.log("text");
          break;
        case "image":
          console.log("image");
          break;
        case "audio":
          console.log("audio");
          break;
        case "video":
          console.log("video");
          break;
        case "document":
          break;

        default:
          console.log("no paso el default")
          break;
      }








           








      
      // if (inWorkingHours()) {
      //   //crear mensaje por si es una imagen ,audio o video

      //   if (message?.type === "text") {
      //     // saca el numero de "business number" para mandar un reply
      //     const business_phone_number_id =
      //       req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

       
      //       await axios({
      //         method: "POST",
      //         url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      //         headers: {
      //           Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
      //         },
      //         data: {
      //           messaging_product: "whatsapp",
      //           to: message.from,
      //           text: {
      //             body: "Su mensaje sera atendido pronto: " + message.text.body,
      //           },
      //           context: {
      //             message_id: message.id, // shows the message as a reply to the original user message
      //           },
      //         },
      //       });

      //       // mark incoming message as read
      //       await axios({
      //         method: "POST",
      //         url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      //         headers: {
      //           Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
      //         },
      //         data: {
      //           messaging_product: "whatsapp",
      //           status: "read",
      //           message_id: message.id,
      //         },
      //       });
      //     }

      //     res.sendStatus(200);
      //   } else {
      //     //aqui se guardara el mensaje que no fue atendido en la base de datos para que despues los agentes lo lean
      //     console.log("no fue atendido");
      //   }
      }
    
       };


    

    //     // aqui estan los detalles de la documentacion sobre el payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    
    
        
      
    //   