import axios from "axios";
import { IncomingWhatsappDocument, IncomingWhatsappImage, IncomingWhatsappMessage, IncomingWhatsappVideo, IncomingWhatsappVoice, } from "../../config/interfaces";
import { envs } from "../../config/envs/envs";
import { findMenu, readingMimeExtension, readingMimeExtensionForAudio, renameFile } from "../../functions";
import { handleMenuOption } from "../../functions/handleMenuOptions";
import { header } from "../../config/urls"
import path from 'path';
import fs from 'fs';



export class BotServices {
  constructor() {}
  
  async onMessage(payload: IncomingWhatsappMessage): Promise<string> {

    let mensaje = "hola mundo";
    const telefonoAEnviar = payload.entry?.[0].changes?.[0].value?.messages?.[0].from;
    const businessPhoneNumberId = payload.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const idMessage = payload.entry?.[0].changes?.[0].value?.messages?.[0].id;
    const cuerpoDelMensaje = payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const bodyMessage = cuerpoDelMensaje?.text?.body;

    if (!telefonoAEnviar || !businessPhoneNumberId || !idMessage || !bodyMessage) {
      console.error("Missing required data from payload");
      return mensaje;
    }
    
    try {
      const headers = header
      const menu = findMenu(bodyMessage);
      if (menu) {
        const messageData = {
          messaging_product: "whatsapp",
          to: telefonoAEnviar,
          text: { body: `Sera atendido prontamente en ${menu}` },
        };
        
        const statusData = {
          messaging_product: "whatsapp",
          status: "read",
          message_id: idMessage,
        };
        
        await axios.post(`https://graph.facebook.com/${envs.Version}/${businessPhoneNumberId}/messages`, messageData, { headers });
        await axios.post(`https://graph.facebook.com/${envs.Version}/${businessPhoneNumberId}/messages`, statusData, { headers });
     
       handleMenuOption(menu, payload);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    return mensaje;
  }
  async onImageMessage(payload:IncomingWhatsappImage): Promise<string>{
    
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.image?.id;
    const headers = header;
  
    //console.log(readingMimeExtension(message.image.mime_type, "/"));
    const extension = readingMimeExtension(message.image.mime_type, "/");

    if(!mediaId){
      return "no se encontro imagen"
    }

    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File.jpg");

      // Realizar la solicitud GET para descargar el archivo
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          // Crear un flujo de escritura para guardar el archivo
          const writer = fs.createWriteStream(outputPath);

          //Conectar el flujo de datos de la respuesta al flujo de escritura
          response.data.pipe(writer);

          writer.on("finish", () => {

            //TODO se combertira el archivo a binario y despues a base64
            // y se enviara a la api y esta guardara la info en la base de datos como un string

            renameFile(outputPath, "File.jpg", extension, (error) => {
              if (error) {
                console.error("Error al renombrar el archivo:", error);
              }
              console.log("Archivo renombrado con éxito");
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

    const mensaje="hola desde mensaje"
    return mensaje
  }
  async onVoiceMessage(payload:IncomingWhatsappVoice): Promise<string>{
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.audio?.id;
    const headers = header;
  
   const extension = readingMimeExtensionForAudio(message.audio.mime_type, "/");
    
    if(!mediaId){
      return "no se encontro imagen"
    }

    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File.ogg");

      // Realizar la solicitud GET para descargar el archivo
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          // Crear un flujo de escritura para guardar el archivo
          const writer = fs.createWriteStream(outputPath);

          //Conectar el flujo de datos de la respuesta al flujo de escritura
          response.data.pipe(writer);

          writer.on("finish", () => {
        //  console.log("Archivo descargado con éxito");
            //TODO se combertira el archivo a binario y despues a base64
            // y se enviara a la api y esta guardara la info en la base de datos como un string

             renameFile(outputPath, "File.ogg", extension, (error) => {
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
          //     console.log("Archivo renombrado con éxito");
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

    const mensaje="hola desde audio"
    return mensaje
  }
  async onVideoMessage(payload:IncomingWhatsappVideo): Promise<string>{
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.video?.id;
    const headers = header;
   
    const extension = readingMimeExtensionForAudio(message.video.mime_type, "/");
    
    if(!mediaId){
      return "no se encontro imagen"
    }

    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File.ogg");

      // Realizar la solicitud GET para descargar el archivo
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          // Crear un flujo de escritura para guardar el archivo
          const writer = fs.createWriteStream(outputPath);

          //Conectar el flujo de datos de la respuesta al flujo de escritura
          response.data.pipe(writer);

          writer.on("finish", () => {
        //  console.log("Archivo descargado con éxito");
            //TODO se combertira el archivo a binario y despues a base64
            // y se enviara a la api y esta guardara la info en la base de datos como un string

             renameFile(outputPath, "File.ogg", extension, (error) => {
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
          //     console.log("Archivo renombrado con éxito");
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

    return ""
  }
  async onDocumentMessage(payload:IncomingWhatsappDocument): Promise<string>{

    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const mediaId= message.document?.id;
    const headers = header;
    //TODO los documentos deben pasar por distintos filtros para poder colocarle bien las extenciones
    //por ahora soloo funcionan los pdf 
    const extension = readingMimeExtensionForAudio(message.document.mime_type, "/");
    //console.log(extension)
    if(!mediaId){
      return "no se encontro Documento"
    }
    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;

      const outputPath = path.join(__dirname, "../../../uploads", "File.ogg");

      // Realizar la solicitud GET para descargar el archivo
     
      axios({
        method: "get",
        url: fileUrl,
        responseType: "stream", // Importante para manejar la respuesta como un flujo de datos
        headers: headers,
      })
        .then((response) => {
          // Crear un flujo de escritura para guardar el archivo
          const writer = fs.createWriteStream(outputPath);

          //Conectar el flujo de datos de la respuesta al flujo de escritura
          response.data.pipe(writer);

          writer.on("finish", () => {
        //  console.log("Archivo descargado con éxito");
            //TODO se combertira el archivo a binario y despues a base64
            // y se enviara a la api y esta guardara la info en la base de datos como un string

             renameFile(outputPath, "File.pdf", extension, (error) => {
               if (error) {
                 console.error("Error al renombrar el archivo:", error);
               }
          //     console.log("Archivo renombrado con éxito");
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

    return ""
  }





}


