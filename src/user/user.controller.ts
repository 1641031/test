import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  // Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';

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
  //  ---------------------- user
  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log(
      '🚀 ~ file: user.controller.ts:45 ~ UserController ~ getUsers ~ query:',
      query,
    );
    // page - 页码， limit -每页条数，
    // condition- 查询条件(username, role, gender), sort-排序
    return this.userService.findAll(query);
  }

  @Get('/profile')
  getUserProfile(@Query() query: any): any {
    console.log(
      '🚀 ~ file: user.controller.ts:85 ~ UserController ~ getUserProfile ~ query:',
      query,
    );
    return this.userService.findProfile(2);
  }

  @Get('/:id')
  getUser(): any {
    // const user = { isAdmin: false };
    // if (!user.isAdmin) {
    //   throw new UnauthorizedException('用户没有权限');
    // }
    // this.logger.log(`请求getUsers成功`);
    // this.logger.warn(`请求getUsers成功`);
    // this.logger.error(`请求getUsers成功`);
    // // 命令行的方式 传递 DB_PASS
    // 通过 配置文件 .env 的方式 传递 DB_PASS
    // const password =
    //   process.env.DB_PASS || this.configService.get(ConfigEnum.DB_PASSWORD);
    // console.log('password-test', password);
    // return this.userService.getUsers();
    // return this.userService.findAll();
    return 'hello world';
  }

  @Post()
  addUser(@Body() dto: any): any {
    // const user = {username: 'toimc', password: '123456'} as User
    // return this.userService.addUser();

    const user = dto as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    // todo 传递参数id
    // todo 异常处理
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // todo 传递参数id
    return this.userService.remove(id);
  }

  // logs Module
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
