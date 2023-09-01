import { Injectable } from '@nestjs/common';
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Product } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
  }

  getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  getById(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  addProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.save(this.productRepository.create(createProductDto));
  }

  updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.productRepository.update({ id }, updateProductDto);
  }

  deleteProduct(id: string): Promise<DeleteResult> {
    return this.productRepository.delete({ id });
  }


}
