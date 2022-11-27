import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('userCOntroller', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'a@a.com',
          password: 'a',
        } as UserEntity);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'a' },
        ] as UserEntity[]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signin: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find returns list of users', async () => {
    const users = await controller.find('a@a.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  });

  it('findOne throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findOne('1')).rejects.toThrow(BadRequestException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'a@a.com', password: '123' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
