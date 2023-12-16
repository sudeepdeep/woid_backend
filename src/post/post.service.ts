import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { User } from 'src/schema/user.schema';
import { groupBy, flatten } from 'lodash';
import * as admin from 'firebase-admin';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<Post>,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async getAllPosts(id: string, query: any) {
    const posts = await this.model
      .find()
      .sort({ createdAt: -1 })
      .limit(2 * query.page);
    const currentUser = await this.user.findById(id);
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
          if (
            query.type == 'following' &&
            !currentUser.following.includes(post.createdById) &&
            !post.createdById.equals(currentUser._id)
          ) {
            continue;
          }

          if (
            query.type == 'my-posts' &&
            !post.createdById.equals(currentUser._id)
          ) {
            continue;
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

    return flatten(postData);
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

  async updatePost(postId: string, body: any) {
    const post = await this.model.findById(postId);
    await this.model.findByIdAndUpdate(
      { _id: post.id },
      { images: body.images },
    );
  }

  async deletePost(postId: string) {
    const post = await this.model.findById(postId);
    if (!post) {
      throw new UnprocessableEntityException('post not found');
    }
    await this.model.deleteOne({ _id: postId });
  }

  async uploadImage(file: Express.Multer.File, id: string) {
    const bucket = admin.storage().bucket();
    const destination = `posts/${id}/${file.originalname}`;

    const fileUpload = bucket.file(destination);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Error uploading to Firebase Storage:', err);
        reject('Error uploading to Firebase Storage');
      });

      stream.on('finish', async () => {
        // Generate a signed URL for the file
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '01-01-3000', // Adjust the expiration date as needed
        });

        console.log('Upload to Firebase Storage successful');
        resolve(url);
      });

      // Write the buffer to the stream
      stream.end(file.buffer);
    });
  }
}
