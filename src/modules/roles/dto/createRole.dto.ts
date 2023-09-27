import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[]
}
