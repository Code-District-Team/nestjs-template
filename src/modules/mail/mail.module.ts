import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {MailerModule} from '@nestjs-modules/mailer'
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'


@Module({
imports:[
  MailerModule.forRoot({
    // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
    // or
    transport: {
      host: 'smtp.sendgrid.net',
      secure: false,
      port:587,
      auth: {
        user: 'apikey',
        pass: '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',
      },
    },
    defaults: {
      from: '"No Reply" <ahsan.ali@codedistrict.com>',
    },
    template: {
      dir:  process.cwd()+'/templates/',
         adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
  }),
],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
