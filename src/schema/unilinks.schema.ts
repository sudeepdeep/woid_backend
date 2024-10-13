import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LinkClick extends Document {
  @Prop({ required: true })
  siteName: string;

  @Prop({ required: true })
  count: string;
}

@Schema()
export class SocialMediaLink extends Document {
  @Prop()
  siteName: string;

  @Prop({ default: [] })
  siteUrl: string[];

  @Prop({ default: false })
  isPromotionalContent: boolean;

  @Prop()
  description: string;
}

export const LinkClickSchema = SchemaFactory.createForClass(LinkClick);
export const SocialMediaLinkSchema =
  SchemaFactory.createForClass(SocialMediaLink);

@Schema()
export class Unilinks extends Document {
  @Prop({ required: true })
  username: string;

  @Prop()
  userId: string;

  @Prop({ required: true })
  userType: string;

  @Prop()
  coverUrl: string;

  @Prop()
  profileUrl: string;

  @Prop({ type: [LinkClickSchema], default: [] })
  linkClicks: LinkClick[];

  @Prop({ type: [SocialMediaLinkSchema], default: [] })
  socialMediaLinks: SocialMediaLink[];

  @Prop()
  bannerUrl: string;

  @Prop({ default: [] })
  orderOfLinks: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  modifiedAt: Date;
}

export const UnilinksSchema = SchemaFactory.createForClass(Unilinks);
