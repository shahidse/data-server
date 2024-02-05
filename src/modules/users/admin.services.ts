import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RootDocument } from './entities/root.entity';
import { Model } from 'mongoose';
import { RoleDocument } from './entities/role.entity';
import { UserGroupDocument } from './entities/ug.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { hashSync } from 'bcrypt';
@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @Inject('ROOT_MODEL') private rootModel: Model<RootDocument>,
    @Inject('USERGROUP_MODEL') private ugModel: Model<UserGroupDocument>,
    @Inject('ROLES_MODEL') private roleModel: Model<RoleDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  private readonly logger = new Logger(AdminService.name);
  async onModuleInit() {
    try {
      this.logger.log(`Creating admin data...`);
      //insert root
      const rootData = {
        root: this.configService.get<string>('root.root'),
      };
      const rootResp = await this.rootModel.findOneAndUpdate(
        { root: rootData.root },
        rootData,
        {
          new: true,
          upsert: true,
        },
      );
      //insert ug
      const ugData = {
        userGroup: this.configService.get<string>('userGroup.org1'),
        rootId: rootResp._id,
      };
      const ugResp = await this.ugModel.findOneAndUpdate(
        { userGroup: ugData.userGroup },
        ugData,
        { new: true, upsert: true },
      );
      //user role
      const rolesData = {
        role: [
          this.configService.get<string>('role.role1'),
          this.configService.get<string>('role.role2'),
        ],
        ugId: ugResp._id,
      };
      await this.roleModel.findOneAndUpdate(
        {
          role: rolesData.role[0],
        },
        { role: rolesData.role[0], ugId: rolesData.ugId },
        {
          upsert: true,
          new: true,
        },
      );
      const adminRole = await this.roleModel.findOneAndUpdate(
        {
          role: rolesData.role[1],
        },
        {
          role: rolesData.role[1],
          ugId: rolesData.ugId,
        },
        {
          upsert: true,
          new: true,
        },
      );
      //adding admin account
      const adminData = {
        email: this.configService.get<string>('admins.admin1.email'),
        userName: this.configService.get<string>('admins.admin1.userName'),
        password: this.configService.get<string>('admins.admin1.password'),
        fullName: this.configService.get<string>('admins.admin1.fullName'),
        isVerified: true,
        phoneNumber: this.configService.get<string>(
          'admins.admin1.phoneNumber',
        ),
        role: adminRole._id,
      };
      const passwd: string | Buffer = adminData.password || '';
      adminData.password = hashSync(passwd, 10);
      await this.userService.findOneAndUpdate(
        {
          email: adminData.email,
        },
        adminData,
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
