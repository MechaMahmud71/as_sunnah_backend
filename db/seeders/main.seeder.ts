import { Column, DataSource, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { ManyToOne } from 'typeorm';


dotenv.config();

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordTokenExpirationTime: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => DonationEntity, donation => donation.user)
  donations: DonationEntity[];
}

@Entity({ name: 'donations' })
export class DonationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  donationTime: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, user => user.donations, { eager: true, onDelete: "CASCADE" })
  user: Partial<UserEntity>
}


const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [UserEntity, DonationEntity]
});
const userRepository = dataSource.getRepository(UserEntity);
const donationsRepository = dataSource.getRepository(DonationEntity);

async function connect() {
  try {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source connect', err);
  }
}

async function disconnect() {
  try {
    await dataSource.destroy();

    console.log('Data Source disconnected!');
  } catch (err) {
    console.error('Error during Data Source disconnect', err);
  }
}

async function seed() {
  await userRepository.delete({});

  console.log('All existing data deleted.');

  const UserSeed = () => [
    {
      userName: 'User Faruk',
      email: 'faruk@test.com',
      password: bcrypt.hashSync('12345678', 10),
      role: Role.USER
    },
    {
      userName: 'User Mahmud',
      email: 'Mahmud@test.com',
      password: bcrypt.hashSync('12345678', 10),
      role: Role.USER
    },
    {
      userName: 'Admin',
      email: "admin@admin.com",
      password: bcrypt.hashSync('12345678', 10),
      role: Role.ADMIN
    }
  ];

  const users = await userRepository.save(UserSeed());

  const DonationSeed = () => [
    {
      id: 1,
      amount: 1000,
      message: "keep up the good works",
      user: users[0]
    },
    {
      id: 2,
      amount: 1000,
      message: "keep up the good works",
      user: users[1],
    },
    {
      id: 1,
      amount: 3000,
      message: "keep up the good works",
      user: users[0]
    },
    {
      id: 1,
      amount: 5000,
      message: "keep up the good works",
      user: users[0]
    },
    {
      id: 1,
      amount: 6000,
      message: "keep up the good works",
      user: users[0]
    },
  ]

  await donationsRepository.save(DonationSeed())
  console.log('created seeds');
}

async function runSeed() {
  await connect();
  console.log('connected');
  await seed();
  console.log('seed done');
  await disconnect();
  console.log('disconnected');
}

runSeed();
