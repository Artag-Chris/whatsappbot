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



export class BotServices {
  constructor() {}
  
  async onMessage(payload: IncomingWhatsappMessage): Promise<string> {

    const __filename = fileURLToPath("/");
    const __dirname = dirname(__filename);

// Configuración de multer para guardar archivos en una carpeta local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/')); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
 
  async onMessageImage(payload:IncomingWhatsappImage): Promise<string>{
    
    const mensaje="hola desde mensaje"
    const idMessage=payload.entry?.[0].changes?.[0].value?.messages?.[0].id
    const businessPhoneNumberId=payload.entry?.[0].changes?.[0].value?.metadata?.phone_number_id
    const idImage=payload.entry?.[0].changes?.[0].value?.messages?.[0].image?.id
    const sha256=payload.entry?.[0].changes?.[0].value?.messages?.[0].image?.sha256
    const message=payload.entry?.[0].changes?.[0].value?.messages?.[0]
    
    console.log(message)

   


    return mensaje
  }






}


