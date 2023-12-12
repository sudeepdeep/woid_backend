import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export class Comment {
  @Prop()
  comment: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  userId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema()
export class Post {
  @Prop()
  postDescription: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  likedBy: string[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: MongooseSchema.Types.ObjectId })
  createdById: string;

  @Prop()
  createdAt: Date;

  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
