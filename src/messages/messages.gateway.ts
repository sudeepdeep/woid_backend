import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly service: MessagesService) {}

  handleConnection(client: any, roomId: string) {
    this.service.joinRoom(client, roomId);
  }
  handleDisconnect(client: any) {
    console.log(client);
  }

  // handleDisconnect(client: any, roomId: string) {
  //   console.log(client, roomId);
  // }

  @SubscribeMessage(':id')
  handleMessage(@MessageBody() data: any) {
    console.log(data);
  }
}
