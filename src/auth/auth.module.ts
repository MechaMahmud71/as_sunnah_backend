import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtSharedModule } from 'src/common/modules/jwt.module';

@Module({
  imports: [
    JwtSharedModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
