import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  // sendEmail(to: string, subject: string, data: any, template: string): Promise<SentMessageInfo | null> {
  //   try {
  //     data = {
  //       ...data,
  //       frontendUrl: process.env.FRONTEND_URL,
  //     };
  //
  //     return this.mailerService.sendMail({
  //       to: to,
  //       from: `Support Team <${FROM_EMAIL_VALUE}>`, // override default from
  //       subject: subject,
  //       template: template,
  //       context: data,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   return null;
  // }

  async sendForgetPassword(user: User, token: string) {
    try {
      const newToken = await this.mailerService.sendMail({
        to: user.email,
        from: `Code District Password Reset <${process.env.SMTP_EMAIL}>`, // override default from
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
                  padding-top:15px;
              }
              .email-content {
                  max-width: 350px;
                  background: white;
                  margin: auto;
              }
              .email-content h3 {
                  font-weight: 500;
                  font-size: 36px;
                  color: #363636;
                  text-align: center;
                  margin-top: 0;
                  margin-bottom: 1rem;
              }
              .email-content p {
                  color: #363636;
                  text-align: left;
                  margin-bottom:10px;
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
                  padding: 15px;
                  text-align: center;
              }
      
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px;padding-top:20px; background-color: #f2f3f8;" leftmargin="0">
          <div class="email-template-wrap">
             <div class="email-content">
                  <h3>Password Reset</h3>
                  <p>
                    Hi ${user.firstName ?? ''},
                    </p>
                    <p>There was a request to change your password!<br>
                  </p>
                  <p>
                  If you did not make this request then please ignore this email.
                  </p>
                  <p>
                  Otherwise, click below to reset your password.
                  </p>
                  <a class="reset-password-btn" style="color:#FFF;" href="http://${
                    process.env.FRONTEND_URL
                  }/set-password/?token=${token}" target="_blank">Reset my Password</a>
             </div>
             <div class="email-template-footer">
                  Copyright © ${new Date().getFullYear()}  CodeDistrict
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
        from: `Code District Password Reset <${process.env.SMTP_EMAIL}>`,
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
                  <p>
                    Hi,
                  </p>
                    <p>You’ve been invited to join our portal<br>
                  </p>
                  <p>
                  Click below to set up your account.
                  </p>
                  <a class="reset-password-btn" style="color:#FFF;" href="http://${
                    process.env.FRONTEND_URL
                  }/register
        /?token=${token}" target="_blank">Accept Invite</a>
             </div>
             <div class="email-template-footer">
                  Copyright © ${new Date().getFullYear()}  CodeDistrict
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
