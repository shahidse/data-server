import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { UserDocument } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
// import { VerificationCodeDocument } from './entities/verificationcode.entity';
// import { FileSystemService } from '../file-system/file-system.service';
// import { AboutService } from '../about/about.service';
// import { SkillsService } from '../skills/skills.service';
// // import { FriendsService } from '../friends/friends.service';
// // import { FriendStatus } from '../friends/entities/friend.entity';
// import { RoleDocument } from './entities/role.entity';
// import { UserGroupDocument } from './entities/ug.entity';
// import { RootDocument } from './entities/root.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<UserDocument>,
    private emailServices: EmailService,
    private configService: ConfigService,
    // @Inject('VERIFIVATIONCODE_MODEL')
    // private verificationcodeModel: Model<VerificationCodeDocument>,
    // private fileSystem: FileSystemService,
    // private aboutService: AboutService,
    // private skillService: SkillsService,
    // @Inject('ROLES_MODEL')
    // private rolesModel: Model<RoleDocument>,
    // @Inject('USERGROUP_MODEL')
    // private ugModel: Model<UserGroupDocument>,
    // @Inject('ROOT_MODEL')
    // private rootModel: Model<RootDocument>,
  ) {}
  private readonly logger = new Logger(UsersService.name);
  async create(createUserDto: CreateUserDto) {
    try {
      // createUserDto.role = await this.getRoleIdForUser();
      const link='';
      this.emailServices.sendMail(
        'gmail',
        createUserDto.email,
        this.configService.get<string>('emailConfig.email') || '',
        'Your Verification Link For Signup',
        'emailVerification',
        {
          userName: createUserDto.userName,
          link,
        },
      );
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    } catch (error) {
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: 'ERROR IN SAVING DATA', description: 'ERROR IN SAVING DATA' },
      );
    }
  }
  // async updateUser(createUserDto: CreateUserDto) {
  //   let updatedUser: any = await this.userModel.findOneAndUpdate(
  //     {
  //       email: createUserDto.email,
  //       verificationToken: createUserDto.verificationToken,
  //     },
  //     createUserDto,
  //     { new: true },
  //   );
  //   if (updatedUser) {
  //     const verifiedUser = await this.userModel.findOneAndUpdate(
  //       { email: updatedUser.email },
  //       { isVerified: true, verificationToken: '' },
  //       { new: true },
  //     );
  //     updatedUser = verifiedUser;
  //   }
  //   return updatedUser;
  // }
  // async createTokenForUser(data: any) {
  //   const { email } = data;

  //   // Find and update the user document based on the email
  //   const updatedTokenData = await this.verificationcodeModel.findOneAndUpdate(
  //     { email },
  //     data,
  //     {
  //       new: true,
  //       upsert: true,
  //     },
  //   );
  //   return updatedTokenData;
  // }

  async findOne(identity: string, email: any): Promise<any> {
    return await this.userModel.findOne({ [identity]: email });
  }
  // async findOneTokenUser(
  //   identity: string,
  //   email: any,
  //   code: string,
  // ): Promise<any> {
  //   return await this.verificationcodeModel.findOne({
  //     [identity]: email,
  //     code,
  //   });
  // }
  async update(param: any, filter: any, options: any = undefined) {
    return await this.userModel.updateOne(filter, param, options).exec();
  }
  async findOneAndUpdate(filter: any, param: any, options: any = undefined) {
    const updatedUser = await this.userModel
      .findOneAndUpdate(filter, param, options)
      .exec();
    return updatedUser?.save();
  }
  // async delete(id: ObjectId) {
  //   const deleteUser = await this.userModel.findByIdAndDelete(id);
  //   return deleteUser;
  // }
  // async unLinkFile(userId: ObjectId, body: any = null): Promise<boolean> {
  //   try {
  //     this.logger.log(`Unlinking File on path`);
  //     const userData = await this.userModel.findById(userId);
  //     if (userData) {
  //       const directory = './upload/';
  //       if (userData.image) {
  //         const image = userData.image;
  //         const cover = userData.cover;
  //         const imagePath = directory + image;
  //         const coverPath = directory + cover;
  //         if (body?.cover) {
  //           this.fileSystem.deleteFile(coverPath);
  //         }
  //         if (body?.image) {
  //           this.fileSystem.deleteFile(imagePath);
  //         }
  //         return true;
  //       }
  //     }
  //     return false;
  //   } catch (error) {
  //     this.logger.error(error);
  //     return false;
  //   }
  // }
  // async getProfileById(userId: Types.ObjectId, otherUserId: Types.ObjectId) {
  //   const userData: any = {};
  //   const userResp = await this.checkFriendshipStatus(
  //     {
  //       _id: new Types.ObjectId(otherUserId),
  //     },
  //     new Types.ObjectId(userId),
  //   );
  //   userData.user = userResp[0];
  //   userData.userSkills = await this.skillService.findAll(otherUserId);
  //   userData.about =
  //     (await this.aboutService.findAll(otherUserId))?.description || '';
  //   userData.friends =
  //     (await this.getRelatedFriends(otherUserId, userId)) || [];
  //   userData.achievements = [];
  //   return userData;
  // }
  // //get other user friendship status
  // async checkFriendshipStatus(filter: any = null, userId: Types.ObjectId) {
  //   const userData = await this.userModel
  //     .aggregate([
  //       {
  //         $match: filter,
  //       },
  //       {
  //         $project: {
  //           userName: 1,
  //           email: 1,
  //           fullName: 1,
  //           image: 1,
  //           cover: 1,
  //           _id: 1,
  //           isPending: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $size: {
  //                       $filter: {
  //                         input: '$friends',
  //                         as: 'f',
  //                         cond: {
  //                           $and: [
  //                             { $eq: ['$$f.friendId', userId] },
  //                             { $eq: ['$$f.status', 'pending'] },
  //                           ],
  //                         },
  //                       },
  //                     },
  //                   },
  //                   0,
  //                 ],
  //               },
  //               then: true,
  //               else: false,
  //             },
  //           },
  //           isFriend: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $size: {
  //                       $filter: {
  //                         input: '$friends',
  //                         as: 'f',
  //                         cond: {
  //                           $and: [
  //                             { $eq: ['$$f.friendId', userId] },
  //                             { $eq: ['$$f.status', 'accepted'] },
  //                           ],
  //                         },
  //                       },
  //                     },
  //                   },
  //                   0,
  //                 ],
  //               },
  //               then: true,
  //               else: false,
  //             },
  //           },
  //           isReqSentByYou: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $size: {
  //                       $filter: {
  //                         input: '$friends',
  //                         as: 'f',
  //                         cond: {
  //                           $and: [
  //                             { $eq: ['$$f.friendId', userId] },
  //                             { $eq: ['$$f.request', false] },
  //                             {
  //                               $ne: ['$$f.status', 'unfriend'],
  //                             },
  //                             {
  //                               $ne: ['$$f.status', 'rejected'],
  //                             },
  //                           ],
  //                         },
  //                       },
  //                     },
  //                   },
  //                   0,
  //                 ],
  //               },
  //               then: true,
  //               else: false,
  //             },
  //           },
  //           isReqRecievedByYou: {
  //             $cond: {
  //               if: {
  //                 $gt: [
  //                   {
  //                     $size: {
  //                       $filter: {
  //                         input: '$friends',
  //                         as: 'f',
  //                         cond: {
  //                           $and: [
  //                             { $eq: ['$$f.friendId', userId] },
  //                             { $eq: ['$$f.request', true] },
  //                             {
  //                               $ne: ['$$f.status', 'unfriend'],
  //                             },
  //                             {
  //                               $ne: ['$$f.status', 'rejected'],
  //                             },
  //                           ],
  //                         },
  //                       },
  //                     },
  //                   },
  //                   0,
  //                 ],
  //               },
  //               then: true,
  //               else: false,
  //             },
  //           },
  //         },
  //       },
  //     ])
  //     .exec();
  //   return userData;
  // }
  // async getRelatedFriends(
  //   friendId: Types.ObjectId,
  //   userId: Types.ObjectId,
  //   page: number = 1,
  //   limit: number = 10,
  // ) {
  //   try {
  //     const friend = await this.userModel.findById(friendId).populate({
  //       path: 'friends.friendId',
  //       match: {
  //         'friends.status': { $eq: FriendStatus.Accepted },
  //       },
  //       select: 'fullName userName email image _id',
  //       options: {
  //         skip: (page - 1) * limit,
  //         limit: limit,
  //       },
  //     });
  //     const filteredFriends = friend?.friends.filter((item: any) => {
  //       return item.friendId != null && item.friendId._id != userId;
  //     });
  //     return filteredFriends?.map((item: any) => {
  //       return item?.friendId;
  //     });
  //   } catch (error) {
  //     this.logger.error(error);
  //     return [];
  //   }
  // }
  // async getRoleIdForUser() {
  //   const rootData = await this.rootModel.findOne({ root: 'root' });
  //   const userGroup = await this.ugModel.findOne({
  //     userGroup: 'ActiveFamilyHq',
  //     rootId: rootData?._id,
  //   });
  //   const userRole = await this.rolesModel.findOne({
  //     role: 'user',
  //     ugId: userGroup?._id,
  //   });
  //   return userRole?._id;
  // }
  // async getRoot(filter: any, projection: any = null) {
  //   const rootData = await this.rootModel.findOne(filter, projection);
  //   return rootData;
  // }
  // async getUg(filter: any, projection: any = null) {
  //   const userGroup = await this.ugModel.findOne(filter, projection);
  //   return userGroup;
  // }
  // async getRoles(filter: any, projection: any = null): Promise<any> {
  //   const role = await this.rolesModel.findOne(filter, projection);
  //   return role;
  // }
}
