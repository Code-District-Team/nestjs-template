import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {User} from "../users/users.entity"

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

  async sendForgetPassword(user: User, token:string) {
    
try{
    const newToken=await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <ahsan.ali@codedistrict.com>', // override default from
      subject: 'Welcome to Nice App! Use this code to reset your password',
      html:`<p>Click on this link: http://localhost.com:3000/set-password/?token=${token}</p>`
    })
    if(newToken)
    return "success"
  
}catch(err){console.log(err)}
 
  
}}
