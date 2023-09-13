import AppDataSource from '../ormconfig';
import { User } from './user/user.entity';

AppDataSource.initialize()
  .then(async () => {
    const res = await AppDataSource.manager.find(User);
    console.log('resTest', res);
  })
  .catch((error) => console.log(error));
