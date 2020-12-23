import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';

dotenv.config();

const { REDIS_PORT, REDIS_HOST, REDIS_PASS, SESS_SECRET } = process.env;

if (!REDIS_PORT) throw new Error('REDIS_PORT must be defined');
if (!REDIS_HOST) throw new Error('REDIS_HOST must be defined');
if (!REDIS_PASS) throw new Error('REDIS_PASS must be defined');

if (!SESS_SECRET) throw new Error('SESS_SECRET must be defined');

const REDIS_OPTIONS = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASS
};

const RedisStore = connectRedis(session);
const redisClient = new Redis(REDIS_OPTIONS);

export const redisSession = session({
  store: new RedisStore({ client: redisClient }),
  secret: SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
    //   maxAge: ,//ms
    //   secure: ,
    //   sameSite: ,
  }
  // rolling: ,
});

redisClient.on('connect', () => {
  console.log('CONNECTED TO REDIS');
});
