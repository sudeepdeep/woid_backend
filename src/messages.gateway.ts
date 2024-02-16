import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(client, data): any {
    console.log(client, data);
    this.server.emit('message', data);
  }
}
