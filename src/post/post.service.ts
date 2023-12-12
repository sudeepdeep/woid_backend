import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { User } from 'src/schema/user.schema';
import { groupBy } from 'lodash';
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<Post>,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async getAllPosts(id: string) {
    const posts = await this.model.find().sort({ createdAt: -1 });
    const postsMap = groupBy(posts, (v) => v.createdById);
    const postData = await Promise.all(
      Object.keys(postsMap).map(async (key) => {
        const allPosts = [];
        const posts = postsMap[key];
        for (const post of posts) {
          let liked = false;
          const user = await this.user.findById(post.createdById);
          if (post.likedBy.includes(id) == true) {
            liked = true;
          }
          const data = {
            post,
            user,
            liked,
          };

          allPosts.push(data);
        }
        return allPosts;
      }),
    );

    return postData[0];
  }

  async uploadPost(body: any) {
    const user = await this.user.findById(body.id);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const post = await this.model.create({
      images: body?.images,
      postDescription: body?.postDescription,
      createdById: user?.id,
      likedBy: [],
      createdAt: new Date(),
    });
    return post;
  }

  async likePost(postId: string, body: any) {
    const post = await this.model.findById(postId);
    if (!post) {
      throw new UnprocessableEntityException('post not found');
    }

    await this.model.findByIdAndUpdate(
      { _id: post.id },
      { $push: { likedBy: body.id } },
    );

    return post;
  }

  async disLikePost(postId: string, body: any) {
    const post = await this.model.findById(postId);
    if (!post) {
      throw new UnprocessableEntityException('post not found');
    }

    await this.model.findByIdAndUpdate(
      { _id: post.id },
      { $pull: { likedBy: body.id } },
    );

    return post;
  }

  async commentPost(postId: string, body: any) {
    const post = await this.model.findById(postId);
    if (!post) {
      throw new UnprocessableEntityException('post not found');
    }

    await this.model.findByIdAndUpdate(
      { _id: post.id },
      { $push: { comments: { comment: body.comment, userId: body.userId } } },
    );

    return post;
  }

  async delteCommentPost(postId: string, body: any) {
    const post = await this.model.findById(postId);
    if (!post) {
      throw new UnprocessableEntityException('post not found');
    }

    await this.model.findByIdAndUpdate(
      { _id: post.id },
      { $pull: { comments: { comment: body.comment, userId: body.userId } } },
    );

    return post;
  }

  async uploadImage(file: Express.Multer.File, id: string) {
    console.log(id, file);
    // const formData = new FormData();
    // const blob = new Blob([file.buffer], { type: file.mimetype });
    // formData.append('upload', blob, file.originalname);

    // const headers = {
    //   'api-key': 'nmxDcStIflZOh4zHMFhPJC9YbZiWxXmW',
    //   'Content-Type': 'multipart/form-data',
    // };

    // const config = {
    //   headers: headers,
    // };

    // return axios
    //   .post('https://api.apilayer.com/image_upload/upload', formData, config)
    //   .then((res) => res.data)
    //   .catch((err) => {
    //     console.log(err);
    //     throw err;
    //   });
  }
}
