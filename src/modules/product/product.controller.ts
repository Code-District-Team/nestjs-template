import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post, Query
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CustomPipe } from "../../pipe/customValidation.pipe";
import { paginate } from "../../decorators/pagination.decorator";
import { QueryCollateralTypeDto } from "../../generalUtils/global.dtos";
import { Product } from "./entities/product.entity";

@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {
  }


  @Get()
  @paginate({ table: Product })
  async getAllProducts(@Query(CustomPipe) query: QueryCollateralTypeDto) {
    console.log("Hello");
    return this.productService.getAllProducts();
  }

  // get product by id
  @Get(":id")
  async getProductById(@Param(CustomPipe) deleteProductDto: DeleteProductDto) {
    const product = await this.productService.getById(deleteProductDto.id);
    if (product) return product;
    throw new NotFoundException("Product not found");
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
