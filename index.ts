// require('dotenv').config()
// console.log(process.env)
import config from 'config';

const dbConfig = config.get('db');
console.log('test', dbConfig);
