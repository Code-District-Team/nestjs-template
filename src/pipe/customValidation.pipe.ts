import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
@Injectable()
export class CustomPipe implements PipeTransform<any> {
  constructor(private dataSource: DataSource) {}
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object,{whitelist:true,forbidNonWhitelisted: true});

    // pass validation test

    let databaseWhere = [];
    let databaseColumn = {};
    let model = null;
    let uniqueSize = 0;

    let customError = errors.reduce((acc, obj) => {
      const { Unique, ...other } = obj.constraints;
      if (Unique && Object.keys(other).length === 0) {
        model = Unique;
        uniqueSize++;
        databaseWhere.push({ [obj.property]: obj.value });
        databaseColumn[obj.property] = obj.value;
      }

      return { [obj.property]: Object.values(other), ...acc };
    }, {});

    if (model) {
      const repo = this.dataSource.getRepository(model);

      //   check duplicate data exist
      const data = await repo.find({ where: databaseWhere });

      data.forEach((obj) => {
        for (let value in databaseColumn) {
          if (obj[value] === databaseColumn[value]) {
            uniqueSize--;
            customError[value].push(`Duplicate entry for ${value}`);
            // little optimization
            delete databaseColumn[value];
          }
        }
      });
    }

    if (errors.length - uniqueSize > 0) {
      throw new BadRequestException(customError);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
