import { DeleteResult, EntityRepository, Repository, UpdateResult } from "typeorm";
import { EditOrganizationDto, OrganizationDto } from "./dto/organization.dto";
import { Organization } from "./organization.entity";

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  async createNew(organizationDto: OrganizationDto): Promise<Organization> {
    const newOrg = new Organization();
    newOrg.pictureUrl = organizationDto.pictureUrl;
    newOrg.customDomain = organizationDto.customDomain;
    newOrg.organizationName = organizationDto.organizationName;
    newOrg.domainPrefix = organizationDto.domainPrefix;
    newOrg.internalDescription = organizationDto.internalDescription;
    newOrg.pictureUrl = newOrg.pictureUrl;
    return await newOrg.save();
  }
  async getAll(pageNumber: number, recordsPerPage: number, organizationName: string): Promise<Organization[]> {
    return await this.find({
      skip: pageNumber * recordsPerPage,
      take: recordsPerPage,
      order: { createdAt: "DESC" },
      ...(organizationName && {
        where: `organization_name ILIKE '%${organizationName}%'`,
      }),
    });
  }
  async getById(organizationId): Promise<Organization> {
    return await this.findOne({ id: organizationId });
  }

  async getByDomainPrefix(domainPrefix): Promise<Organization> {
    return await this.findOne({ domainPrefix });
  }
  async updateOrganization(editOrganizationDto: EditOrganizationDto): Promise<UpdateResult> {
    return await this.update(editOrganizationDto.organizationId, editOrganizationDto);
  }
  async deleteOrganization(id: number): Promise<DeleteResult> {
    return await this.softDelete(id);
  }
  async findOneByDomainPrefix(domainPrefix) {
    return this.findOne({ domainPrefix });
  }

  async searchOnName(organizationName: any): Promise<Organization[]> {
    return this.find({ where: `organization_name ILIKE '%${organizationName.organizationName}%'` });
    // return this.find({ where: "organization_name ILIKE '%meg%'" });
  }
}
