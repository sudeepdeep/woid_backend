import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Messages extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: false })
  viewed: boolean;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages).set(
  'timestamps',
  true,
);

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  messageId: string;

  @Prop({ type: [MessagesSchema] })
  messages: Messages[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
