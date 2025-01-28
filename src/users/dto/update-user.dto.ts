import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The reset password token of the user',
    example: 'resetPasswordToken',
  })
  @IsOptional()
  resetPasswordToken?: string;

  @ApiProperty({
    description: 'The reset password token expiration time of the user',
    example: new Date(),
  })
  @IsOptional()
  resetPasswordTokenExpirationTime?: Date;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsOptional()
  password?: string;

}