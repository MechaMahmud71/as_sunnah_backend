import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john_doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegistrationDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john_doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john_doe@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyTokenDto {
  @ApiProperty({
    description: 'The token to verify',
    example: "123123123"
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The confirm password',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
