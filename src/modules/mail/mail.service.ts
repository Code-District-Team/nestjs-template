import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, NotFoundException } from "@nestjs/common";
import envConfig from "src/config/env.config";
import { mailSubjects } from "../auth/constants";
import { ContactUsDto } from "../users/dto/user.dto";
import { User } from "../users/entities/users.entity";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgetPassword(user: User, token: string) {
    console.log(envConfig.smtpEmail);
    console.log(`Link:::: https://${envConfig.frontendHost}:${envConfig.frontendPort}/set-password/?token=${token}`);
    try {
      const newToken = await this.mailerService.sendMail({
        to: user.email,
        from: `Instapronounce Password Reset <${envConfig.smtpEmail}>`, // override default from
        subject: "Password Reset Request",
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
              <img src="https://${envConfig.backendHost}:${envConfig.backendPort}/${
          envConfig.mailImagePath
        }" alt="" class="image-style">
             <div class="email-content">
                  <h3>Password Reset</h3>
                  <p>Seems like you forgot your password for Insta Pronounce. If this is true, click below to reset your password.</p>
                  <a class="reset-password-btn" style="color:#FFF;" href="https://${envConfig.frontendHost}:${
          envConfig.frontendPort
        }/set-password/?token=${token}" target="_blank">Reset my Password</a>
             </div>
             <div class="email-template-footer">
                  Copyright © ${new Date().getFullYear()}  Instapronounce
             </div>
          </div>
      </body>
      
      </html>`,
      });
      console.log(newToken);
      if (newToken) return "success";
    } catch (err) {
      console.log(err);
    }
  }

  async sendContactUs(contactUsDto: ContactUsDto) {
    console.log(envConfig.smtpEmail);
    const { firstName, lastName, subject, message, email } = contactUsDto;
    try {
      const newToken = await this.mailerService.sendMail({
        to: envConfig.contactUsEmail,
        from: envConfig.smtpEmail, // override default from
        subject: subject,
        html: `
    
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>instaPronounce</title>
    <style type="text/css">
        body{
            font-family: -apple-system, BlinkMacSystemFont, sans-serif, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
        }
        .image-wrapper {
            background-color: #f5fdfd;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 3rem;

        }
        .image-style {
            width: 200px;
            height: auto;
            
        }
        .email-template-wrap {
            max-width: 600px;
            width: 100%;
            margin: auto;
            background: #fff;

        }
        .email-content {
            background-color: #fff;
            width: 500px;
            margin: auto;
            padding-bottom: 4rem;
        }
        h5 {
            font-size: 14px;
            color: #000;
            font-weight: 600;
            margin: 0 0 .5rem;
        }
        p {
            font-size: 12px;
            color: rgba(0,0,0,.6);
            font-weight: 400;
            /* padding-left: 1rem; */
            margin: 0 0 .5rem;
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
        <div class="image-wrapper">
            <img src="https://${envConfig.backendHost}:${envConfig.backendPort}/${
          envConfig.mailImagePath
        }" alt="" class="image-style">
        </div>
        
       <div class="email-content">
            <h5>First Name:</h5>
            <p>${firstName}</p>
            <h5>Last Name:</h5>
            <p>${lastName}</p>
            <h5>Email:</h5>
            <p>${email}</p>
            ${subject === mailSubjects.CONTACT_US_EDUCATION ? `<h5>School:</h5><p>${contactUsDto.school}</p>` : ""}
                ${
                  subject === mailSubjects.CONTACT_US_BUSINESS
                    ? `<h5>Title:</h5>
                    <p>${contactUsDto.title}</p>
                    <h5>Organization:</h5>
                    <p>${contactUsDto.organization}</p>
                  <h5>Size of organization:</h5>
                    <p>${contactUsDto.sizeOfOrganization}</p>
                    <h5>Potential no. of NamePlayer users:</h5>
                    <p>${contactUsDto.numberOfNamePlayerUsers}</p>`
                    : ""
                }
            
            ${
              subject !== mailSubjects.CONTACT_US
                ? `<h5>Location:</h5>
            <p>${contactUsDto.location}</p> `
                : ""
            }
            <h5>Message:</h5>
            <p>${message}
            </p>
       </div>
       <div class="email-template-footer">
            Copyright © ${new Date().getFullYear()}  Instapronounce
        </div>
    </div>
</body>

</html>`,
      });
      return "success";
    } catch (err) {
      console.log(err);
      throw new NotFoundException(err);
    }
  }
}
