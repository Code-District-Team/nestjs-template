import { IsUUID } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class UserIdDto {
  @ApiProperty({
    description: 'User id',
    type: 'string',
  })
  @IsUUID()
  id: string;
}
