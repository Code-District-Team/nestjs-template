import { Body, Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { BrandingService } from "./branding.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Branding } from "./entities/branding.entity";
import { CreateBrandingDto } from './dto/create-branding.dto';
import { EditBrandingDto } from './dto/edit-branding.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

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
  @ApiBody({type: CreateBrandingDto})
  @ApiResponse({ status: 200, description: "Branded updated successfully" })
  @Patch("edit")
  async edit(@Body() body: CreateBrandingDto, @CurrentUser() user: User){
    const res = await this.brandingService.edit(user.tenant.brandingId, body);
    
    if (res.affected >=1)
      return {Result: "ok"}
    else throw new InternalServerErrorException();
  }

}
