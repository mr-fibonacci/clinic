import { promisify } from 'util';
import { scrypt, randomBytes } from 'crypto';

const scryptAsync = promisify(scrypt);

export abstract class Password {
  static toHash = async (password: string): Promise<string> => {
    const salt = randomBytes(8).toString('hex');
    const hashedPass = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${hashedPass.toString('hex')}.${salt}`;
  };

  static compare = async (
    sentPass: string,
    dbString: string
  ): Promise<boolean> => {
    const [pass, salt] = dbString.split('.');
    const buffer = (await scryptAsync(sentPass, salt, 64)) as Buffer;
    return pass === buffer.toString('hex');
  };
}
