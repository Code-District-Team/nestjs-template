import { HttpException, HttpStatus } from "@nestjs/common";
import * as fs from "fs";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";


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

  callback(null, `${name}${fileExtName}`);
};


export const createAudioDestinationPath = async (req, file, callback) => {
let videoPath
      videoPath = "./uploads/videos/"
  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  }
  callback(null, videoPath);
};

export const createAudioDestinationPaths3 = async (req, file, callback) => {
  const name = uuidv4();
  let fileExtName = extname(file.originalname);
  if(!fileExtName){
    fileExtName = file.mimetype.split("/")[1] == "x-matroska" ? ".mkv" : "."+ file.mimetype.split("/")[1]
  }
  let fileName = `${name}${fileExtName}`
  let videoPath
        videoPath = "uploads/" + req?.user?.id + "/audios/" + fileName
    callback(null, videoPath);
  };

  export const createImageDestinationPaths3 = async (req, file, callback) => {
    const name = uuidv4();
    let fileExtName = extname(file.originalname);
    let fileName = `${name}${fileExtName}`
    let videoPath
          videoPath = "uploads/" + req?.user?.id + "/images/" + fileName
      callback(null, videoPath);
    };
