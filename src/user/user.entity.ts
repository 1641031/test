import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  // 这里 cascade 只新增和修改，不删除 roles字段
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // 触发添加用户 操作后，会触发下面函数
  @AfterInsert()
  afterInsert() {
    console.log('afterInsert', this.id, this.username);
  }

  // 触发删除用户 操作后，会触发下面函数
  @AfterRemove()
  afterRemove() {
    console.log('afterRemove');
  }
}
