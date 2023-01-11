// import {
//   Controller,
//   Get,
//   NotFoundException,
//   Post,
//   Req,
//   Res,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { FileInterceptor } from "@nestjs/platform-express";
// import { InjectRepository } from "@nestjs/typeorm";
// import * as fs from "fs";
// import { diskStorage } from "multer";
// import {
//   createDestinationPath,
//   editFileName,
//   imageFileFilter,
//   pdfFileFilter,
//   pdfFileName,
// } from "src/generalUtils/multerHelpers.utils";
// import { OrganizationRepository } from "../organization/organization.repository";

// @Controller("upload-images")
// export class UploadImagesController {
//   constructor(
//     @InjectRepository(OrganizationRepository) private readonly organizationRepository: OrganizationRepository
//   ) {}

//   @Post()
//   @UseGuards(AuthGuard())
//   @UseInterceptors(
//     FileInterceptor("file", {
//       storage: diskStorage({
//         destination: createDestinationPath,
//         filename: editFileName,
//       }),
//       fileFilter: imageFileFilter,
//       limits: { fileSize: 50 * 1024 * 1024 },
//     })
//   )
//   uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
//     console.log(req.user.organization.id);
//     return { pictureUrl: req.user.organization.id + "/" + file.filename };
//   }

//   @Post("/pdf")
//   @UseGuards(AuthGuard())
//   @UseInterceptors(
//     FileInterceptor("file", {
//       storage: diskStorage({
//         destination: createDestinationPath,
//         filename: pdfFileName,
//       }),
//       fileFilter: pdfFileFilter,
//       limits: { fileSize: 10485760 },
//     })
//   )
//   async uploadPdf(@UploadedFile() file: Express.Multer.File, @Req() req) {
//     // const organization = await this.organizationRepository.findOne({ id: req.user.organization.id });
//     const url = req.user.organization.id + "/" + file.filename;
//     // organization.pdfUrl = url;
//     // await organization.save();
//     return { pictureUrl: url };
//   }

//   @Get("/pdf/:orgId/:fileName")
//   async getPdf(@Req() req, @Res() res) {
//     const organization = await this.organizationRepository.findOne({ id: req.params.orgId });
//     try {
//       if (organization.pdfUrl) {
//         if (fs.existsSync(`./uploads/${req.params.orgId}/${req.params.fileName}`)) {
//           return res.sendFile(req.params.fileName, {
//             root: `./uploads/${req.params.orgId}`,
//           });
//         } else {
//           throw new NotFoundException("PDF Not Found");
//         }
//       } else {
//         return res.sendFile("megilla-terms-and-conditions-doc.pdf", { root: `./public` });
//       }
//     } catch (err) {
//       throw new NotFoundException("PDF Not Found");
//     }
//   }

//   @Get("/:orgId/:fileName")
//   getFile(@Req() req, @Res() res) {
//     try {
//       if (fs.existsSync(`./uploads/${req.params.orgId}/${req.params.fileName}`)) {
//         return res.sendFile(req.params.fileName, { root: `./uploads/${req.params.orgId}` });
//       } else {
//         throw new NotFoundException("Image Not Found");
//       }
//     } catch (err) {
//       throw new NotFoundException("Image Not Found");
//     }
//   }
// }
