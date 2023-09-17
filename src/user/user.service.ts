import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from '../utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
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
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async create(user: User) {
    const userTmp = await this.userRepository.create(user);

    // try {
    const res = await this.userRepository.save(userTmp);
    return res;
    // } catch (error) {
    //   if (error?.errno && error?.errno === 1062) {
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }
  }
  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }
  remove(id: number) {
    return this.userRepository.delete(id);
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
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user,
      },
      relations: {
        user: true,
      },
    });
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
