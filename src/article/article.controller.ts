import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}
  @Post()
  async createArticle(@Body() body: any) {
    return this.service.postArticle(body);
  }

  @Get()
  async getArticles(@Query() query: any) {
    return this.service.getArticles(query.lat, query.lng);
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    return this.service.getArticle(id);
  }

  @Get('articles/:username')
  async getUserArticles(@Param('username') id: string) {
    return this.service.getUserArticles(id);
  }

  @Post('like-article/:articleId/:userId')
  async likeArticle(@Param() param: any) {
    return this.service.likeArticle(param);
  }

  @Post('dislike-article/:articleId/:userId')
  async dislikeArticle(@Param() param: any) {
    return this.service.dislikeArticle(param);
  }

  @Post('delete-article/:articleId/:userId')
  async deleteArticle(@Param() param: any) {
    return this.service.deleteArticle(param);
  }

  @Post('post-comment/:articleId')
  async postComment(
    @Param('articleId') articleId: string,
    @Body() comment: any,
  ) {
    return this.service.postComment(articleId, comment);
  }
}
