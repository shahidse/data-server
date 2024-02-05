import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { EmailService } from '../email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authProviders } from './auth.providers';
import { DatabaseModule } from '../database/database.module';
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import the ConfigModule
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    EmailService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    ...authProviders,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
