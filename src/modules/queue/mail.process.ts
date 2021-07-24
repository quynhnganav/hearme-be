import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as nodemailer from "nodemailer";
import * as moment from 'moment';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  @Process('sendMail')
  async handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    await this.sendMail(job.data.email, job.data.name)
    this.logger.debug('Transcoding completed');
  }

  async sendMail(email: string, name: string, time?: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'vanquangmai20@gmail.com',
            pass: 'wosgwbrjwaypgnvb',
        }
    })
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'hearMe - ClosureJS Team',
        to: email,
        subject: 'Welcome to hearMe',
        text: 'You recieved message from vanquangmai20@gmail.com',
        html: `<h1>Dear ${name},</h1><p>Welcome to hearMe, designed by ClosureJS</p><p>Login at: ${time || moment().format("HH:mm DD-MM-YYYY")}</p>`
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
            // res.redirect('/');
        } else {
            console.log(info);
            // res.redirect('/');
        }
    });
}

}
