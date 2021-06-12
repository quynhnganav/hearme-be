import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "../logger/logger";
import { Server, Socket } from 'socket.io'
import { GatewayMetadataExtended } from "./interface";

const options = {
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, authorization, x-token',
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': '1728000',
        'Content-Length': '0',
      };
      res.writeHead(200, headers);
      res.end();
    },
  } as GatewayMetadataExtended;

@WebSocketGateway(options)
export class PubSubSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private logger = new Logger('PubSubSocket')

    @WebSocketServer()
    server: Server

    afterInit(server: Server) {
        // throw new Error("Method not implemented.");
        this.logger.success("App Gateway Initialized")
    }
    handleConnection(client: Socket, ...args: any[]) {
        // throw new Error("Method not implemented.");
        console.log("Connected", client.id)
    }
    handleDisconnect(client: Socket) {
        // throw new Error("Method not implemented.");
        console.log("Disconnect", client.id)
    }

    @SubscribeMessage('events')
    async eventsTest(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        this.server.emit('events', data)
        client.emit('events', data)
        return 'ok'
    }
    
}