import express,{ Request, Response } from "express";
import { envs } from "./config/envs/envs";
import axios from "axios";




(async () => {
  main();
})();

function main(){
  const app = express();
  app.use(express.json());


  app.post("/webhook", async (req: Request, res: Response) => {
    // log de nuevos mensajes
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  
    // mira si en el webhook hay una notificacion de mensaje
    // aqui estan los detalles de la documentacion sobre el payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    //TODO: hacer una funcion que mire si esta en horario de trabajo  y enviar un reply con los horarios
  
    // mira si es un mensaje de texto
    if (message?.type === "text") {
      // saca el numero de ""business number" para mandar un reply
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  
      // aqui esta la documentacion con las posibles respuestas https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id, // shows the message as a reply to the original user message
          },
        },
      });
  
      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    }
  
    res.sendStatus(200);
  });
  
  // solo acepta requests de /webhook endpoint.
  // info sobr el request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
  app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    
    if (mode === "subscribe" && token === envs.WEBHOOK_VERIFY_TOKEN) {
      
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      
      res.sendStatus(403);
    }
  });
    
  app.get("/", (req, res) => {
    res.send(`<pre>Nothing to see here.
  Checkout README.md to start.</pre>`);
  });
  
  app.listen(envs.PORT, () => {
    console.log(`bot en puerto: ${envs.PORT}`);
  });

}




   