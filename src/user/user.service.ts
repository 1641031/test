import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from '../utils/db.helper';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  //   getUsersRange(params: any): any {
  //     if (params == 5) {
  //       return {
  //         code: 0,
  //         msg: 'getUsersRange请求成功',
  //         data: [],
  //       };
  //     }
  //   }

  getRangeArray(num: string) {
    const regPos = /^[0-9]$/; //判断是否是数字范围1-9内。
    const array = [];
    const isNum = regPos.test(num);

    console.log(num.split(''));
    console.log(isNum);
    if (isNum) {
      for (let i = 1; i <= Number(num); i++) {
        array.push(String(i));
      }
      return {
        code: 0,
        msg: '请求成功',
        data: array,
      };
    } else {
      return {
        code: -1,
        msg: '请求失败,传入的params不符合要求，请输入[0-9]内的数字',
        data: array,
      };
    }
  }

  async getUsers() {
    const res = await this.userRepository.find();
    return {
      code: 0,
      data: res,
      msg: '请求用户列表成功',
    };
  }

  addUser(): any {
    return {
      code: 0,
      data: {},
      msg: 'Post请求成功',
    };
  }

  findAll(query: getUserDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // SELECT * FROM user u, profile p, role r WHERE u.id = p.uid AND u.id = r.uid AND ....
    // SELECT * FROM user u LEFT JOIN profile p ON u.id = p.uid LEFT JOIN role r ON u.id = r.uid WHERE ....
    // 分页 SQL -> LIMIT 10 OFFSET 10

    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take, // 显示每页的最多条数
    //   skip, // page 代表当前页码 ,skip 表示省略前面多少条
    // });
    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQuery = conditionUtils<User>(queryBuilder, obj);
    // if (gender) {
    //   queryBuilder.andWhere('profile.gender = :gender', { gender });
    // } else {
    //   queryBuilder.andWhere('profile.gender IS NOT NULL');
    // }
    // if (role) {
    //   queryBuilder.andWhere('roles.id = :role', { role });
    // } else {
    //   queryBuilder.andWhere('roles.id IS NOT NULL');
    // }
    return newQuery.take(take).skip(skip).getMany();
  }
  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // ------------创建
  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({
        where: { id: 2 },
      });
      console.log(
        '🚀 ~ file: user.service.ts:139 ~ UserService ~ create ~ role:',
        role,
      );
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      // 查询所有的用户角色,将查询到的对象，存入该变量
      // ------
      // {id, name} -> { id } -> [id]
      // 查询所有的用户角色
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
      console.log(
        '🚀 ~ file: user.service.ts:136 ~ UserService ~ create ~ user.roles:',
        user.roles,
      );
    }
    const userTmp = await this.userRepository.create(user);
    // try {
    // 对用户密码使用 argon2 加密
    userTmp.password = await argon2.hash(userTmp.password);
    const res = await this.userRepository.save(userTmp);
    return res;
    // } catch (error) {
    //   if (error?.errno && error?.errno === 1062) {
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }
  }
  // ------------更新
  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用save 方法或者 queryBuilder
    return this.userRepository.save(newUser);
  }
  // ------------删除
  async remove(id: number) {
    console.log(
      '🚀 ~ file: user.service.ts:166 ~ UserService ~ remove ~ id:',
      id,
    );
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        logs: true,
      },
    });
    return user.logs;
    // return this.logsRepository.find({
    //   where: {
    //     user: user.logs,
    //   },
    // });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as rest, COUNT(logs.result) as count from logs,user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;

    // return this.logsRepository.query(
    //   'SELECT logs.result as rest, COUNT(logs.result) as count from logs,user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result',
    // );
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('result', 'DESC')
      .getRawMany();
  }
}
