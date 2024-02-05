import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ThrottlerModule } from '@nestjs/throttler';
// import { FriendsModule } from './modules/friends/friends.module';
// import { LogsService } from './modules/logsService/logs.service';
// import { LogsModule } from './modules/logsService/logs.module';
// import { PostsModule } from './modules/posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailModule } from './modules/email/email.module';
// import { AboutModule } from './modules/about/about.module';
// import { SkillsModule } from './modules/skills/skills.module';
// import { FileSystemModule } from './modules/file-system/file-system.module';
// import { GroupsModule } from './modules/groups/groups.module';
// import { EventsModule } from './modules/events/events.module';
// import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use the ConfigService
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get<TransportType>(
          'emailConfig.emailTransport',
        ),
        template: {
          dir: `${process.cwd()}/src/views/templates/emails/`,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [
        async () => {
          const configModule = await import(
            `./config/config`
          );
          return configModule.default();
        },
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
    }),
    EmailModule
    // FriendsModule,
    // LogsModule,
    // PostsModule,
    // AboutModule,
    // SkillsModule,
    // FileSystemModule,
    // GroupsModule,
    // EventsModule,
    // PrivacyPolicyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
