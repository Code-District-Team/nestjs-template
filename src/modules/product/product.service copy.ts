import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Product } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";
import * as csv from "csvtojson";
import * as fs from "fs";
import { jsPDF } from "jspdf";
import * as html_to_pdf from "html-pdf-node";

@Injectable()
export class ProductService {

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
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
      if (!name && !price && !quantity)
        error.errors.push("name, price and quantity are required");
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

  getAllProductsWithoutPagination() {
    return this.productRepository.find({take: 100});
  }

  async exportPdf() {
    const doc = new jsPDF();
    // get all products and write them in pdf (name, price, quantity)
    const products = await this.productRepository.find({ take: 10 });
    const productsPerPage = 20;
    for (let i = 0; i < products.length; i += productsPerPage) {
      const productsPage = products.slice(i, i + productsPerPage);

      // write header
      this.writeHeader(doc);
      // write rows
      productsPage.forEach((product, index) => {
        this.writeRow(doc, i + index + 1, 35 + index * 10,
          [
            (i + index + 1).toString(),
            product.name,
            product.price.toString(),
            product.quantity.toString(),
            product.createdAt.toLocaleDateString()]);
      });

      if (i + productsPerPage < products.length) {
        // add page in footer
        doc.setFontSize(10);
        doc.text("Page " + (i / productsPerPage + 1), 10, 290, { align: "center" });
        doc.addPage();
      }
    }

    doc.addPage();
    // add image from public folder
    // const imgData = 'data:image/jpeg;base64,' +
    //   fs.readFileSync('/home/powers/WebstormProjects/nest_template/public/73f02330-a200-43f4-81f9-5f7bc73e18a9.jpeg', { encoding: 'base64' });
    // doc.addImage(imgData, 'JPEG', 10, 10, 50, 50);
    // send stream to client
    const img = 'data:image/jpeg;base64,' +
      fs.readFileSync('/home/powers/WebstormProjects/nest_template/public/73f02330-a200-43f4-81f9-5f7bc73e18a9.jpeg', { encoding: 'base64' });
    doc.addImage(img, 'JPEG', 10, 10, 500, 500);

    return doc.output();
  }

  async exportPdfHtml() {
    const options = { format: 'A4' };
    let file = { content: "" };
    const products = await this.productRepository.find({ take: 100 });
    file.content = "<html><body><table><thead><tr><th>#</th><th>Name</th><th>Price</th><th>Quantity</th><th>Created At</th></tr></thead><tbody>";
    products.forEach((product, index) => {
      file.content += `<tr><td>${index + 1}</td><td>${product.name}</td><td>${product.price}</td><td>${product.quantity}</td><td>${product.createdAt.toLocaleDateString()}</td></tr>`;
    });
    file.content += "</tbody></table></body></html>";
    // add image from public folder
    const imgData = 'data:image/jpeg;base64,' +
      fs.readFileSync('/home/powers/WebstormProjects/nest_template/public/73f02330-a200-43f4-81f9-5f7bc73e18a9.jpeg', { encoding: 'base64' });
    file.content += `<img src="${imgData}" alt="image" />`;
    return html_to_pdf.generatePdf(file, options)
  }

  private writeHeader(doc: jsPDF) {
    const colHeaders = ["#", "Name", "Price", "Quantity", "Created At"];
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidths = [pageWidth * 0.05, pageWidth * 0.4, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.25];
    doc.setDrawColor(0, 0, 0);
    doc.setFontSize(10);
    doc.line(10, 20, pageWidth - 10, 20);
    let paddingLeft = 10;
    for (let i = 0; i < colHeaders.length; i++) {
      doc.setFont("helvetica", "bold");
      doc.text(colHeaders[i], paddingLeft, 25, { align: "left" });
      paddingLeft += colWidths[i];
    }
    doc.line(10, 28, pageWidth - 10, 28);
  }

  private writeRow(doc: jsPDF, num: number, y: number, row: string[]) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidths = [pageWidth * 0.05, pageWidth * 0.4, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.25];
    doc.setFont("helvetica", "normal");
    doc.text(num.toString(), 10, y, { align: "left" });
    let paddingLeft = 10;
    for (let i = 0; i < row.length; i++) {
      const cellWidth = doc.getStringUnitWidth(row[i]) * 10 / doc.internal.scaleFactor;
      if (i === 1 && cellWidth > colWidths[i]) {
        const trim = this.trimText(row[i].length, cellWidth, colWidths[i]);
        row[i] = row[i].slice(0, row[i].length - trim - 3) + "...";
      }
      doc.text(row[i], paddingLeft, y, { align: "left" });
      paddingLeft += colWidths[i];
    }
    doc.setDrawColor(192, 192, 192);
    doc.line(10, y + 5, pageWidth - 10, y + 5);
  }

  private trimText(charLength: number, cellWidth: number, colWidth: number) {
    // return the number of chars to trim
    const charWidth = colWidth / charLength;
    return Math.floor((cellWidth - colWidth) / charWidth);
  }

  private createTable(products: Product[]) {
    const headers = ["Name", "Price", "Quantity", "Created At"]
    const rows = products.map(product => [product.name, product.price, product.quantity, product.createdAt.toLocaleDateString()]);
    return this.createTableString(headers, rows);
  }

  private createTableString(headers: string[], rows: (string | number)[][]) {
    const columnWidth = 50;
    const headerRow = headers.map(header => this.pad(header, columnWidth));
    const rowsString = rows.map(row => row.map(cell => this.pad(cell, columnWidth)));
    const table = [headerRow, ...rowsString];
    return table.map(row => row.join("")).join("\n");
  }

  private pad(text: string | number, width: number) {
    if (typeof text === "number")
      text = text.toString();
    return text.padEnd(width, " ");
  }

}
