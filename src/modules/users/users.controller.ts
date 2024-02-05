import {
  Controller,
  Post,
  Body,
  // Patch,
  // Delete,
  HttpException,
  // HttpStatus,
  // Req,
  InternalServerErrorException,
  // HttpCode,
  Param,
  Get,
  NotFoundException,
  Logger,
  // Put,
  // UploadedFile,
  // UseInterceptors,
  // BadRequestException,
  // UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorator/public.decorator';
// import { findUserDto } from './dto/find-user.dto';
import { ObjectId, Schema, Types } from 'mongoose';
// import { upadatePasswordDto } from './dto/update-password-dto';
// import * as bcrypt from 'bcrypt';
// import { UpdateUserDto } from './dto/update-user.dto';
// import {
//   FileFieldsInterceptor,
//   FileInterceptor,
// } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`starting execution of ${this.create.name} method`);
    try {
      // const isTokenValid = await this.usersService.findOneTokenUser(
      //   'email',
      //   createUserDto.email,
      //   createUserDto.verificationToken,
      // );
      // if (!isTokenValid) {
      //   throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST, {
      //     cause: 'Invalid verfication code',
      //     description: 'Invalid verfication code',
      //   });
      // }
      const user = await this.usersService.create(createUserDto);
      const {
        password,
        verificationToken,
        // passworResetAttempt,
        // passwordResetToken,
        ...userData
      } = user.toObject();
      return {
        userData,
        message: 'user successfully created',
      };
    } catch (error) {
      this.logger.error('Error', error, [error]);
      const status = error.status ? error.status : 500;
      throw new HttpException(error?.message, status, {
        cause: error?.cause,
        description: error?.description,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId) {
    try {
      this.logger.log(`starting execution of ${this.findOne.name} method`);
      const user = await this.usersService.findOne('_id', id);
      if (!user || !user._id)
        throw new NotFoundException(`Could not find the User with ID ${id}`);
      else {
        const userData = JSON.parse(JSON.stringify(user));
        delete userData.verificationToken;
        delete userData.password;
        delete userData.passworResetAttempt;
        delete userData.passworResetAttempt;
        return {
          userData,
        };
      }
    } catch (error) {
      this.logger.error('Error', error, [error]);
      throw new InternalServerErrorException(error);
    }
  }
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @Post('find')
  // async findUser(@Body() findUserDto: findUserDto) {
  //   try {
  //     const result = [];
  //     const keys = Object.getOwnPropertyNames(findUserDto);
  //     for (const key of keys) {
  //       const user = await this.usersService.findOne(key, findUserDto[key]);
  //       if (user) {
  //         result.push(`user against ${key} exist`);
  //       }
  //     }
  //     return {
  //       success: true,
  //       message: 'success',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // @Delete()
  // async remove(@Req() req: any) {
  //   try {
  //     this.logger.log('Executing DELETE api/v1/users');

  //     const deletedUser = await this.usersService.delete(req.user.userId);
  //     if (!deletedUser) {
  //       throw new NotFoundException({ message: 'No User Found' });
  //     }
  //     return {
  //       deletedUser,
  //       success: true,
  //       message: 'user deleted successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // @Patch()
  // async updatePassword(@Req() req: any, @Body() body: upadatePasswordDto) {
  //   try {
  //     this.logger.log(
  //       `Executing ${this.updatePassword.name} PATCH api/v1/user`,
  //     );
  //     const userData = await this.usersService.findOne('_id', req.user.userId);
  //     if (!userData) {
  //       throw new NotFoundException('no data found');
  //     }
  //     const isMatched = bcrypt.compareSync(body.oldPassword, userData.password);
  //     if (!isMatched) {
  //       return { success: false, message: 'wrong old password' };
  //     }
  //     const saltRounds = 10; // Adjust the number of salt rounds as needed
  //     const hash = await bcrypt.hash(body.newPassword, saltRounds);

  //     const updatePassword = this.usersService.update(
  //       {
  //         password: hash,
  //       },
  //       {
  //         _id: req.user.userId,
  //       },
  //     );
  //     return {
  //       updatePassword,
  //       success: true,
  //       message: 'updated succesfully',
  //     };
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // @Put()
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'image', maxCount: 1 },
  //       { name: 'cover', maxCount: 1 },
  //     ],
  //     {
  //       storage: diskStorage({
  //         destination: (req, file, cb) => {
  //           // Define the destination directory where you want to save the file
  //           const destination = './upload/users';
  //           cb(null, destination);
  //         },
  //         filename: (req, file, cb) => {
  //           // Generate a new file name (e.g., timestamp + originalname)
  //           const timestamp = new Date().getTime();
  //           const newFileName = `${timestamp}_${file.originalname}`;

  //           // Set the new file name for the uploaded file
  //           file.originalname = newFileName;

  //           // Pass the new file name to the callback
  //           cb(null, newFileName);
  //         },
  //       }),
  //       fileFilter: (req, file, cb) => {
  //         // Define allowed file types
  //         const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

  //         if (allowedMimes.includes(file.mimetype)) {
  //           cb(null, true);
  //         } else {
  //           cb(new BadRequestException('Invalid file type'), false);
  //         }
  //       },
  //       limits: {
  //         fileSize: 20971520, // 20MB limit
  //       },
  //     },
  //   ),
  // )
  // async updateUser(
  //   @UploadedFiles()
  //   file: any,
  //   @Req() req: any,
  //   @Body() body: UpdateUserDto,
  // ) {
  //   try {
  //     this.logger.log(
  //       `Executing PUT api/v1/user ${
  //         this.updateUser.name
  //       } payload:[${JSON.stringify(body)}]`,
  //     );
  //     console.log(file);
  //     if (file?.image) {
  //       body.image = file?.image[0]?.path?.replace(/^upload\//, '');
  //     }
  //     if (file?.cover) {
  //       body.cover = file?.cover[0]?.path?.replace(/^upload\//, '');
  //     }
  //     await this.usersService.unLinkFile(req.user.userId, body);
  //     const updateUserData = await this.usersService.findOneAndUpdate(
  //       {
  //         _id: req.user.userId,
  //       },
  //       body,
  //       {
  //         new: true,
  //         upsert: false,
  //       },
  //     );

  //     return {
  //       success: true,
  //       message: 'user update successfully',
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     this.logger.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }
  // @Get('profile/:id')
  // async getProfile(@Param('id') id: Types.ObjectId, @Req() req: any) {
  //   try {
  //     this.logger.log(`Executing GET api/v1/users/profile/:id for id: ${id}`);
  //     const data = await this.usersService.getProfileById(req.user.userId, id);
  //     return {
  //       success: true,
  //       message: 'success',
  //       data,
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to fetch user profile by ID [${id}], Error: ${error}`,
  //     );
  //     throw new InternalServerErrorException(error);
  //   }
  // }
}
