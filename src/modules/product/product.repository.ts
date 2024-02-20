// product.repository.ts
import { EntityTarget, EntityManager, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as csv from 'csvtojson';
import * as fs from 'fs';

export class ProductRepository extends Repository<Product> {
    constructor(
        public entity: EntityTarget<Product>,
        public manager: EntityManager
    ) {
        super(entity, manager);
    }

    async addProduct(dto: CreateProductDto): Promise<Product> {
        const product = this.create(dto);
        return this.manager.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.manager.find(this.entity);
    }

    async getProductById(id: string): Promise<Product> {
        return this.manager.findOne(this.entity, { where: { id } });
    }

    async updateProduct(id: string, dto: UpdateProductDto): Promise<UpdateResult> {
        return this.manager.update(this.entity, id, dto);
    }

    async deleteProduct(id: string): Promise<DeleteResult> {
        return this.manager.delete(this.entity, id);
    }
    async bulkImportProducts(csvFile: Express.Multer.File): Promise<Product[]> {
        const path = csvFile.path;
        const productsData = await csv().fromFile(path);
    
        const products: Product[] = productsData.map(data => {
            const product = new Product();
            product.name = data.name;
            product.price = parseFloat(data.price); 
            product.quantity = parseInt(data.quantity); 
            product.createdAt = new Date();
            product.updatedAt = new Date();
            return product;
        });
    
        fs.unlinkSync(path);
        return this.manager.save(this.entity, products);
    }
    

    async bulkExportProducts(ids: string[]): Promise<Product[]> {
        return this.manager.findByIds(this.entity, ids);
    }

    async getAllProductsWithoutPagination(): Promise<Product[]> {
        return this.manager.find(this.entity, { take: 100 });
    }

    async findProductsForPdfExport(take: number = 10): Promise<Product[]> {
        return this.manager.find(this.entity, { take });
    }

}
