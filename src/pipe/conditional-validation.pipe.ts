import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { AgGridQueryDto, ConditionQueryDto } from "../generalUtils/global.dtos";

export function ConditionalCondition1(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'conditionalCondition1',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as ConditionQueryDto;
          // Check the field value and apply the appropriate validation logic
          if (dto.filterType === 'date') {

            // Apply validation rules for the 'date' condition
            // You can access the 'value' parameter and validate it accordingly
            // For example, check if it's a valid date format
            // If it's not valid, return false, otherwise return true
          } else {
            // Apply validation rules for other conditions
            // You can define different validation logic based on other field values
          }

          return true; // Return true by default, since validation is handled conditionally
        },
      },
    });
  };
}

// Now, apply this custom decorator to the condition1 property in your AgGridQueryDto class:
//
// typescript
//
// import { IsString, MaxLength, IsObject, IsNotEmptyObject, Type } from 'class-validator';
//
// export class AgGridQueryDto {
//   @IsString()
//   @MaxLength(100, { message: "field must not be greater than 100 characters." })
//   field: string;
//
//   @IsObject()
//   @IsNotEmptyObject()
//   @ValidateNested({ each: true })
//   @Type(() => ConditionQueryDto)
//   @ConditionalCondition1() // Apply the custom decorator
//   condition1: ConditionQueryDto;
// }
//
// With this setup, the ConditionalCondition1 decorator will check the field value and conditionally validate the condition1 property based on the specified logic for each field value. You can define the validation rules within the decorator's validate method based on the field value.
