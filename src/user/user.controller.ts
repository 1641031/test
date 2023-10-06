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
  UseFilters,
  Headers,
  UnauthorizedException,
  ParseIntPipe,
  UseGuards,
  // Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '@/guards/admin/admin.guard';
import { JwtGuard } from '@/guards/admin/jwt.guard';

@Controller('user')
@UseFilters(new TypeormFilter())
// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
export class UserController {
  // Logger 全局模块
  // private logger = new Logger(UserController.name);
  // 下面代码语法糖
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // @Inject(Logger) private readonly logger: LoggerService,
    // 全局日志？？？
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // this.userService = new UserService();
    this.logger.log('UserController init');
  }
  //  ---------------------- user
  @Get()
  // 非常重要的知识点
  // 1.装饰器的执行顺序，方法的装饰器如果有多个，则是从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  // 2.如果使用UseGuard传递多个守卫，则从前往后执行，如果前面的Guard没有通过，则后面的Guard不会执行
  @UseGuards(AdminGuard)
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
  // @UseGuards(AuthGuard('jwt'))
  getUserProfile(
    @Query('id', ParseIntPipe) id: any,
    // 这里req中的user 是通过AuthGuard('jwt')中的validate方法返回的
    // PassportModule来添加的
    // @Req() req,
  ): any {
    // console.log(
    //   '🚀 ~ file: user.controller.ts:62 ~ UserController ~ getUserProfile ~ req:',
    //   req,
    // );
    return this.userService.findProfile(id);
  }

  @Post()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
    // console.log("🚀 ~ file: user.controller.ts:63 ~ UserController ~ addUser ~ dto:", dto)
    // const user = {username: 'toimc', password: '123456'} as User
    // return this.userService.addUser();

    const user = dto as User;
    return this.userService.create(user);
  }

  // logs Module
  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/:id')
  getUser(): any {
    return 'hello world';
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    console.log(
      '🚀 ~ file: user.controller.ts:86 ~ UserController ~ headers:',
      headers,
    );
    if (id === headers) {
      // 说明是同一个用户在修改
      // todo 传递参数id
      // todo 异常处理
      // 权限1：判断用户是否是自己
      // 权限2: 判断用户是否有更新 user 的权限
      // 返回数据：不能包含敏感的password等信息
      const user = dto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    // todo 传递参数id
    // 权限2: 判断用户是否有更新 user 的权限
    return this.userService.remove(id);
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
