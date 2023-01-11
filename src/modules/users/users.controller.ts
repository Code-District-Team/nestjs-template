import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards, ValidationPipe, Put, Query, Param, UseInterceptors, UploadedFile, Res, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserProfileDto, BlockUser } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";
import { constants } from "../auth/constants";
import { IsSuperAdmin } from "src/guards/isSuperAdmin.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { config, S3 } from "aws-sdk";
import envConfig from "src/config/env.config";
import { createImageDestinationPaths3 } from "src/generalUtils/multerHelpers.utils";

const multerS3 = require("multer-s3");
config.update({
  accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  region: envConfig.AWS_REGION,
  signatureVersion: "v4",
});
const s3 = new S3();

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("update-profile")
  @UseGuards(AuthGuard())
  updateProfile(@Req() request, @Body(ValidationPipe) userProfileDto: UserProfileDto) {
    // if (request.user.type != constants.OrgUserTypeName)
    //   throw new HttpException("Not a Org User", HttpStatus.BAD_REQUEST);
    return this.userService.updateProfile(request.user.id, userProfileDto);
  }

  @Get("get-profile")
  @UseGuards(AuthGuard())
  getUser(@Req() request) {
    try {
      // if (request.user.type != constants.OrgUserTypeName)
      //   throw new HttpException("Not a Org User", HttpStatus.BAD_REQUEST);
      return this.userService.getUser(request.user.id);
    } catch (err) {
      console.log(err);
    }
  }

  @Get("/:uuid")
  getUserWithUuid(@Param("uuid") uuid) {
    try {
      return this.userService.getUserwithUuid(uuid);
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  getAllUsers(@Query() params) {
    try {
      const {pageNumber, recordsPerPage} = params
      return this.userService.findAll(pageNumber, recordsPerPage);
    } catch (err) {
      console.log(err);
    }
  }


  @UseGuards(AuthGuard())
  @Post("upload-picture")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multerS3({
        s3: s3,
        bucket: envConfig.AWS_BUCKET,
        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: createImageDestinationPaths3,
      }),
      // fileFilter: videoFileFilter,
      limits: { fileSize: 500 * 1024 * 1024 },
    })
  )
  async create(@UploadedFile() file: any, @Req() req) {
    if (!file) {
      throw new HttpException("image file is required", HttpStatus.NOT_FOUND);
    }
    console.log(file)
    return { url: file.key}
  }

  @Get("/get-image/uploads/:id/images/:filePath")
  async getPicture(@Param("filePath") filePath:string, @Param("id") id , @Res() res){
    const file = "uploads/" + id + "/images/" + filePath
    const params = { Key: file, Bucket: envConfig.AWS_BUCKET }//, Expires: 30 * 60, }
    try {
      // const url = await s3.getSignedUrl("getObject", params);
      s3.getObject(params)
    .createReadStream()
    .on("error", (err) => {
      res.status(500).send("Something went wrong");
    })
    .pipe(res);
      // return url
    } catch (error) {
      console.log("Error getting presigned url from AWS S3", error);
      throw new Error("Error getting presigned url from AWS S3");
    }
  }
  
  @Delete("delete-profile")
  @UseGuards(AuthGuard())
  deleteProfile(@Req() request,) {
    return this.userService.deleteUser(request.user.id);
  }
}