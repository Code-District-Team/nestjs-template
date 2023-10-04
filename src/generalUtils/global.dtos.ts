import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty, IsArray, IsDate, IsDateString, IsDefined,
  IsEnum, IsNotEmptyObject,
  IsNumber, IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested
} from "class-validator";
import { AgGridFilter, AgGridFilterValues, SortOrders, SortOrderValues } from "./types";
import { IsStringOrNull } from "../pipe/string-or-null.pip";

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

  // @IsOptional()
  @IsEnum(["ag-grid", "antd"], { message: "filterType must be one of the following ag-grid, antd" })
  filterType: "ag-grid" | "antd";

  @ValidateIf((o) => o.filterType === "antd")
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  filters: Object;

  @ValidateIf((o) => o.filterType === "ag-grid")
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AgGridQueryDto)
  agGrid: AgGridQueryDto[];
}

export class ConditionQueryDto {
  @IsEnum(["text", "number", "date"], { message: "type must be one of the following text, number, date" })
  @MaxLength(250, { message: "type must not be greater than 250 characters." })
  filterType: "text" | "number" | "date";

  @IsEnum(AgGridFilterValues, { message: "filterModel must be one of the following " + AgGridFilterValues.join(", ") })
  type: AgGridFilter;

  @ValidateIf((o) => o.filterType !== "date" && o.type !== "empty" && o.type !== "notEmpty")
  @IsStringOrNull()
  filter: string | number;

  @ValidateIf((o) => o.filterType === "date")
  @Type(() => Date)
  @IsDate()
  dateFrom: Date;

  @ValidateIf((o) => o.filterType === "date" && o.type === "inRange")
  @Type(() => Date)
  @IsDate()
  dateTo: Date;
}

export class AgGridQueryDto {
  @IsString()
  @MaxLength(100, { message: "field must not be greater than 100 characters." })
  field: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => ConditionQueryDto)
  condition1: ConditionQueryDto;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => ConditionQueryDto)
  condition2: ConditionQueryDto;

  @ValidateIf((o) => o.condition2)
  @IsEnum(["AND", "OR"], { message: "operator is required when condition2 is present and must be one of the following AND, OR" })
  operator: "AND" | "OR";
}

