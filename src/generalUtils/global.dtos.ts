import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";
import { SortOrders, SortOrderValues } from "./types";

export class QueryCollateralTypeDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortOrderValues)
  sortOrder: SortOrders;
}