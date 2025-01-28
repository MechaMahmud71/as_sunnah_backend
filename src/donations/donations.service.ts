import { HttpException, Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity';
import { FindOptionsWhere, Repository, MoreThanOrEqual, LessThanOrEqual, FindOperator, Between } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { IDonationFilter } from './interfaces/filter.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(DonationEntity) private donationsRepository: Repository<DonationEntity>
  ) { }

  async create(user: UserEntity, createDonationDto: CreateDonationDto) {
    const donation = this.donationsRepository.create({ ...createDonationDto, user });
    return await this.donationsRepository.save(donation);
  }

  async findAll(filter: {
    page: number,
    limit: number,
    filterOptions?: Partial<IDonationFilter>
  }): Promise<{
    donations: Partial<DonationEntity>[];
    total: number;
    page: number;
    limit: number;
    nextPage: number | null;
    previousPage: number | null;
    totalAmount: number;
    totalPage: number;
  }> {
    const { page = 1, limit = 10, filterOptions = {} } = filter;

    // Construct the `where` object with type safety
    const where = this.buildWhereClause(filterOptions);

    // Fetch paginated donations with the user relation
    const [result, total] = await this.donationsRepository.findAndCount({
      where: { ...where, isDeleted: false },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'], // Load the user relation
      order: { createdAt: 'DESC' },
    });

    // Calculate the total donation amount
    const totalAmount = await this.calculateTotalAmount(filterOptions);

    // Map the donations to include userName instead of a nested user object
    const donations = result.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      donationTime: donation.donationTime,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
      userName: donation.user?.userName || null,
      message: donation.message
    }));

    const nextPage = page * limit < total ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    const totalPage = Math.ceil(total / limit);

    return {
      donations,
      total,
      page,
      limit,
      nextPage,
      previousPage,
      totalPage,
      totalAmount: Number(totalAmount), // Include the total donation amount
    };
  }

  async findOne(data: Partial<DonationEntity>) {
    return await this.donationsRepository.findOne({ where: data });
  }

  async update(data: Partial<DonationEntity>, updateDonationDto: UpdateDonationDto) {
    const donation = await this.findOne({ id: data.id });
    if (!donation) {
      throw new HttpException('Donation not found', 404);
    }
    Object.assign(donation, updateDonationDto);
    return this.donationsRepository.save(donation);
  }

  async remove(id: number) {
    const donation = await this.findOne({ id });
    if (!donation) {
      throw new HttpException('Donation not found', 404);
    }
    donation.isDeleted = true;
    return await this.update({ id }, donation);
  }


  private buildWhereClause(filterOptions: Partial<IDonationFilter>): FindOptionsWhere<DonationEntity> {
    const where: FindOptionsWhere<DonationEntity> = {};

    // Filter by user ID
    if (filterOptions.user?.id) {
      where.user = { id: filterOptions.user.id };
    }

    // Add date filters dynamically
    if (filterOptions.startDate || filterOptions.endDate) {
      where.donationTime = Between(
        filterOptions.startDate || new Date(0), // Default to the epoch if no startDate
        filterOptions.endDate || new Date() // Default to current time if no endDate
      );
    }

    return where;
  }

  private async calculateTotalAmount(filterOptions: Partial<IDonationFilter>): Promise<number> {
    const totalAmountResult = await this.donationsRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'totalAmount')
      .where(builder => {
        if (filterOptions.startDate) {
          builder.andWhere('donation.donationTime >= :startDate', { startDate: filterOptions.startDate });
        }
        if (filterOptions.endDate) {
          builder.andWhere('donation.donationTime <= :endDate', { endDate: filterOptions.endDate });
        }
        if (filterOptions.user?.id) {
          builder.andWhere('donation.userId = :userId', { userId: filterOptions.user.id });
        }
        builder.andWhere('donation.isDeleted = false')
      })
      .getRawOne();

    const totalAmount = totalAmountResult?.totalAmount || 0;

    return totalAmount;
  }

}
