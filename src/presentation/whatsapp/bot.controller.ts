import { Request, Response } from "express";
import { inWorkingHours } from "../../functions";

import { BotServices } from "../services/bot.services";
export class BotController {

    constructor(
      private readonly botServices= new BotServices
    ) {}

    webhook=async(req: Request, res: Response)=>  {
     
      try{
          
        const payload = req.body;
        if (!payload.entry || !Array.isArray(payload.entry) || payload.entry.length === 0) {
          return res.status(400).send("Invalid payload: No entry found");
        }
        const entry =payload.entry[0];
        if (!entry.changes || !Array.isArray(entry.changes) || entry.changes.length === 0) {
          return res.status(400).send("Invalid payload: No changes found");
        }
        
        const changes=entry.changes[0];
        if (!changes.value) {
        return res.status(400).send("Invalid payload: No value found");
        }

        const value=changes.value;
        if (!value.messages || !Array.isArray(value.messages) || value.messages.length === 0) {
          return res.status(400).send("Invalid payload: No messages found");
        }

        const messages=value.messages[0];
        if (!messages.type) {
         return res.status(400).send("Invalid payload: No message type found");
        }
        if(!messages){
          return res.status(400).send("mensaje invalido")
        }
        const messageType=messages.type;

        // if(!inWorkingHours()){
        //   //mandara un un mensaje personalizado al usuario diciendo la hora de atencion y tambien guardara en la base de datos
        //   return res.status(400).send("No se puede enviar el mensaje en este horario")
        // }
         
        //TODO: funcion por si es la primera vez que hace contacto
       
        switch(messageType) {
          case "text":
            this.botServices.onMessage(payload);
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



      }catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
      }

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
    
    


    

    //     // aqui estan los detalles de la documentacion sobre el payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    
    
        
      
    //   