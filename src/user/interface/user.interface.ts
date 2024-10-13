import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly profileUrl: string;
  readonly userType: string;
  readonly tenantIds: any[];
  readonly address: string;
  readonly aadharNumber: string;
  readonly phoneNumber: string;
  readonly employeeId: string;
  readonly messageIds: any;
}
