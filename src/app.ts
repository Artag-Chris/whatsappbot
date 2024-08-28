import express,{ Request, Response } from "express";
import { envs } from "./config/envs/envs";
import axios from "axios";
import { inWorkingHours } from "./functions/isWorkingHours";
import { BotController } from "./presentation/whatsapp/bot.controller";


(async () => {
  main();
})();

function main(){
  const app = express();
  app.use(express.json());
  const controller = new BotController();


  app.post("/webhook",controller.webhook);
  
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




   