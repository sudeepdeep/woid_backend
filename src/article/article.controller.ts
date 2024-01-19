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
}
