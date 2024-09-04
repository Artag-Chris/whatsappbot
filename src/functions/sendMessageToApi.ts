import axios, { AxiosResponse } from "axios";
import { IncomingWhatsappMessage } from "../config/interfaces";
import {envs} from "../config/envs/envs";

export async function sendMessageToApi(payload: IncomingWhatsappMessage): Promise<AxiosResponse<any>> {
    const apiUrl = envs.URLCREATEMESSAGE;
    try {
        const response = await axios.post(apiUrl, payload);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al enviar el payload:', error.response?.data || error.message);
        } else {
            console.error('Error desconocido al enviar el payload:', error);
        }
        throw error;
    }
}