import { PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./createRole.dto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
}

