import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Article {
  @Prop({ required: true })
  username: string;

  @Prop()
  userId: string;

  @Prop({ required: true })
  userType: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  abstract: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  coverUrl: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' } })
  type: string;

  @Prop({ required: true, type: [Number], index: '2dsphere' })
  coordinates: [number];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ location: '2dsphere' });
