import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { BrandingService } from "./branding.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Branding } from "./entities/branding.entity";
import { CreateBrandingDto } from './dto/create-branding.dto';
import { EditBrandingDto } from './dto/edit-branding.dto';

@ApiTags('Branding')
@ApiBearerAuth('JWT-auth')
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {
  }


  @ApiOperation({ summary: "list all Brandings" })
  @ApiResponse({ status: 200, description: "Return all brandings", type: [Branding] })
  @Get()
  findAll() {
    return this.brandingService.findAll();
  }

  @ApiOperation({ summary: "Get users along with their brandings" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiResponse({ status: 200, description: "Get single branding using id" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.brandingService.findOne(id);
  }

  @ApiOperation({ summary: "Create branding" })
  @ApiBody({type:CreateBrandingDto})
  @ApiResponse({ status: 200, description: "Branded added successfully" })
  @Post("create")
  create(@Body() body: CreateBrandingDto){
    return this.brandingService.create(body);
  }

  @ApiOperation({ summary: "Edit branding" })
  @ApiBody({type: EditBrandingDto})
  @ApiResponse({ status: 200, description: "Branded updated successfully" })
  @Patch("edit")
  edit(@Body() body: EditBrandingDto){
    return this.brandingService.edit(body);
  }

}
