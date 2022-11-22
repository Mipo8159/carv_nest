import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  signup(email: string, password: string) {
    return 123;
  }

  signin(email: string, password: string) {
    return 123;
  }
}
