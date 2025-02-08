import { Document } from 'mongoose';

export interface IUnilinks extends Document {
  readonly username: string;
  readonly userId: string;
  readonly profileUrl: string;
  readonly coverUrl: string;
  readonly userType: string;
  readonly linkClicks: any[];
  readonly socialMediaLinks: any[];
  readonly createdAt: string;
  readonly modifiedAt: string;
  readonly bannerUrl: string;
  readonly orderOfLinks: string;
  readonly notes: any[];
}
