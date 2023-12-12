import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get(':id')
  getAllPosts(@Param('id') id: string) {
    return this.service.getAllPosts(id);
  }

  @Post('/upload-post')
  postUpload(@Body() body: any) {
    return this.service.uploadPost(body);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  feedUpload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.service.uploadImage(file, id);
  }

  @Post(':postId/like-post')
  likePost(@Param('postId') postId: string, @Body() body: any) {
    return this.service.likePost(postId, body);
  }

  @Post(':postId/delete-like')
  deleteLike(@Param('postId') postId: string, @Body() body: any) {
    return this.service.disLikePost(postId, body);
  }

  @Post(':postId/comment-post')
  commentPost(@Param('postId') postId: string, body: any) {
    return this.service.commentPost(postId, body);
  }

  @Post(':postId/delete-comment')
  deleteComment(@Param('postId') postId: string, body: any) {
    return this.service.delteCommentPost(postId, body);
  }
}
