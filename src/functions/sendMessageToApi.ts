import axios, { AxiosResponse } from "axios";
import { envs } from "../config/envs/envs";
import crypto from "crypto";
import { header } from "../config/urls";
import logger from "../config/adapters/winstonAdapter";

const sentPayloads = new Set<string>();

function hashPayload(payload: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export async function sendMessageToApi(payload: any): Promise<AxiosResponse<any>> {
    const apiUrl = envs.URLCREATEMESSAGE;
    const payloadHash = hashPayload(payload);

    if (sentPayloads.has(payloadHash)) {
        logger.error('Payload ya enviado anteriormente:', payload);
        throw new Error('Payload ya enviado anteriormente');
    }

    try {
        const response = await axios.post(apiUrl, payload, { headers: header });

        logger.info('Mensaje enviado a la API:', response.data);
        sentPayloads.add(payloadHash);
        return response;
    } catch (error:any) {
        if (axios.isAxiosError(error)) {
            logger.error('Error al enviar el payload:', error.response?.data);
        } else {
            logger.error('Error al enviar el payload:', error.message);
        }
        throw error;
    }
}