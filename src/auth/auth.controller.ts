import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto.auth';
import { Public } from './decorators/skip.auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() signInDto: SignInDto): Promise<any> {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }
}
