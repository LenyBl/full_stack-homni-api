import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, display_name, password_hash } = createUserDto;
        if (await this.usersRepository.findOne({ where: { email } })) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        try {
            const user = this.usersRepository.create({ email, display_name, password_hash: hashedPassword });
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new Error('Failed to create user');
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
        } catch (error) {
            throw new Error('Failed to find user');
        }
        return this.usersRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            await this.usersRepository.delete(id);
        } catch (error) {
            throw new Error('Failed to remove user');
        }
        return { message: `User with id ${id} has been removed.` };
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<{ access_token: string}> {
        await this.usersRepository.update(id, updateUserDto);
        const updatedUser = await this.usersRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        const access_token = this.jwtService.sign({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, display_name: updatedUser.display_name });
        return { access_token };
    }
}
