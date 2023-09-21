import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ name: 'IsStringOrNull', async: false })
export class IsStringOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (args.object['filterType'] === "number")
      return typeof value === "number" && value < 9007199254740991 && value > -9007199254740991;
    if (args.object['filterType'] === "text")
      return typeof value === 'string' && value.length < 255;
    return false
  }

  defaultMessage(args: ValidationArguments): string {
    if (args.object['filterType'] === "number")
      return "filter must be a number";
    return "filter must be a string";
  }
}

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsStringOrNullConstraint,
    });
  };
}