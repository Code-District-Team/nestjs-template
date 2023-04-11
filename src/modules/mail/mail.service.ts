import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgetPassword(user: User, token: string) {
    try {
      const newToken = await this.mailerService.sendMail({
        to: user.email,
        from: `Capital Good Fund Password Reset <${process.env.SMTP_EMAIL}>`, // override default from
        subject: 'Password Reset Request',
        html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }
          a[href] {
              color: #FFF;
          }
              a,a:hover {text-decoration: none !important;}
              .image-style {
                  width: 100%;
                  height: auto;
              }
              .email-template-wrap {
                  max-width: 500px;
                  margin: auto;
                  background: #fff;
                  text-align: center;
              }
              .email-content {
                  max-width: 350px;
                  background: white;
                  margin: auto;
              }
              .email-content h3 {
                  font-weight: 500;
                  font-size: 44px;
                  color: #363636;
                  text-align: center;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
              }
              .email-content p {
                  color: #363636;
                  text-align: center;
              }
              .reset-password-btn {
                  padding: 13px 38px;
                  font-weight: 600;
                  font-size: 16px;
                  color: #FFFFFF;
                  background: #2CABE1;
                  border-radius: 2px;
                  border: 0;
                  margin-top: 1rem; 
                  margin-bottom: 2rem;
                  display: inline-block;
              }
              .email-template-footer {
                  background: #ECECEC;
                  padding: 32px;
                  text-align: center;
              }
      
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <div class="email-template-wrap">
             <div class="email-content">my
                  <h3>Password Reset</h3>
                  <p>Seems like you forgot your password for Insta Pronounce. If this is true, click below to reset your password.</p>
                  <a class="reset-password-btn" style="color:#FFF;" href="http://${
                    process.env.FRONTEND_URL
                  }/set-password/?token=${token}" target="_blank">Reset my Password</a>
             </div>
             <div class="email-template-footer">
                  Copyright © ${new Date().getFullYear()}  Instapronounce
             </div>
          </div>
      </body>
      
      </html>`,
      });

      if (newToken) return 'success';
    } catch (err) {
      console.log(err);
    }
  }

  async sendUserInvite(user: User, token: string) {
    const userRole = user.role.name;
    try {
      const newToken = await this.mailerService.sendMail({
        to: user.email,
        from: `Capital Good Fund Password Reset <${process.env.SMTP_EMAIL}>`,
        subject: 'User Invite',
        html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>User Invite Email Template</title>
          <meta name="description" content="User Invite Email Template.">
          <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }
          a[href] {
              color: #FFF;
          }
              a,a:hover {text-decoration: none !important;}
              .image-style {
                  width: 100%;
                  height: auto;
              }
              .email-template-wrap {
                  max-width: 500px;
                  margin: auto;
                  background: #fff;
                  text-align: center;
              }
              .email-content {
                  max-width: 350px;
                  background: white;
                  margin: auto;
              }
              .email-content h3 {
                  font-weight: 500;
                  font-size: 44px;
                  color: #363636;
                  text-align: center;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
              }
              .email-content p {
                  color: #363636;
                  text-align: center;
              }
              .reset-password-btn {
                  padding: 13px 38px;
                  font-weight: 600;
                  font-size: 16px;
                  color: #FFFFFF;
                  background: #2CABE1;
                  border-radius: 2px;
                  border: 0;
                  margin-top: 1rem; 
                  margin-bottom: 2rem;
                  display: inline-block;
              }
              .email-template-footer {
                  background: #ECECEC;
                  padding: 32px;
                  text-align: center;
              }
      
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <div class="email-template-wrap">
             <div class="email-content">
                  <h3>User Invite</h3>
                  <a class="reset-password-btn" style="color:#FFF;" href="http://${
                    process.env.FRONTEND_URL
                  }/${
          userRole == RoleEnum.BUSINESSPARTNER
            ? 'business-partner-register'
            : 'register'
        }/?token=${token}" target="_blank">User Invite</a>
             </div>
             <div class="email-template-footer">
                  Copyright © ${new Date().getFullYear()}  Instapronounce
             </div>
          </div>
      </body>
      
      </html>`,
      });
      if (newToken) return 'success';
    } catch (err) {
      console.log(err);
    }
  }
}
