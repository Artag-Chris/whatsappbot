import { WebSocketServer, WebSocket } from 'ws';

class WebSocketServerWrapper {
    private wss: WebSocketServer;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.wss.on('connection', this.onConnection);
       // se debe cambiar el localhost console.log(`Servidor WebSocket iniciado en ws://localhost:${port}`);
    }

    private onConnection(ws: WebSocket) {
        console.log('Cliente conectado');

        ws.on('message', (message: string) => {
            console.log(`Mensaje recibido: ${message}`);
            ws.send(`Mensaje recibido por el servidor: ${message}`);
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
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