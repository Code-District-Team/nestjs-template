import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Product } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";
import * as csv from "csvtojson";
import * as fs from "fs";

@Injectable()
export class ProductService {

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
  }

  async getAllProducts(): Promise<Product[]> {
    const result = await this.productRepository.find();
    result.forEach(product => {
      product.price = +product.price;
    });
    return result;
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

  async bulkImportProducts(csvFile: Express.Multer.File) {
    const path = csvFile.path;
    const products: Product[] = [];
    const csvData = await csv().fromFile(path);
    const errors = []; // row, columns, error
    csvData.forEach((row, index) => {
      const error: { row: number, errors: string[] } = {
        row: index + 1,
        errors: [],
      };
      const { name, price, quantity } = row;
      if (!name && !price && !quantity) return;
      if (isNaN(+price))
        error.errors.push("price should be a number");
      if (+price > 9999999999.99)
        error.errors.push("price should be less than 9999999999.99");
      if (isNaN(+quantity) || +quantity % 1 !== 0)
        error.errors.push("quantity should be a number");
      if (+quantity > 2147483648)
        error.errors.push("quantity should be less than 2147483648");
      if (name.length > 255)
        error.errors.push("name should be less than 255 characters");
      if (error.errors.length) {
        errors.push(error);
        return;
      }
      const newProduct = new Product();
      newProduct.name = name;
      newProduct.price = +price;
      newProduct.quantity = +quantity;
      products.push(newProduct);
    });
    fs.unlinkSync(path);
    if (errors.length) {
      throw new BadRequestException({ errors });
    }
    return this.productRepository.save(products);
  }

  async bulkExportProducts(ids: string[]) {
    return this.productRepository.createQueryBuilder("product")
      .where("product.id IN (:...ids)", { ids })
      .stream();
  }

  async getAllProductsWithoutPagination() {
    return await this.productRepository.find();
  }
}
