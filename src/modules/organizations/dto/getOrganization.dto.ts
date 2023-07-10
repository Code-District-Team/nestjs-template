import { IsNumber } from 'class-validator';

export class GetOrganizationDto {
  @IsNumber()
  pageNumber: number;

  @IsNumber()
  recordsPerPage: number;
  organizationName: string;
}
