import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  // HttpException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '@/filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';
// import { SerializeInterceptor } from '@/interceptors/serialize/serialize.interceptor';

// export function TypeOrmDecorator() {
//   return UseFilters(new TypeormFilter()); // typeorm异常过滤
// }

@Controller('auth')
// @TypeOrmDecorator()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin') // 登录
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    return {
      access_token: token,
    };
  }

  // 注册
  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() dto: SigninUserDto) {
    // console.log(
    //   '🚀 ~ file: auth.controller.ts:33 ~ AuthController ~ signup ~ req:',
    //   req.user,
    // );
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // // 正则表达式
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用户名或密码格式不正确', 400);
    // }
    return this.authService.signup(username, password);
  }
}
