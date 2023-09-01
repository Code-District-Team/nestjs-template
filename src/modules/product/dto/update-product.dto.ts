import { CreateProductDto } from "./create-product.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";


export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ["id"] as const)) {
}