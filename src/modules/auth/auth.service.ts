import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin-dto';
import { JwtService } from '@nestjs/jwt';
import { SignInReturnDto } from './dto/singin-return-dto';
import * as bcrypt from 'bcrypt';
import { generateDynamicCode, getIdentity } from 'src/utils/helpers';
// import { EmailService } from '../email/email.service';
// import { ConfigService } from '@nestjs/config';
import { Model, ObjectId, set } from 'mongoose';
// import { CreateUserDto } from '../users/dto/create-user.dto';
// import { InjectModel } from '@nestjs/mongoose';
import { BlackListTokenDocument } from './entities/blacklisttoken.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private emailService: EmailService,
    // private configService: ConfigService,
    @Inject('BLACKLISTTOKEN_MODEL')
    private blacklistokenModel: Model<BlackListTokenDocument>,
  ) {}
  private readonly logger = new Logger(AuthService.name);
  async signIn(data: SignInDto): Promise<SignInReturnDto> {
    try {
      const identity = getIdentity(data.email);
      const user = await this.usersService.findOne(identity, data.email);
      if (user) {
        const isAuthentic = bcrypt.compareSync(data?.password, user?.password);
        if (!isAuthentic) {
          throw new UnauthorizedException('UNAUTHORIZED', {
            cause: 'Invalid credentials',
            description: 'Invalid credentials',
          });
        }
      } else {
        throw new UnauthorizedException('UNAUTHORIZED', {
          cause: 'Invalid credentials',
          description: 'Invalid credentials',
        });
      }

      const payload = {
        sub: user.fullName,
        email: user.email,
        userId: user._id,
        role: user.role,
        roleName: '',
        adminId: user._id,
      };
      // const roleData = await this.usersService.getRoles({
      //   _id: user.role,
      // });
      // if (roleData) {
      //   payload.roleName = roleData.role;
      // }
      const access_token = await this.jwtService.signAsync(payload);
      const {
        password,
        verificationToken,
        passworResetAttempt,
        passwordResetToken,
        role,
        ...userData
      } = user.toObject();
      return {
        success: true,
        access_token,
        userData,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error?.response, error.status, {
        cause: error?.cause,
        description: error?.description,
      });
    }
  }
  async verifyEmailToken(token: string, email: string) {
    const result = await this.usersService.update(
      {
        $set: {
          isVerified: true,
          verificationToken: '',
        },
      },
      { email, verificationToken: token },
    );
    return result;
  }
  // async sendCode(email: string) {
  //   // Generate a random code and save it to the database for later use in sending an email with that code as well as saving it on the
  //   const code = generateDynamicCode(6);
  //   const data = {
  //     email,
  //     code,
  //   };
  //   const isUserExist = await this.usersService.findOne('email', email);
  //   await this.usersService.createTokenForUser(data);
  //   if (isUserExist) {
  //     await this.emailService.sendMail2(
  //       'gmail',
  //       email,
  //       this.configService.get<string>('emailConfig.email') || '',
  //       'Reset Your Password - One-Time Password (OTP) Request',
  //       'resetPasswordCode',
  //       {
  //         userName: '',
  //         resetCode: code,
  //       },
  //     );
  //   } else {
  //     await this.emailService.sendMail2(
  //       'gmail',
  //       email,
  //       this.configService.get<string>('emailConfig.email') || '',
  //       'Your One-Time Password (OTP) for Signup',
  //       'emailVerification',
  //       {
  //         userName: '',
  //         resetCode: code,
  //       },
  //     );
  //   }
  //   return { emailSent: true };
  // }
  // async verifyCode(code: string, email: string, newPassword: string) {
  //   const user = await this.usersService.findOneTokenUser('email', email, code);
  //   if (user) {
  //     const saltRounds = 10; // Adjust the number of salt rounds as needed
  //     const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  //     await this.usersService.findOneAndUpdate(
  //       { email },
  //       {
  //         $set: {
  //           password: passwordHash,
  //         },
  //       },
  //       { new: true },
  //     );
  //     return {
  //       wrongCode: false,
  //       passwordUpdated: true,
  //     };
  //     // }
  //     // const incrementValue = 1;
  //     // const updatedUser = await this.usersService.findOneAndUpdate(
  //     //   { email },
  //     //   {
  //     //     $inc: { passworResetAttempt: incrementValue },
  //     //   },
  //     //   { new: true },
  //     // );
  //     // const remaingTry = 3 - Number(updatedUser?.passworResetAttempt);
  //     // return {
  //     //   wrondCode: true,
  //     //   passwordUpdated: false,
  //     //   remainingAtempt: remaingTry,
  //     // };
  //     // // }
  //     // return {
  //     //   tokenExpire: true,
  //     //   passwordUpdated: false,
  //     // };
  //   }
  //   return {
  //     wrongCode: true,
  //     passwordUpdated: false,
  //   };
  // }
  async findToken(token: string) {
    const blacklistToken = await this.blacklistokenModel.findOne({
      token,
    });
    return blacklistToken;
  }
  async saveBlacklistToken(token: string, userId: ObjectId) {
    const saveToken = new this.blacklistokenModel({ token, userId });
    const data = await saveToken.save();
    return data;
  }
}
