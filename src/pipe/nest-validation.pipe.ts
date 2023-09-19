import { BadRequestException, ValidationPipe } from "@nestjs/common";

function traverse(obj, validationErrors, index=0) {
  for (const key in obj) {
    if (obj[key] instanceof Object) {
      if (key === "constraints") {
        // console.log(obj.property, obj.constraints)
        validationErrors[obj.property] = Object.values(obj.constraints);
      }
      // console.log(index);
      traverse(obj[key], validationErrors, index+1); // recursively call traverse for nested object
    }
  }
}

export const validationPipe = new ValidationPipe({
  transformOptions: {
    enableImplicitConversion: true, // allows type conversion
  },
  whitelist: true,

  exceptionFactory: (errors) => {
    const validationErrors = {};
    traverse(errors, validationErrors);
    throw new BadRequestException(validationErrors);
    // return errorResponse("Validation Failed.", 400, validationErrors);
  },
});