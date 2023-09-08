import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Hero } from "./entities/hero.entity";
import { Repository } from "typeorm";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';


@Injectable()
export class HeroService extends TypeOrmCrudService<Hero> {
  constructor(@InjectRepository(Hero) public readonly repo: Repository<Hero>) {
    super(repo);
  }
}
