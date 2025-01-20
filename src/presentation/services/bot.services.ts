import fs from 'fs';
import path from 'path';
import axios from "axios";
import { IncomingWhatsappDocument, IncomingWhatsappImage, IncomingWhatsappMessage, IncomingWhatsappVideo, IncomingWhatsappVoice, } from "../../config/interfaces";
import { envs } from "../../config/envs/envs";
import { audioExtention, documentExtention, imageExtension,renameFile, videoExtention } from "../../functions";
import { header } from "../../config/urls"
import { WhatsappOutgoingAudio, WhatsappOutgoingDocument, WhatsappOutgoingImage, WhatsappOutgoingMessage, WhatsappOutgoingVideo } from "../../config/classes";

export class BotServices {
  constructor() {}
  
  async onMessage(payload: IncomingWhatsappMessage): Promise<string> {
 // console.log(`Payload recibido: ${JSON.stringify(payload)}`);
 
    let mensaje = "hola mundo";
    const {changes} = payload.entry?.[0];
    const {value} = changes?.[0];
    const {metadata, contacts, messages} = value
    const {name} = contacts?.[0].profile
    const {id,type}= messages?.[0]
    const {body}= messages?.[0].text
    const {display_phone_number,phone_number_id}= metadata

     
    const phone = payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
   
    if (!phone || !phone_number_id || !id || !body) {
      console.error("Missing required data from payload");
      return mensaje;
    }
   console.log(` mensaje recivido de ${name} ${phone} : ${body}`);
    const outgoing=new WhatsappOutgoingMessage(name,phone,body,type,id,body,display_phone_number,phone_number_id);
    outgoing.checkType()
  
    return mensaje;
  }
  async onImageMessage(payload:IncomingWhatsappImage): Promise<string>{
    const {changes} = payload.entry?.[0];
    const {value} = changes?.[0];
    const {metadata, contacts, messages} = value
    const {display_phone_number} = metadata
    const {name} = contacts?.[0].profile
    const {from,id,type}= messages?.[0]
          

    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.image?.id;
    const headers = header;
  
    const extension = imageExtension(message.image.mime_type)

    if(!mediaId){
      return "no se encontro imagen"
    }

    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/${envs.Version}/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File");
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          const writer = fs.createWriteStream(outputPath);

          response.data.pipe(writer);

          writer.on("finish", () => {

           renameFile(outputPath, "File", extension, (error, renameFile) => {
             
              if (error) {
                console.error("Error al renombrar el archivo:", error);
              }
              const newPath= path.join(__dirname, "../../../uploads", renameFile!);
              fs.readFile(newPath, (err, data) => {
                if (err) {
                  console.error('Error al leer el archivo binario:', err);
                  return;
                }
                const base64Data = data.toString('base64');
                const outgoingImage= new WhatsappOutgoingImage( name,from,display_phone_number,base64Data,type,id);
                outgoingImage.sendToApi();
              })
            })           
          }
        );

          writer.on("error", (err) => {
            console.error("Error al guardar el archivo:", err);
          });
          
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });
    
    }catch (error) {
      console.error(error);
    }   

    const mensaje="imagen descargada con exito"
    return mensaje
  }
  async onVoiceMessage(payload:IncomingWhatsappVoice): Promise<string>{
    const {changes} = payload.entry?.[0];
    const {value} = changes?.[0];
    const {metadata, contacts, messages} = value
    const {display_phone_number} = metadata
    const {name} = contacts?.[0].profile
    const {from,id,type}= messages?.[0]
  

    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.audio?.id;
    const headers = header;
  
   const extension = audioExtention(message.audio.mime_type)

    if(!mediaId){
      return "no se encontro imagen"
    }
    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/${envs.Version}/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File");
   
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", 
        headers: headers,
      })
        .then((response) => {
          const writer = fs.createWriteStream(outputPath);
          response.data.pipe(writer);

          writer.on("finish", () => {

            renameFile(outputPath, "File", extension, (error, renameFile) => {
              
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
               const newPath= path.join(__dirname, "../../../uploads", renameFile!);
               fs.readFile(newPath, (err, data) => {
                 if (err) {
                   console.error('Error al leer el archivo binario:', err);
                   return;
                 }
                 const base64Data = data.toString('base64');
                 const outgoingImage= new WhatsappOutgoingAudio( name,from,display_phone_number,base64Data,type,id);
                 outgoingImage.sendToApi();
               })
             })           
           }
        );

          writer.on("error", (err) => {
            console.error("Error al guardar el archivo:", err);
          });
          
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });
    
    }catch (error) {
      console.error(error);
    }   
    const mensaje="descargando con exito"
    return mensaje
  }
  async onVideoMessage(payload:IncomingWhatsappVideo): Promise<string>{

    const {changes} = payload.entry?.[0];
    const {value} = changes?.[0];
    const {metadata, contacts, messages} = value
    const {display_phone_number} = metadata
    const {name} = contacts?.[0].profile
    const {from,id,type}= messages?.[0]
       
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.video?.id;
    const headers = header;
    const extension = videoExtention(message.video.mime_type)
   
    if(!mediaId){
      return "no se encontro video"
    }

    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/${envs.Version}/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File");
   
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          const writer = fs.createWriteStream(outputPath);
          response.data.pipe(writer);

          
          writer.on("finish", () => {

            renameFile(outputPath, "File", extension, (error, renameFile) => {
              
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
               const newPath= path.join(__dirname, "../../../uploads", renameFile!);
               fs.readFile(newPath, (err, data) => {
                 if (err) {
                   console.error('Error al leer el archivo binario:', err);
                   return;
                 }
                 const base64Data = data.toString('base64');
                 const outgoingImage= new WhatsappOutgoingVideo( name,from,display_phone_number,base64Data,type,id);
                 outgoingImage.sendToApi();
               })
             })           
           });

          writer.on("error", (err) => {
            console.error("Error al guardar el archivo:", err);
          });
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });
    
    }catch (error) {
      console.error(error);
    }   

    return "descargado correctamente"
  }
  async onDocumentMessage(payload:IncomingWhatsappDocument): Promise<string>{
    const {changes} = payload.entry?.[0];
    const {value} = changes?.[0];
    const {metadata, contacts, messages} = value
    const {display_phone_number} = metadata
    const {name} = contacts?.[0].profile
    const {from,id,type}= messages?.[0]

    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.document?.id;
    const headers = header;
    const extension = documentExtention(message.document.mime_type)
    if(!mediaId){
      return "no se encontro Documento";
    }
    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/${envs.Version}/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;
      const outputPath = path.join(__dirname, "../../../uploads", "File");
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          const writer = fs.createWriteStream(outputPath);

          response.data.pipe(writer);

          writer.on("finish", () => {

            renameFile(outputPath, "File", extension, (error, renameFile) => {
              
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
               const newPath= path.join(__dirname, "../../../uploads", renameFile!);
               fs.readFile(newPath, (err, data) => {
                 if (err) {
                   console.error('Error al leer el archivo binario:', err);
                   return;
                 }
                 const base64Data = data.toString('base64');
                 const outgoingImage= new WhatsappOutgoingDocument( name,from,display_phone_number,base64Data,type,id);
                 outgoingImage.sendToApi();
               })
             })           
           });

          writer.on("error", (err) => {
            console.error("Error al guardar el archivo:", err);
          }); 
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });
    
    }catch (error) {
      console.error(error);
    }   
    return "descargado correctamente"
  }

}


