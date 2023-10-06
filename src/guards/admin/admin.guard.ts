import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  // 常见的错误：在使用 AdminGuard 未导入 UserModule
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    // 2. 获取请求中的用户信息进行逻辑上的判断 -> 角色判断
    console.log('req.user:', req.user);
    const user = (await this.userService.find(req.user.username)) as User;
    console.log(
      '🚀 ~ file: admin.guard.ts:16 ~ AdminGuard ~ canActivate ~ user:',
      user,
    );
    // 普通用户
    // 后面加入更多逻辑
    if (user.roles.filter((o) => o.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
