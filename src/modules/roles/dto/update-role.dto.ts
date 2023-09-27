import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./createRole.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
}

