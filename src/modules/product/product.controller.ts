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


@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  @Get("test")
  async test() {
    const custom = await this.cacheManager.get('custom_key');
    if (!custom) {
      console.log("set");
      await this.cacheManager.set('custom_key', {
        date: new Date(),
        value: "custom_value"
      }, 10000);
      return await this.cacheManager.get('custom_key');
    }
    console.log("get");
    return custom;
  }

  @Post("/get-all")
  getAllProductsWithoutPagination() {
    return this.productService.getAllProductsWithoutPagination();
  }

  @RolesPermissions([RoleEnum.USER], [PermissionEnum.WRITE_PRODUCT])
  @HttpCode(HttpStatus.OK)
  @Post("/get")
  @PaginateEntity({ table: Product }, [])
  async getAllProducts(@Body(validationPipe) query: QueryCollateralTypeDto) {
  }

  // bulk import products (csv) upload
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

  // add product
  @Post()
  async addProduct(@Body(CustomPipe) createProductDto: CreateProductDto) {
    const added = await this.productService.addProduct(createProductDto);
    if (added) return added;
    throw new InternalServerErrorException("Something went wrong");
  }

  // update product
  @Patch(":id")
  async updateProduct(
    @Param(CustomPipe) deleteProductDto: DeleteProductDto,
    @Body(CustomPipe) updateProductDto: UpdateProductDto
  ) {
    const updated = await this.productService.updateProduct(deleteProductDto.id, updateProductDto);
    if (updated.affected) return "Product Updated Successfully.";
    throw new NotFoundException("Couldn't update any row");
  }

  // delete product
  @Delete(":id")
  async deleteProduct(@Param(CustomPipe) deleteProductDto: DeleteProductDto) {
    const deleteResult = await this.productService.deleteProduct(deleteProductDto.id);
    if (deleteResult.affected) return "Product deleted successfully";
    throw new NotFoundException("Product not found");
  }

}
