import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import envConfig from "src/config/env.config";
import { MailService } from "./mail.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.sendgrid.net",
        secure: false,
        port: 587,
        auth: {
          user: "apikey",
          pass: envConfig.smtpKey,
        },
      },
      defaults: {
        from: `Forgot Password Request <${envConfig.smtpEmail}>`,
      },
      template: {
        dir: process.cwd() + "/templates/",
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
