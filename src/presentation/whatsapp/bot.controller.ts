import { Request, Response } from "express";
import { BotServices } from "../services/bot.services";
import { inWorkingHours } from "../../functions";
import { WhatsappOutgoingMessage } from "../../config/classes";
import logger from "../../config/adapters/winstonAdapter";
export class BotController {

  constructor(
    private readonly botServices = new BotServices
  ) { }

  webhook = async (req: Request, res: Response) => {

    try {
      const payload = req.body;
      if (!payload.entry || !Array.isArray(payload.entry) || payload.entry.length === 0) {
        return res.status(400).send("Invalid payload: No entry found");
      }
      const entry = payload.entry[0];
      if (!entry.changes || !Array.isArray(entry.changes) || entry.changes.length === 0) {
        return res.status(400).send("Invalid payload: No changes found");
      }
      const changes = entry.changes[0];
      if (!changes.value) {
        return res.status(400).send("Invalid payload: No value found");
      }
      const value = changes.value;
      if (!value.messages || !Array.isArray(value.messages) || value.messages.length === 0) {
        return res.status(400).send("Invalid payload: No messages found");
      }
      const messages = value.messages[0];
      if (!messages.type) {
        return res.status(400).send("no hay cuerpo de mensaje");
      }
      if (!messages) {
        return res.status(400).send("mensaje invalido")
      }
      const messageType = messages.type;
      if (!inWorkingHours()) {
        const { changes } = payload.entry?.[0];
        const { value } = changes?.[0];
        const { metadata, contacts, messages } = value
        const { name } = contacts?.[0].profile
        const { id, type } = messages?.[0]
        const { body } = messages?.[0].text
        const { display_phone_number, phone_number_id } = metadata
        const phone = payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
        const notWorkingHours = new WhatsappOutgoingMessage(name, phone, body, type, id, body, display_phone_number, phone_number_id);
        notWorkingHours.inNotWorkingHours();
        //mandara un un mensaje personalizado al usuario diciendo la hora de atencion y tambien guardara en la base de datos
        return
      }

      switch (messageType) {
        case "text":
          const text = this.botServices.onMessage(payload);
          res.status(200).send(text);
          break;
        case "image":
          const image = this.botServices.onImageMessage(payload);
          res.status(200).send("image");
          break;
        case "audio":
          const audio = this.botServices.onVoiceMessage(payload);
          res.status(200).send(audio);
          break;
        case "video":
          const video = this.botServices.onVideoMessage(payload);
          res.status(200).send(video);
          break;
        case "document":
          const document = this.botServices.onDocumentMessage(payload);
          res.status(200).send(document);
          break;

        default:
          //aqui biene la funcion de mandar la plantilla a los nuevos usuarios por primera vez
          const { changes } = payload.entry?.[0];
          const { value } = changes?.[0];
          const { metadata, contacts, messages } = value
          const { name } = contacts?.[0].profile
          const { id, type } = messages?.[0]
          const { body } = messages?.[0].text
          const { display_phone_number, phone_number_id } = metadata
          const phone = payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
          const firstTimeMessage = new WhatsappOutgoingMessage(name, phone, body, type, id, body, display_phone_number, phone_number_id);
          firstTimeMessage.inNotWorkingHours();
          res.status(200).send("OK");
          break;
      }
    } catch (error:any) {
      logger.error("Error processing webhook:", error);
      res.status(500).send("Internal Server Error");
    }

  }

}


