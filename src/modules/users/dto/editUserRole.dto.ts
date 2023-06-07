import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Unique } from 'src/decorators/unique.decorator';

export class EditUserRoleDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
