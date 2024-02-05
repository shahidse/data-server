// email.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  private async setTransport() {
    try {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        this.configService.get<string>('emailConfig.clientId'),
        this.configService.get<string>('emailConfig.clientSecret'),
        this.configService.get<string>('emailConfig.redirectUrl'),
      );

      oauth2Client.setCredentials({
        refresh_token: this.configService.get<string>(
          'emailConfig.refreshToken',
        ),
      });

      const accessToken: string = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err: any, token: string) => {
          if (err) {
            console.log(err);
            reject('Failed to create access token');
          }
          console.log('Access Token:', token); // Log the access token
          resolve(token);
        });
      });

      const config: Options = {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('emailConfig.email'),
          clientId: this.configService.get<string>('emailConfig.clientId'),
          clientSecret: this.configService.get<string>(
            'emailConfig.clientSecret',
          ),
          accessToken,
        },
      };
      this.mailerService.addTransporter('gmail', config);
    } catch (error) {
      console.log('error in creating transport for email');
    }
  }
  // public async sendMail(
  //   to: string,
  //   sender: string,
  //   subject: string,
  //   token: string,
  //   baseUrl: string,
  //   name: string,
  //   template: string,
  // ) {
  //   await this.setTransport();
  //   await this.mailerService.sendMail({
  //     transporterName: 'gmail',
  //     to: to, // list of receivers
  //     from: sender, // sender address
  //     subject: subject, // Subject line
  //     template: template,
  //     context: {
  //       // Data to be sent to template engine..
  //       token,
  //       baseUrl,
  //       to,
  //       name,
  //     },
  //   });
  // }
  public async sendMail(
    transporterName: string,
    to: string,
    sender: string,
    subject: string,
    template: string,
    context: {},
  ) {
    try {
      await this.setTransport();
      await this.mailerService.sendMail({
        transporterName,
        to: to, // list of receivers
        from: sender, // sender address
        subject: subject, // Subject line
        template: template,
        context,
      });
    } catch (error: any) {
      console.log('error in sending email');
    }
  }
}
