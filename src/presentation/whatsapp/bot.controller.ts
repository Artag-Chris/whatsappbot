import { Request, Response } from "express";
import { BotServices } from "../services/bot.services";
import { inWorkingHours } from "../../functions";
import { WhatsappOutgoingAudio, WhatsappOutgoingDocument, WhatsappOutgoingImage, WhatsappOutgoingMessage, WhatsappOutgoingVideo } from "../../config/classes";
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
        try {
          const { changes } = payload.entry?.[0];
          const { value } = changes?.[0];
          const { metadata, contacts, messages } = value;
          const { display_phone_number, phone_number_id } = metadata;
          const { name } = contacts?.[0]?.profile || { name: 'Unknown' };
          const { id, type } = messages?.[0];
          const phone = messages?.[0]?.from;
          
          // Default message for non-working hours
          let message = 'El cliente envió un archivo fuera de horas laborales';
      
          // Extract message content based on type
          switch (type) {
            case 'text':
              message = messages?.[0]?.text?.body || message;
              const textMsg = new WhatsappOutgoingMessage(
                name, phone, message, type, id, message,
                display_phone_number, phone_number_id
              );
              await textMsg.inNotWorkingHours();
              break;
      
            case 'image':
              const imageMsg = new WhatsappOutgoingImage(
                name, phone, display_phone_number,
                message, type, id
              );
              // TODO: Add inNotWorkingHours method to WhatsappOutgoingImage
              await imageMsg.sendToApi();
              break;
      
            case 'audio':
              const audioMsg = new WhatsappOutgoingAudio(
                name, phone, display_phone_number, 
                message, type, id
              );
              // TODO: Add inNotWorkingHours method to WhatsappOutgoingAudio
              await audioMsg.sendToApi();
              break;
      
            case 'video':
              const videoMsg = new WhatsappOutgoingVideo(
                name, phone, display_phone_number,
                message, type, id
              );
              // TODO: Add inNotWorkingHours method to WhatsappOutgoingVideo
              await videoMsg.sendToApi();
              break;
      
            case 'document':
              const docMsg = new WhatsappOutgoingDocument(
                name, phone, display_phone_number,
                message, type, id
              );
              // TODO: Add inNotWorkingHours method to WhatsappOutgoingDocument
              await docMsg.sendToApi();
              break;
      
            default:
              logger.warn(`Unsupported message type received during non-working hours: ${type}`);
              const defaultMsg = new WhatsappOutgoingMessage(
                name, phone, message, type, id, message,
                display_phone_number, phone_number_id
              );
              await defaultMsg.inNotWorkingHours();
          }
      
          return;
      
        } catch (error) {
          logger.error('Error processing message during non-working hours:', error);
          return res.status(500).send('Error processing message during non-working hours');
        }
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
          const body = messages?.[0]?.text ? messages[0].text.body : 'El cliente envió un archivo fuera de horas laborales';
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


