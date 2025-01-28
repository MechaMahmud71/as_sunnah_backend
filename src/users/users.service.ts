import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({ ...createUserDto, role: Role.USER });
    return this.usersRepository.save(user);
  }

  async findOne(data: Partial<UserEntity>) {
    return await this.usersRepository.findOne({ where: data });
  }


  public async update(data: Partial<UserEntity>, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(data);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }


  public async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  public async generateResetPasswordToken(email: string) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate token
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save token to user
    user.resetPasswordToken = code;

    // Save token expiration
    const currentDate = new Date();

    // Add 5 minutes to the current date
    currentDate.setMinutes(currentDate.getMinutes() + 5);

    user.resetPasswordTokenExpirationTime = currentDate;

    await this.usersRepository.save(user);

    return code;
  }


}
