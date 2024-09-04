import axios, { AxiosResponse } from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";

export class WhatsappOutgoingVideo {
  constructor(
    private readonly name: string | undefined,
    private readonly phone: string,
    private readonly identification: string,
    private readonly message: string, 
    private readonly type: string,
    private readonly id: string
  ) {}

  async sendToApi(): Promise<AxiosResponse<any>> {
    const headers = header;

    const apiUrl = envs.URLIMAGEROUTE;
    const payload = {
      name: this.name,
      phone: this.phone,
      identification: this.identification,
      message: this.message,
      type: this.type,
      id: this.id,
    };
    try {
      const response = await axios.post(apiUrl, payload, { headers });
      return response;
    } catch (error) {
      console.error("Error al enviar los datos a la API:", error);
      throw error;
    } finally {
      console.log("Video sended to api");
    }
  }
}