import axios, { AxiosResponse } from "axios";
import { header } from "../urls";
import { envs } from "../envs/envs";

export class WhatsappOutgoingImage {
  constructor(
    private readonly name: string | undefined,
    private readonly phone: string,
    private readonly display_phone_number: string,
    private readonly message: string, //sera el archivo base64
    private readonly type: string,
    private readonly id: string,
  ) {}

  async sendToApi(): Promise<AxiosResponse<any>> {
    const headers = header;

    const apiUrl = envs.URLIMAGEROUTE;
    const payload = {
      name: this.name,
      phone: this.phone,
      to: this.display_phone_number,
      message: this.message, // Asegúrate de que `this.base64` esté definido
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
      console.log("Imagen sended to api");
    }
  }
}