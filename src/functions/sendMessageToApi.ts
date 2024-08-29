import axios, { AxiosResponse } from "axios";
import { IncomingWhatsappMessage } from "../config/interfaces";
import { databaseSave } from "../config/urls";


export async function sendMessageToApi(payload: IncomingWhatsappMessage): Promise<AxiosResponse<any>> {
    const apiUrl = databaseSave; 
  
    try {
      const response = await axios.post(apiUrl, payload);
      console.log('Payload enviado exitosamente:', response.data);
      return response;
    } catch (error) {
      console.error('Error al enviar el payload:', error);
      throw error;
    }
  }
  