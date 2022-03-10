import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import { createDestinationPath, editFileName, imageFileFilter } from "src/generalUtils/multerHelpers.utils";

@Controller("upload-images")
export class UploadImagesController {
  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: createDestinationPath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    console.log(req.user.organization.id);
    return { pictureUrl: req.user.organization.id + "/" + file.filename };
  }

  @Get("/:orgId/:fileName")
  getFile(@Req() req, @Res() res) {
    try {
      if (fs.existsSync(`./uploads/${req.params.orgId}/${req.params.fileName}`)) {
        return res.sendFile(req.params.fileName, { root: `./uploads/${req.params.orgId}` });
      } else {
        throw new NotFoundException("Image Not Found");
      }
    } catch (err) {
      throw new NotFoundException("Image Not Found");
    }
  }
}
