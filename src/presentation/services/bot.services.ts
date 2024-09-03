import axios from "axios";
import { IncomingWhatsappImage, IncomingWhatsappMessage, } from "../../config/interfaces";
import { envs } from "../../config/envs/envs";
import { findMenu } from "../../functions";
import { handleMenuOption } from "../../functions/handleMenuOptions";
import { header } from "../../config/urls"
import { upload } from "../../config/multer";
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
    const multer = upload;

      // Configuración de multer para guardar archivos en una carpeta local
      //aun no se implementa multer para hacer la descarga y la filtracion de la imagen

    if(!mediaId){
      return "no se encontro imagen"
    }
 
    try{
      const metaResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        { headers }
      );
      const fileUrl = metaResponse.data.url;
   
      //TODO hay que cambiarle el nombre del archivo descargado a algo random para que no se sobreescriba
      // Ruta donde deseas guardar el archivo
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

          // Conectar el flujo de datos de la respuesta al flujo de escritura
          response.data.pipe(writer);

          writer.on("finish", () => {
            console.log(
              "Archivo descargado y guardado exitosamente en:",
              outputPath
            );
          });

          writer.on("error", (err) => {
            console.error("Error al guardar el archivo:", err);
          });
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });

      //const __filename = fileURLToPath(metaResponse.data.url);
      //const __dirname = dirname(__filename);

      //Dentro de la función donde procesas la subida de la imagen
      // upload.single("image")(req, res, (err) => {
      //   if (err) {
      //   // Manejar el error de subida de archivo
      //   console.error(err);
      //   } else {
      //   // Guardar la imagen en el sistema de archivos
      //   fs.writeFile(
      //     path.join(__dirname, "uploads/", req.file.filename),
      //     req.file.buffer,
      //     (err) => {
      //       if (err) {
      //         console.error(err);
      //         // Manejar el error al guardar la imagen
      //       } else {
      //         console.log("Imagen guardada exitosamente");
      //         // Realizar otras acciones después de guardar la imagen
      //       }
      //     }
      //   );
      //   }
      //  });

      //console.log(metaResponse.data.url)
    }catch (error) {
      console.error(error);
    }
    

    const mensaje="hola desde mensaje"



  
 
    
    
    
    
 


    return mensaje
  }






}


