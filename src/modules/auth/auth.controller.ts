import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
  Get,
  Query,
  // Version,
  Logger,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { Public } from 'src/decorator/public.decorator';
// import { passwordResetDto } from './dto/password-reset.dto';
import { EmailService } from '../email/email.service';
// import { generateDynamicCode } from 'src/utils/helpers';
// import { verifyCodeDto } from './dto/verify-code.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(signInDto);
    return data;
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verify/:email')
  async verify(
    @Param() email: { email: string },
    @Query() token: { token: string },
  ) {
    try {
      const dbResult = await this.authService.verifyEmailToken(
        token.token,
        email.email,
      );
      return {
        success: true,
        message: `your email is ${
          dbResult.modifiedCount ? '' : 'already'
        } verified`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: 'Internal Server Error',
          description: 'Internal Server Error',
        },
      );
    }
  }
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @Post('send-code')
  // async sendCodeEmail(@Body() passwordResetDto: passwordResetDto) {
  //   this.logger.log(`starting execution of ${this.sendCodeEmail.name} method`);
  //   try {
  //     const { email } = passwordResetDto;
  //     let isEmailSent = await this.authService.sendCode(email);
  //     return {
  //       success: true,
  //       isEmailSent,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error', error, [error]);
  //     let status = error.status ? error.status : 500;
  //     throw new HttpException(error?.response, status, {
  //       cause: error?.cause,
  //       description: error?.description,
  //     });
  //   }
  // }
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @Post('verify-code')
  // async verifyCode(@Body() verifyCodeDto: verifyCodeDto) {
  //   try {
  //     const result = await this.authService.verifyCode(
  //       verifyCodeDto.code,
  //       verifyCodeDto.email,
  //       verifyCodeDto?.newPassword,
  //     );
  //     return {
  //       success: true,
  //       message: 'success',
  //       result,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     const status = error.status ? error.status : 500;
  //     throw new HttpException(error?.response, status, {
  //       cause: error?.cause,
  //       description: error?.description,
  //     });
  //   }
  // }
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@Req() req: any) {
    try {
      this.logger.log('Executing Get api/v1/log-out ');
      const token = req.headers.authorization.split(' ')[1];
      await this.authService.saveBlacklistToken(token, req.user.userId);
      return {
        success: true,
        message: 'logout successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
