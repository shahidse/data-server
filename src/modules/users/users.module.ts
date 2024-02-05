import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';
// import { EmailModule } from '../email/email.module';
// import { FileSystemModule } from '../file-system/file-system.module';
// import { AboutModule } from '../about/about.module';
// import { SkillsModule } from '../skills/skills.module';
// import { FriendsModule } from '../friends/friends.module';
// import { AdminService } from './admin.services';

@Module({
  imports: [
    DatabaseModule,
    // EmailModule,
    // FileSystemModule,
    // AboutModule,
    // SkillsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders/* , AdminService */],
  exports: [UsersService, ...usersProviders],
})
export class UsersModule {}
