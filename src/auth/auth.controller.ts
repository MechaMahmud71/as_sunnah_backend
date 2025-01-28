import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, RegistrationDto, ResetPasswordDto, VerifyTokenDto } from './dto/auth.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';


@ApiTags('Authentication API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @ApiBody({ type: LoginDto })
  @Post('/user/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }


  @ApiBody({ type: RegistrationDto })
  @Post('/user/register')
  async register(@Body() body: RegistrationDto) {
    return await this.authService.registerUser(body);
  }

  @ApiBody({ type: ForgotPasswordDto })
  @Post('/user/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @ApiBody({ type: VerifyTokenDto })
  @Post('/user/verify-token')
  async verifyToken(@Body() body: { token: string }) {
    return await this.authService.verifyToken(body);
  }

  @Post('/user/reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async resetPassword(@User() user: Partial<UserEntity>, @Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(user, body);
  }

  @Post('/admin/login')
  @ApiBody({ type: LoginDto })
  async loginAdmin(@Body() body: LoginDto) {
    return await this.authService.loginAdmin(body);
  }

}


