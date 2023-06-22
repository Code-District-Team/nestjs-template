import { IsUUID } from 'class-validator';

export class UserIdDto {
  @IsUUID()
  id: string;
}
