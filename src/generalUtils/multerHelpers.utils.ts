import { HttpException, HttpStatus } from "@nestjs/common";
import * as fs from "fs";
import { extname } from "path";
import { Organization } from "src/modules/organization/organization.entity";
import { v4 as uuidv4 } from "uuid";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4|mov|m4v|flv|webm)$/)) {
    // throw new HttpException("Only video files are allowed!", HttpStatus.BAD_REQUEST);
    return callback(new HttpException("Only video files are allowed!", HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  // const name = file.originalname.split(".")[0]
  const name = uuidv4();
  const fileExtName = extname(file.originalname);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 16).toString(16))
  //   .join("");
  // callback(null, `${name}-${randomName}${fileExtName}`);
  callback(null, `${name}${fileExtName}`);
};

export const createDestinationPath = (req, file, callback) => {
  const orgName = "./uploads/" + req.user.organization.id;

  if (!fs.existsSync(orgName)) {
    fs.mkdirSync(orgName);
  }
  callback(null, orgName);
};

export const createVideoDestinationPath = async (req, file, callback) => {
  const organizationData = await Organization.findOne({ domainPrefix: req.headers.host.split(".")[0] });
  if (!organizationData) {
    callback(new HttpException("Invalid Domain Prefix", HttpStatus.BAD_REQUEST), null);
    return;
  }
  const orgPath = "./uploads/" + organizationData.id;
  const orgName = "./uploads/" + organizationData.id + "/question" + req.params.questionId;
  if (!fs.existsSync(orgPath)) {
    fs.mkdirSync(orgPath);
  }
  if (!fs.existsSync(orgName)) {
    fs.mkdirSync(orgName);
  }
  callback(null, orgName);
};
