// import { getUserDto } from '@/user/dto/get-user.dto';
import { UserService } from '@/user/user.service';
import {
  ForbiddenException,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  // 登录
  async signin(username: string, password: string) {
    // const res = await this.userService.findAll({ username } as getUserDto);

    const user = await this.userService.find(username);
    console.log(
      '🚀 ~ file: auth.service.ts:23 ~ AuthService ~ signin ~ user.password:',
      user.password,
      password,
    );

    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }

    return await this.jwt.signAsync({
      username: user.username,
      sub: user.id,
    });

    // ----------------------------------------------
    // if (user && user.password === password) {
    //   // 生成token
    //   return await this.jwt.signAsync(
    //     {
    //       username: user.username,
    //       sub: user.id,
    //     },
    //     // 局部设置 --> refreshToken
    //     // {
    //     //   expiresIn: '1d',
    //     // },
    //   );
    // }

    // throw new UnauthorizedException();
  }

  // 注册
  async signup(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.userService.create({
      username,
      password,
    });

    // // 脱敏处理
    // delete res['password'];

    return res;
  }
}
