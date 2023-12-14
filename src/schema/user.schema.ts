import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

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
  userBio: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  followers: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  following: string[];
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
