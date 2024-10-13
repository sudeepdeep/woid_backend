import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unilinks } from 'src/schema/unilinks.schema';
import { User } from 'src/schema/user.schema';
import { IUnilinks } from 'src/user/interface/unilinks.interface';
import { IUser } from 'src/user/interface/user.interface';

@Injectable()
export class UnilinksService {
  constructor(
    @InjectModel(Unilinks.name) private readonly model: Model<IUnilinks>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async createUnilinks(data: IUnilinks) {
    //check if customer exists with the given username
    const user: IUser = await this.userModel.findById(data.userId);
    if (!user) {
      return {
        message: 'User not found',
        status: 202,
      };
    }
    //check if any unilinks available
    const uniLinks: any = await this.model.find({ userId: data.userId });
    if (uniLinks && uniLinks?.length > 0) {
      if (uniLinks.socialMediaLinks && uniLinks.socialMediaLinks.length > 0) {
        const smLinks = uniLinks.socialMediaLinks.map((item) => item.siteName);
        const newSmLinks = data.socialMediaLinks.map((item) => item.siteName);
        if (smLinks && smLinks.length > 0) {
          for (const i of newSmLinks) {
            if (smLinks.includes(i)) {
              return {
                message:
                  'Some of the social media links are already present. please check and re-upload',
                status: 202,
              };
            }
          }
        }
      }
    }

    const data_ = await this.model.create(data);

    return {
      data: data_,
      message: 'Successfully created UNILINK for the user',
      status: 200,
    };
  }

  async updateUnilinks(uniLinkId: any, body: any) {
    //check if the particular unilink exists
    const uniLink = await this.model.findById(uniLinkId);
    if (!uniLink) {
      return { message: 'no unilink found', status: 202 };
    }
    const data_ = await this.model.findByIdAndUpdate(uniLinkId, body, {
      new: true,
    });

    return {
      data: data_,
      message: 'User updated successfully',
      status: 200,
    };
  }

  async getUniLinksByUsername(username: any) {
    const uniLink = await this.model.findOne({ username: username });
    if (!uniLink) {
      return { message: 'no user found', status: 202 };
    }
    return {
      data: uniLink,
      message: 'unlinks fetched successfully',
      status: 200,
    };
  }

  async deleteUnilink(uniLinkId: any) {
    //check if the unilink exits
    const uniLink = await this.model.findById(uniLinkId);
    if (!uniLink) {
      return { message: 'no unilink found', status: 202 };
    }
    //delete the unilink
    const data_ = await this.model.deleteOne({ _id: uniLinkId });
    return {
      data: data_,
      message: 'deleted unlink successfully',
      status: 200,
    };
  }

  async getAllUnlinksByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        message: 'User not found',
        status: 202,
      };
    }

    const unLinks = await this.model.find({ userId: userId });
    return {
      data: unLinks,
      message: 'unlinks fetched successfully',
      status: 200,
    };
  }

  async getUnlinkById(id: string) {
    const unlink = await this.model.findById(id);
    if (!unlink) {
      return {
        message: 'unlink not found',
        status: 202,
      };
    }

    return {
      data: unlink,
      message: 'unlink fetched successfully',
      status: 200,
    };
  }

  async getAllUnilinks() {
    const unilinks = await this.model.find();
    return unilinks;
  }
}
