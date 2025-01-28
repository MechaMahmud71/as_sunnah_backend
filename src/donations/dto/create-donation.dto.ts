import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ description: 'The amount of the donation.Minimum 10' })
  @Min(10)
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The message from the donor', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

