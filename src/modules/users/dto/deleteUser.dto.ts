import { IsUUID } from 'class-validator';

export class DeleteUserDto {
  @IsUUID()
  id: string;
}
