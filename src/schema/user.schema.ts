import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Schema()
export class MessageId extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  messageId: string;
}

export const MessageIdSchema = SchemaFactory.createForClass(MessageId);

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  profileUrl: string;

  @Prop()
  coverUrl: string;

  @Prop()
  bio: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  followers: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  following: string[];

  @Prop({ default: 'woid' })
  applicationType: string;

  @Prop({ type: [MessageIdSchema], default: [] })
  messageIds: MessageId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync(this.password, salt);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err); // Pass the error to the next middleware or function
  }
});

UserSchema.index({ username: 'text' });
