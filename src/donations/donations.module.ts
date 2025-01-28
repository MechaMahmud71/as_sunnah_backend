import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity';
import { JwtSharedModule } from 'src/common/modules/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([DonationEntity]), JwtSharedModule],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule { }
