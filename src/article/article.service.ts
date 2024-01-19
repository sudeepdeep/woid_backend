import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from 'src/schema/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly model: Model<Article>,
  ) {}
  async postArticle(body: any) {
    return this.model.create(body);
  }

  async getArticles(lat: any, long: any) {
    const radius = 10;
    return this.model
      .find({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [long, lat],
            },
            $maxDistance: radius * 1000,
          },
        },
      })
      .exec();
  }

  async getArticle(id: string) {
    return this.model.findOne({ _id: id });
  }
}
