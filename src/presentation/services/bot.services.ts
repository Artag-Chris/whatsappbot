import axios from "axios";
import { IncomingWhatsappImage, IncomingWhatsappMessage, } from "../../config/interfaces";
import { envs } from "../../config/envs/envs";
import { findMenu } from "../../functions";
import { handleMenuOption } from "../../functions/handleMenuOptions";
import {header} from "../../config/urls"
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
    const idMessage=payload.entry?.[0].changes?.[0].value?.messages?.[0].id
    const businessPhoneNumberId=payload.entry?.[0].changes?.[0].value?.metadata?.phone_number_id
    const idImage=payload.entry?.[0].changes?.[0].value?.messages?.[0].image?.id
    const sha256=payload.entry?.[0].changes?.[0].value?.messages?.[0].image?.sha256
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0]
    const mediaId= message.image?.id
    const headers = header

      // Configuración de multer para guardar archivos en una carpeta local
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, 'uploads')); // Carpeta donde se guardarán los archivos
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
       });
    
        const upload = multer({ storage: storage });


    if(!mediaId){
      return "no se encontro imagen"
    }
    //console.log(mediaId)
    //const respuestadelmedia= await axios.get(`https://graph.facebook.com/v20.0/${idMessage}/`)
    try{
    const metaResponse = await axios.get(`https://graph.facebook.com/v20.0/${mediaId}`, { headers });
    const object = metaResponse.data.url
    const downloadedFileURL = await axios.get(object,{headers});

    const fileUrl = downloadedFileURL.data;

// Ruta donde deseas guardar el archivo
    const outputPath = path.join(__dirname, '../../../uploads', 'File.jpg');

// Realizar la solicitud GET para descargar el archivo
axios({
  method: 'get',
  url: object,
  responseType: 'stream', // Importante para manejar la respuesta como un flujo de datos
  headers: {
    'Authorization': 'Bearer EAAMGwDhngcsBO4fX7eAU8JB4Q6n5JVuZAvq4swoZC41K5iHH5YIEkC4YJKvVQFCRqsAuNikPyDkT6NlZBj9Qdj1aLGdYA2GTZCJuMwMkuKEZCDrfjPOi2vstfh8E5av5vLL55cvTOlwSFQ8v7zqZA0GZAtjZBqy2hkj98yIdaqlm5YHe8XlnYsgT6kZCOjAlbOShZC71GldsFJGVXZBZB6bhzcAmlilBYkVB21pKSwZDZD'
  }
})
.then(response => {
  // Crear un flujo de escritura para guardar el archivo
  const writer = fs.createWriteStream(outputPath);

  // Conectar el flujo de datos de la respuesta al flujo de escritura
  response.data.pipe(writer);

  writer.on('finish', () => {
    console.log('Archivo descargado y guardado exitosamente en:', outputPath);
  });

  writer.on('error', err => {
    console.error('Error al guardar el archivo:', err);
  });
})
.catch(error => {
  console.error('Error al descargar el archivo:', error);
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


