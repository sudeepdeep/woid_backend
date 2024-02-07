import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
    const radius = 50;
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
    return this.model.findOne({ _id: id }).populate('comments').exec();
  }

  async getUserArticles(id: string) {
    return this.model.find({ username: id });
  }

  async likeArticle(param: any) {
    const article = await this.model.findOne({ _id: param.articleId });
    if (!article) {
      throw new UnprocessableEntityException('article not found');
    }

    if (article.likedBy.includes(param.userId))
      return 'user already liked post';

    await this.model.findByIdAndUpdate(
      { _id: param.articleId },
      { $push: { likedBy: param.userId } },
    );

    return article;
  }

  async dislikeArticle(param: any) {
    const article = await this.model.findOne({ _id: param.articleId });
    if (!article) {
      throw new UnprocessableEntityException('article not found');
    }

    if (article.likedBy.includes(param.userId)) {
      await this.model.findByIdAndUpdate(
        { _id: param.articleId },
        { $pull: { likedBy: param.userId } },
      );
    }
    return article;
  }

  async postComment(articleId: string, comment: any) {
    const article = await this.model.findOne({ _id: articleId });
    if (!article) {
      throw new UnprocessableEntityException('article not found');
    }
    const newComment = { ...comment };
    article.comments.push(newComment);
    return await article.save();
  }
}
