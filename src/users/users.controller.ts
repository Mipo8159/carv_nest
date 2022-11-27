import { AuthGuard } from '../guards/auth.guard';
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(dto.email, dto.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(dto.email, dto.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('current')
  @UseGuards(AuthGuard)
  currentUser(@User() user: UserEntity) {
    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(parseInt(id));
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @Get()
  find(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(parseInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
