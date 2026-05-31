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
        const { email, display_name, password } = createUserDto;
        const password_hash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ email, display_name, password_hash });
        return this.usersRepository.save(user);
    }

}
