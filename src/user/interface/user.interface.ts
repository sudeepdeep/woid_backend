import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly profileUrl: string;
  readonly coverUrl: string;
  readonly applicationType: string;
  readonly messageIds: any[];
}
