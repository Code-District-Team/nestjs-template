import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";

@Processor('mail')
export class MailConsumer {

  @Process("sendForgetPassword")
  async sendForgetPassword(job: Job<unknown>) {
    console.log(job.data);
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      // create a new file in the tmp directory, write some data into it and close it.
      fs.writeFile(`/home/powers/WebstormProjects/nest_template/test-${i}.txt`, "Hey there!", function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      progress += 10;
      await job.progress(progress);
    }
    return {};
  }
}