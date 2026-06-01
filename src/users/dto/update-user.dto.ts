import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsEmail()
    @IsString()
    email?: string;

    @IsString()
    display_name?: string;

    @IsString()
    password_hash?: string;
}