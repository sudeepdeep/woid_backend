import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoCredentials } from './utils/mongoCredentials';
import { UserSchema, User } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { Post, PostSchema } from './schema/post.schema';
import { Article, ArticleSchema } from './schema/article.schema';
import { ArticleModule } from './article/article.module';
import { MessagesModule } from './messages/messages.module';
import {
  Message,
  MessageSchema,
  Messages,
  MessagesSchema,
} from './schema/message.schema';
import { UnilinksController } from './unilinks/unilinks.controller';
import { UnilinksService } from './unilinks/unilinks.service';
import { UnilinksModule } from './unilinks/unilinks.module';
import { Unilinks, UnilinksSchema } from './schema/unilinks.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    MongooseModule.forRoot(mongoCredentials().MONGO_URI, {
      autoIndex: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Messages.name, schema: MessagesSchema },
      { name: Unilinks.name, schema: UnilinksSchema },
    ]),
    UserModule,
    AuthModule,
    PostModule,
    ArticleModule,
    MessagesModule,
    UnilinksModule,
  ],
  controllers: [
    AppController,
    UserController,
    PostController,
    UnilinksController,
  ],
  providers: [AppService, UserService, PostService, UnilinksService],
})
export class AppModule {}
