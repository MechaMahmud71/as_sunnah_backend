import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

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

  @Column({ default: "" })
  message: string

  @ManyToOne(() => UserEntity, user => user.donations, { eager: true, onDelete: "CASCADE" })
  user: Partial<UserEntity>
}

