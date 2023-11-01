import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CustomPipe } from "../../pipe/customValidation.pipe";
import { PaginateEntity } from "../../decorators/pagination.decorator";
import { QueryCollateralTypeDto } from "../../generalUtils/global.dtos";
import { Product } from "./entities/product.entity";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { validationPipe } from "../../pipe/nest-validation.pipe";
import { RolesPermissions } from "../../decorators/roles.decorator";
import { PermissionEnum, RoleEnum } from "../../common/enums/role.enum";
import { multerOptionsCSV, newLineToSpace } from "../../generalUtils/helper";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExportProductDto } from "./dto/export-product.dto";
import { pipeline } from 'stream/promises';
import * as csv from 'csv';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Product')
@ApiBearerAuth('JWT-auth')
@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  @ApiOperation({ summary: "Test cache -- it will set a key and expire in 10 seconds" })
  @Get("cache")
  async test() {
    const custom = await this.cacheManager.get('custom_key');
    if (!custom) {
      await this.cacheManager.set('custom_key', {
        date: new Date(),
        value: "custom_value"
      }, 10000);
      return await this.cacheManager.get('custom_key');
    }
    return custom;
  }


  @ApiOperation({ summary: "fetch all products without pagination" })
  @ApiResponse({ status: 200, type: [Product] })
  @Get("/get-all")
  getAllProductsWithoutPagination() {
    return this.productService.getAllProductsWithoutPagination();
  }

  @ApiOperation({ summary: "Export PDF using html renderer or pdf renderer" })
  @ApiParam({
    name: "type",
    enum: ["html", "pdf"],
    example: "html",
    required: false,
    description: "two types of rendering 1. html 2. pdf (default). If you want to get pdf rendered in html then pass html in type",
  })
  @Get("export-pdf/:type?")
  async exportPdf(@Res() res: any, @Param("type") type: string) {
    let pdfData: string;
    if (type === "html") pdfData = await this.productService.exportPdfHtml();
    else pdfData = await this.productService.exportPdf();
    res.set('Content-type', 'application/pdf');
    res.attachment(`Products.pdf`);
    res.send(pdfData);
  }

  @ApiOperation({ summary: "Fetch paginated products" })
  @ApiBody({ type: QueryCollateralTypeDto })
  @RolesPermissions([RoleEnum.USER], [PermissionEnum.WRITE_PRODUCT])
  @HttpCode(HttpStatus.OK)
  @Post("/get")
  @PaginateEntity({ table: Product }, [{
    joinType: "inner",
    property: "tenant",
    alias: "tenant",
    select: ["id", "name"],
    condition: "tenant.id = :tenantId",
    parameters: { tenantId: "tenant.id" }
  }])
  async getAllProducts(@Body(validationPipe) query: QueryCollateralTypeDto) {
  }

  @ApiOperation({ summary: "import products from csv file" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post("bulk-import")
  @UseInterceptors(FileInterceptor("file", multerOptionsCSV))
  async bulkImportProducts(@UploadedFile() file: Express.Multer.File) {
    const products = await this.productService.bulkImportProducts(file);
    if (products) return products;
    throw new InternalServerErrorException("Something went wrong");
  }

  @Post("bulk-export")
  @HttpCode(HttpStatus.OK)
  async bulkExportProducts(@Body(validationPipe) { ids }: ExportProductDto, @Res() res: any) {
    const products = await this.productService.bulkExportProducts(ids);
    res.set('Content-type', 'application/csv');
    res.attachment(`Products.csv`);
    return await pipeline(
      products,
      newLineToSpace,
      csv.stringify({ header: true, quoted: true, encoding: 'utf8' }),
      res
    );
  }

  @ApiOperation({ summary: "Create a new product" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: Product })
  @Post()
  async addProduct(@Body(CustomPipe) createProductDto: CreateProductDto) {
    const added = await this.productService.addProduct(createProductDto);
    if (added) return added;
    throw new InternalServerErrorException("Something went wrong");
  }

  @ApiOperation({
    summary: "Update a product",
    description: "All fields in the body are optional. Fields are available in create product endpoint"
  })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiBody({ type: UpdateProductDto })
  @Patch(":id")
  async updateProduct(
    @Param(CustomPipe) deleteProductDto: DeleteProductDto,
    @Body(CustomPipe) updateProductDto: UpdateProductDto
  ) {
    const updated = await this.productService.updateProduct(deleteProductDto.id, updateProductDto);
    if (updated.affected) return "Product Updated Successfully.";
    throw new NotFoundException("Couldn't update any row");
  }

  @ApiOperation({ summary: "Delete a product" })
  @ApiParam({ name: "id", type: String, required: true })
  @Delete(":id")
  async deleteProduct(@Param(CustomPipe) deleteProductDto: DeleteProductDto) {
    const deleteResult = await this.productService.deleteProduct(deleteProductDto.id);
    if (deleteResult.affected) return "Product deleted successfully";
    throw new NotFoundException("Product not found");
  }

}
