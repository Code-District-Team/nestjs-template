// branding.repository.ts
import { EntityTarget, EntityManager, Repository } from 'typeorm';
import { Branding } from './entities/branding.entity';
import { CreateBrandingDto } from './dto/create-branding.dto';

export class BrandingRepository extends Repository<Branding> {
    constructor(
        public entity: EntityTarget<Branding>,
        public manager: EntityManager
    ) {
        super(entity, manager);
    }

    async findAll() {
        return this.manager.find(this.entity);
    }

    async findOneById(id: string) {
        return this.manager.findOne(this.entity, { where: { id } });
    }

    async createBranding(body: CreateBrandingDto) {
        const branding = this.create(body);
        return this.manager.save(branding);
    }

    async createFirstTime(manager: EntityManager) {
        return manager.save(this.create({}));
    }

    async editBranding(id: string, body: CreateBrandingDto) {
        return this.manager.update(this.entity, id, body);
    }
}