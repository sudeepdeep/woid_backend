import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export class Messages {
  @Prop({ required: true })
  text: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  senderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  receiverId: string;

  @Prop()
  createdAt: string;

  @Prop()
  viewed: boolean;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);

@Schema()
export class Message {
  @Prop({ required: true, default: [], type: [MongooseSchema.Types.ObjectId] })
  users: string[];

  @Prop({ type: [MessagesSchema], default: [] })
  messages: Messages[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
