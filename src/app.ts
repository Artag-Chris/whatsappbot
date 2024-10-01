import express from "express";
import { envs } from "./config/envs/envs";
import { BotController } from "./presentation/whatsapp/bot.controller";

(async () => {
  main();
})();    

function main(){
  const app = express();
  app.use(express.json());
  const controller = new BotController();
  app.post("/webhook",controller.webhook);
  
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




   