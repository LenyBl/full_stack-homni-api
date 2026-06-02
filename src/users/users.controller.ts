import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/users.entity';
import { Body, Post, Get, Delete, Patch, HttpCode, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/skip.auth';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles('admin')
    @Post()
    @HttpCode(201)
    async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
        return this.usersService.create(createUserDto);
    }

    @Roles('admin')
    @Get('email/:email')
    @HttpCode(200)
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        return this.usersService.findByEmail(email);
    }

    @Roles('admin')
    @Get(':id')
    @HttpCode(200)
    async findById(@Param('id') id: number): Promise<User | null> {
        return this.usersService.findById(id);
    }

    @Roles('admin')
    @Delete(':id')
    @HttpCode(200)
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        return this.usersService.remove(id);
    }

    @Roles('admin')
    @Patch(':id')
    @HttpCode(200)
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<{ access_token: string}> {
        return this.usersService.update(id, updateUserDto);
    }
}
