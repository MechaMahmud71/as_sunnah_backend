import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { IDonationFilter } from './interfaces/filter.interface';

@ApiBearerAuth()
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @ApiBody({ type: CreateDonationDto })
  @UseGuards(AuthGuard)
  @Post()
  async create(@User() user: UserEntity, @Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.create(user, createDonationDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2025-01-01T00:00:00.000Z' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2025-01-31T23:59:59.999Z' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filterOptions = this.parseQueryParams({ startDate, endDate });

    return this.donationsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      filterOptions,
    });
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  findAllUserDonation(@User() user: UserEntity, @Query('page') page?: string,) {
    return this.donationsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: 10,
      filterOptions: { user: { id: user.id } }, // Pass user filter correctly
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update({ id: +id }, updateDonationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }


  private parseQueryParams(query: Record<string, any>): IDonationFilter {
    const filter: IDonationFilter = {};

    if (query.startDate) {
      const parsedStartDate = new Date(query.startDate);
      if (isNaN(parsedStartDate.getTime())) {
        throw new BadRequestException('Invalid startDate format. Please provide a valid ISO 8601 date string.');
      }
      filter.startDate = parsedStartDate;
    }

    if (query.endDate) {
      const parsedEndDate = new Date(query.endDate);
      if (isNaN(parsedEndDate.getTime())) {
        throw new BadRequestException('Invalid endDate format. Please provide a valid ISO 8601 date string.');
      }
      filter.endDate = parsedEndDate;
    }

    return filter;
  }

}
