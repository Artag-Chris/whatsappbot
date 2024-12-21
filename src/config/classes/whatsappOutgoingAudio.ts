import axios, { AxiosResponse } from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";
import logger from "../adapters/winstonAdapter";
export class WhatsappOutgoingAudio {
    constructor(
        private readonly name: string | undefined,
        private readonly phone: string,
        private readonly display_phone_number: string,
        private readonly message: string, 
        private readonly type: string,
        private readonly id: string
      ) {}

    async sendToApi(): Promise<AxiosResponse<any>> {
        const headers = header;
    
        const apiUrl = envs.URLAUDIOROUTE;
        const payload = {
          name: this.name,
          phone: this.phone,
          to: this.display_phone_number,
          message: this.message, 
          type: this.type,
          id: this.id,
        };
        try {
          const response = await axios.post(apiUrl, payload, { headers });
          return response;
        } catch (error:any) {
          logger.error("Error al enviar los datos a la API:", error.message);

          throw error;
        } finally {
          logger.info("Datos enviados a la API");
        }
      }
}