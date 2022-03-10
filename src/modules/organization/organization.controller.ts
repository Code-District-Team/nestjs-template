import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/generalUtils/multerHelpers.utils";
import { DoesOrganizationExist } from "src/guards/doesOrganizationExist.guard";
import { DoesUserExist } from "../../guards/doesUserExist.guard";
import { IsSuperAdmin } from "../../guards/isSuperAdmin.guard";
import { constants } from "../auth/constants";
import {
  EditOrganizationDto,
  GetOrganizationDto,
  OrganizationDto,
  OrganizationSettingsDto,
} from "./dto/organization.dto";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(DoesOrganizationExist)
  @UseGuards(DoesUserExist)
  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  @Post()
  create(@Body(ValidationPipe) organizationDto: OrganizationDto) {
    return this.organizationService.create(organizationDto);
  }

  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  @Get()
  getAll(@Query() getOrganizationDto: GetOrganizationDto) {
    const { pageNumber, recordsPerPage, organizationName } = getOrganizationDto;
    return this.organizationService.getAll(pageNumber, recordsPerPage, organizationName);
  }

  @UseGuards(AuthGuard())
  @Put("/settings")
  updateSettings(@Body(ValidationPipe) settingsDto: OrganizationSettingsDto) {
    return this.organizationService.updateSettings(settingsDto);
  }
  @UseGuards(AuthGuard())
  @Get("/settings")
  getSettings(@Req() request: any) {
    return this.organizationService.getSettings(request.user.organizationId);
  }

  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  @Put()
  update(@Body(ValidationPipe) editOrganizationDto: EditOrganizationDto) {
    return this.organizationService.update(editOrganizationDto);
  }

  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  @Delete("/:id")
  async delete(@Param() param): Promise<{ message: string }> {
    return this.organizationService.delete(param.id);
  }

  @Post("/uploads/logo")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/logo",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { pictureUrl: file.filename };
  }

  @Get("/uploads/logo/:imgpath")
  getFile(@Param("imgpath") image, @Res() res) {
    return res.sendFile(image, { root: "./uploads/logo" });
  }

  @Get("/search")
  searchByName(@Query() organizationName: string) {
    return this.organizationService.search(organizationName);
  }

  @UseGuards(AuthGuard())
  @Get("/:id")
  async getById(@Param() param, @Req() req) {
    const user = req.user;
    const organization = await this.organizationService.getById(param.id);
    if (!organization) throw new NotFoundException("Organization does not exist");
    if (organization.user.id == user.id || user.type == constants.SuperAdminTypeName) return organization;
    else throw new ForbiddenException("Not an Organization User/Super Admin");
  }
}
