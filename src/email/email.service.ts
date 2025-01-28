import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(data: { email: string; resetPasswordToken: string }) {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Welcome to Our App! Confirm Your Email',
        text: `Reset Password Token: ${data.resetPasswordToken}`, // Plain text version
      });
    } catch (error) {
      console.log(error)
      // throw new HttpException(`Error sending email: ${error.message}`, 500);
    }
  }
}
