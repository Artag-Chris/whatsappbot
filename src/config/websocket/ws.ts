
import { WebSocketServer, WebSocket } from 'ws';
import logger from '../adapters/winstonAdapter';
class WebSocketServerWrapper {
    private wss: WebSocketServer;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.wss.on('connection', this.onConnection);
    }

    private onConnection(ws: WebSocket) {
    
        ws.on('message', (message: string) => {
            logger.info(`Mensaje recibido por el servidor: ${message}`);
            ws.send(`Mensaje recibido por el servidor: ${message}`);
        });
        ws.on('close', () => {
            logger.info('Conexión cerrada');
        });
    }

    public sendMessage(message: string) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

export default WebSocketServerWrapper;