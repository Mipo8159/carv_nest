import { Test } from '@nestjs/testing';
import { AuthService } from '@app/users/auth.service';
import { UsersService } from '@app/users/users.service';
import { UserEntity } from '@app/users/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create fake copy of users service
    const users: UserEntity[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as UserEntity;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@gmail.com', 'asdf');
    expect(user.password).not.toEqual('asdf');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error is user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'asdf@gmail.com', password: 'asdf' } as UserEntity,
      ]);

    await expect(service.signup('asdf2@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('return user if correct password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'passowrd');
    const user = service.signin('laskdjf@alskdfj.com', 'passowrd');
    expect(user).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signin('asdfa@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
