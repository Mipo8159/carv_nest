import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '@app/users/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signup(email: string, password: string) {
    // check email
    const [user] = await this.usersService.find(email);
    if (user) throw new BadRequestException('email in use');

    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    // check email
    const [user] = await this.usersService.find(email);
    if (!user) throw new BadRequestException('user not found');

    // check password
    const [salt, _hash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== _hash)
      throw new BadRequestException('invalid credentials');

    return user;
  }
}
