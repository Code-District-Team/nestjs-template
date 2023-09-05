import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Max, MaxLength, Min } from "class-validator";
import { SortOrders, SortOrderValues } from "./types";

/**
  * This is a generic dto for querying a list of entities.
  * Please extend and override the sortBy property to allow only valid sort fields.
 */
export class QueryCollateralTypeDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100, { message: "limit must not be greater than 100, we can't bear that much load." })
  limit: number;

  @IsOptional()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortOrderValues, { message: "sortOrder must be one of the following " + SortOrderValues.join(", ") })
  sortOrder: SortOrders;

  @IsOptional()
  @MaxLength(100, { message: "query must not be greater than 100 characters." })
  query: string;
}