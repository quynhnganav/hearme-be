import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "../logger/logger";
import { Server, Socket } from 'socket.io'
import { GatewayMetadataExtended } from "./interface";
import { AuthService } from "../auth/auth.service";
import { JWTVerifyPayload } from "../auth/auth.interface";
import { Schedule } from "../schedule/schema/schedule.schema";


export interface MemoryUserSoket { 
    clientId: string
    sessionId: string 
}

export enum EnumEvent {
    NEW_SCHEDULES = "NEW_SCHEDULES"
} 

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

    constructor(
        private authService: AuthService
    ) { }

    private logger = new Logger('PubSubSocket')
    private userMap = new Map<string, MemoryUserSoket[]>()

    @WebSocketServer()
    server: Server

    afterInit(server: Server) {
        // throw new Error("Method not implemented.");
        this.logger.success("App Gateway Initialized")
    }

    async handleConnection(client: Socket, ...args: any[]) {
        // throw new Error("Method not implemented.");
        const token: any = client.handshake?.query?.token;
        if (!token) {
            client.disconnect()
            console.log("Connect Faild", client.id)
            return
        }
        try {
            const payload: JWTVerifyPayload = await this.authService.verifyToken(token)
            if (!payload) throw new Error()
            this.mapUserAndSocketId(payload.user._id, client.id, payload.session._id)
        } catch (error) {
            client.disconnect()
            console.log("Connect Faild", client.id)
            return
        }
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

    sendMessageToUser(event: EnumEvent, user_id: string, content: any) {
        const clientsOfUser: MemoryUserSoket[] = this.userMap.get(`${user_id}`) || []
        clientsOfUser.forEach(client => {
            this.server.to(client.clientId).emit(event.toString(), content)
        })
    }

    mapUserAndSocketId(user_id: string, client_id: string, sessionId: string) {
        const clientsOfUser: MemoryUserSoket[] = this.userMap.get(user_id) || []
        this.userMap.set(`${user_id}`, [...clientsOfUser, { clientId: client_id, sessionId: `${sessionId}` }])
    }

}