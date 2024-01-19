import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/schema/article.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class ArticleModule {}
