import { UserEntity } from "src/users/entities/user.entity";

export interface IDonationFilter {
  startDate?: Date;
  endDate?: Date;
  user?: Partial<UserEntity>;
}