import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CustomPipe } from "../../pipe/customValidation.pipe";

@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // add product
  @Post()
  async addProduct(@Body(CustomPipe) createProductDto: CreateProductDto) {
    const added = await this.productService.addProduct(createProductDto);
    if (added) return "Product Added Successfully.";
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
