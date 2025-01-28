import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mailer.host'),
          port: configService.get<number>('mailer.port'),
          auth: {
            user: configService.get<string>('mailer.username'),
            pass: configService.get<string>('mailer.password'),
          },
        },
        defaults: {
          from: configService.get<string>('mailer.mailFrom'),
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
