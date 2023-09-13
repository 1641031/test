import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';

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

  findAll() {
    return this.userRepository.find();
  }
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
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
