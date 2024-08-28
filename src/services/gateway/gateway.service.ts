import { IGatewayService } from '@/common/interfaces/abstracts/gateway.service';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class GatewayService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, IGatewayService {

   private clients: Set<Socket> = new Set();

   @WebSocketServer() server: Server;

   public afterInit(server: Server) {
      console.log('WebSocket Gateway initialized');
   }

   public handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.clients.add(client);
   }

   public handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.clients.delete(client);
   }

   @SubscribeMessage('sendNotification')
   public sendNotification(@MessageBody() data: any): void {
      this.server.emit('notification', data);
   }
}