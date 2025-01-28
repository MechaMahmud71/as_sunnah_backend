import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
;
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { EmailService } from 'src/email/email.service';
import { ForgotPasswordDto, LoginDto, RegistrationDto, ResetPasswordDto } from './dto/auth.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) { }

  public async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    const payload = { userName: user.userName, id: user.id, role: user.role };
    return {
      ...payload,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async registerUser(registrationDto: RegistrationDto) {
    const userExists = await this.usersService.findOne({ email: registrationDto.email });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }
    const SALT_ROUNDS = 10;
    const password = await bcrypt.hash(registrationDto.password, SALT_ROUNDS);
    const user = await this.usersService.create({ ...registrationDto, password, role: Role.USER });
    const payload = { username: user.userName, id: user.id, role: user.role };
    return {
      ...payload,
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  public async forgotPassword(body: ForgotPasswordDto) {
    const resetPasswordToken = await this.usersService.generateResetPasswordToken(body.email);

    // Send email with resetPasswordToken
    this.emailService.sendEmail({
      email: body.email,
      resetPasswordToken: resetPasswordToken
    });

    return 'Reset password token sent to email';
  }

  public async verifyToken(body: { token: string }) {
    const user = await this.usersService.findOne({ resetPasswordToken: body.token });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // get time difference which should be less than expiry time
    const currentTime = new Date()
    const tokenExpirationTime = new Date(user.resetPasswordTokenExpirationTime);
    const timeDifference = tokenExpirationTime.getTime() - currentTime.getTime();
    const TOKEN_EXPIRY_TIME = 5; // 5 minutes

    //convert time difference to minutes
    const timeDifferenceInMinutes = timeDifference / 60000;
    if (timeDifferenceInMinutes > TOKEN_EXPIRY_TIME) {
      throw new UnauthorizedException('Token expired');
    }

    await this.usersService.update({ id: user.id }, { resetPasswordToken: null, resetPasswordTokenExpirationTime: null });

    const payload = { username: user.userName, id: user.id, role: user.role };

    return await this.jwtService.signAsync(payload);
  }

  public async resetPassword(userData: Partial<UserEntity>, body: ResetPasswordDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.usersService.findOne({ id: userData.id });
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const SALT_ROUNDS = 10;
    const password = await bcrypt.hash(body.password, SALT_ROUNDS);
    await this.usersService.update({ id: userData.id }, { password });
    return true;
  }

  public async loginAdmin(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.userName, id: user.id, role: user.role };
    return {
      ...payload,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}