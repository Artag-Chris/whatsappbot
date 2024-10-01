import axios, { AxiosResponse } from "axios";
import { envs } from "../config/envs/envs";
import crypto from "crypto";
import { header } from "../config/urls";

const sentPayloads = new Set<string>();

function hashPayload(payload: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export async function sendMessageToApi(payload: any): Promise<AxiosResponse<any>> {
    const apiUrl = envs.URLCREATEMESSAGE;
    const payloadHash = hashPayload(payload);

    if (sentPayloads.has(payloadHash)) {
        console.log('Payload ya enviado anteriormente:', payload);
        throw new Error('Payload ya enviado anteriormente');
    }

    try {
        const response = await axios.post(apiUrl, payload, { headers: header });
        console.log('Payload enviado a la API:', response.data);
        sentPayloads.add(payloadHash);
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