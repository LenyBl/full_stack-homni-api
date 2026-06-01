import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, display_name, password_hash } = createUserDto;
        if (await this.usersRepository.findOne({ where: { email } })) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const user = this.usersRepository.create({ email, display_name, password_hash: hashedPassword });
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<{ message: string }> {
        await this.usersRepository.delete(id);
        return { message: `User with id ${id} has been removed.` };
    }

}
