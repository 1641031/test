import {
  Controller,
  Delete,
  Get,
  Inject,
  // Inject,
  // Logger,
  LoggerService,
  // LoggerService,
  Patch,
  Post,
  Query,
  // UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
  // Logger 全局模块
  // private logger = new Logger(UserController.name);
  // 下面代码语法糖
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // @Inject(Logger) private readonly logger: LoggerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // this.userService = new UserService();
    this.logger.log('UserController init');
  }

  @Get('range')
  getUsersRange(@Query('num') num: string): any {
    return this.userService.getRangeArray(num);
  }

  @Get()
  getUsers(): any {
    // const user = { isAdmin: false };
    // if (!user.isAdmin) {
    //   throw new UnauthorizedException('用户没有权限');
    // }
    this.logger.log(`请求getUsers成功`);
    this.logger.warn(`请求getUsers成功`);
    // this.logger.error(`请求getUsers成功`);
    // // 命令行的方式 传递 DB_PASS
    // 通过 配置文件 .env 的方式 传递 DB_PASS
    // const password =
    //   process.env.DB_PASS || this.configService.get(ConfigEnum.DB_PASSWORD);
    // console.log('password-test', password);
    // return this.userService.getUsers();
    return this.userService.findAll();
  }

  @Post()
  addUser(): any {
    // const user = {username: 'toimc', password: '123456'} as User
    // return this.userService.addUser();
    const user = { username: 'toimc', password: '123456' } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    // todo 传递参数id
    // todo 异常处理
    const user = { username: 'newname' } as User;
    return this.userService.update(1, user);
  }

  @Delete()
  deleteUser(): any {
    // todo 传递参数id
    return this.userService.remove(1);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    // return res.map((o) => ({
    //   result: o.result,
    //   count: o.count,
    // }));
    return res;
  }
}
