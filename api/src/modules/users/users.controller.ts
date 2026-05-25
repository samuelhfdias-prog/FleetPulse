import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtPayload } from '@/common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: JwtPayload): Promise<User> {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload): Promise<User[]> {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<User> {
    return this.usersService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: JwtPayload): Promise<User> {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<void> {
    return this.usersService.remove(id, user);
  }
}
