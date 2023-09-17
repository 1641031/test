import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  // if (username) {
  //   queryBuilder.where('user.username = :username', { username });
  // } else {
  //   queryBuilder.where('user.username IS NOT NULL');
  // }
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key}=:${key}`, { [key]: obj[key] });
    }
  });
  return queryBuilder;
};
