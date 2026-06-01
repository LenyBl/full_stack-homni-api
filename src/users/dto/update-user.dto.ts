import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsEmail()
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    display_name?: string;

    @IsString()
    @IsOptional()
    password_hash?: string;

    @IsString()
    @IsOptional()
    role?: string;
}