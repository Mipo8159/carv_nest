import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(email: string, password: string) {
    return 123;
  }

  findOne(id: number) {
    return 123;
  }

  find(email: string) {
    return 12;
  }

  update(id: number, attrs: Partial<UserEntity>) {
    return 123;
  }

  remove(id: number) {
    return 123;
  }
}
