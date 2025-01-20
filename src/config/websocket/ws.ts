import { WebSocket } from 'ws';
import logger from '../adapters/winstonAdapter';

const ws = new WebSocket('ws://201.236.243.161:4000/ws-transfer', {
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});

ws.on('open', () => {
  logger.info('Conexión abierta con el servidor WebSocket');
});

ws.on('message', (message: string) => {
  logger.info(`Mensaje recibido del servidor: ${message}`);
});

ws.on('close', () => {
  logger.info('Conexión cerrada con el servidor WebSocket');
});

ws.on('error', (error: Error) => {
  logger.error('Error en la conexión WebSocket', error.message);
});

export default ws;