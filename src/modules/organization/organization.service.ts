import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../users/user.repository";
import { EditOrganizationDto, OrganizationDto, OrganizationSettingsDto } from "./dto/organization.dto";
import { Organization } from "./organization.entity";
import { OrganizationRepository } from "./organization.repository";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  async create(organizationDto: OrganizationDto): Promise<Organization> {
    //create organization
    //create User
    //return origanziation+user
    const newUser = {
      firstName: organizationDto.firstName,
      lastName: organizationDto.lastName,
      email: organizationDto.email,
      password: organizationDto.password,
      domainPrefix: organizationDto.domainPrefix,
    };
    const organization = await this.organizationRepository.createNew(organizationDto);
    const user = await this.userRepository.createOrganizationUser(newUser, organization);
    organization.user = user;
    return organization;
  }

  async getAll(pageNumber: number, recordsPerPage: number, organizationName: string): Promise<Organization[]> {
    return await this.organizationRepository.getAll(pageNumber, recordsPerPage, organizationName);
  }

  async getById(organizationId): Promise<any> {
    const user = await this.userRepository.findOne({ organizationId }, { loadEagerRelations: false });
    const organization = await this.organizationRepository.getById(organizationId);
    if (!user || !organization) {
      return undefined;
    }
    const response: any = organization;
    response.user = user;
    return response;
  }
  async update(editOrganizationDto: EditOrganizationDto): Promise<object> {
    if (editOrganizationDto.password.length != 0) {
      if (editOrganizationDto.password.length < 4 || editOrganizationDto.password.length > 100)
        throw new HttpException("Password must be 4-100 character long", HttpStatus.BAD_REQUEST);
    }

    const organizationExistById = await this.organizationRepository.findOne({ id: editOrganizationDto.organizationId });
    if (!organizationExistById) {
      throw new HttpException("This Organization does not exist", HttpStatus.BAD_REQUEST);
    }
    const doesUserExist = await this.userRepository.findOne({ organizationId: editOrganizationDto.organizationId });

    if (!doesUserExist) {
      throw new HttpException("No User belong to this organization", HttpStatus.BAD_REQUEST);
    }
    const organizationExist = await this.organizationRepository.findOneByDomainPrefix(editOrganizationDto.domainPrefix);
    if (organizationExist) {
      if (organizationExist.id != editOrganizationDto.organizationId)
        throw new HttpException("Domain Prefix already in use", HttpStatus.BAD_REQUEST);
    }

    const userExist = await this.userRepository.findOneByEmail(editOrganizationDto.email);

    if (userExist) {
      if (userExist.organizationId != editOrganizationDto.organizationId)
        throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST);
    }

    const dbUser = await this.userRepository.findOne(
      { organizationId: editOrganizationDto.organizationId },
      { loadEagerRelations: false, select: ["id", "email", "password", "salt", "firstName", "lastName", "type"] }
    );

    if (editOrganizationDto.password == "")
      await this.userRepository.update(
        { organizationId: editOrganizationDto.organizationId },
        {
          firstName: editOrganizationDto.firstName,
          lastName: editOrganizationDto.lastName,
          email: editOrganizationDto.email,
          password: dbUser.password,
        }
      );
    else
      await this.userRepository.update(
        { organizationId: editOrganizationDto.organizationId },
        {
          firstName: editOrganizationDto.firstName,
          lastName: editOrganizationDto.lastName,
          email: editOrganizationDto.email,
          password: await this.userRepository.hashPassword(editOrganizationDto.password, dbUser.salt),
        }
      );
    const result = await this.organizationRepository.update(
      { id: editOrganizationDto.organizationId },
      {
        domainPrefix: editOrganizationDto.domainPrefix,
        customDomain: editOrganizationDto.customDomain,
        organizationName: editOrganizationDto.organizationName,
        internalDescription: editOrganizationDto.internalDescription,
        pictureUrl: editOrganizationDto.pictureUrl,
      }
    );
    const org = await this.organizationRepository.findOne({ id: editOrganizationDto.organizationId });
    if (result.affected == 0) return { message: "organization not found" };
    else return org;
  }
  async delete(id: number): Promise<{ message: string }> {
    await this.userRepository.softDelete({ organizationId: id });
    const result = await this.organizationRepository.deleteOrganization(id);
    if (result.affected == 0) return { message: "organization not found" };
    else return { message: "success" };
  }

  async search(organizationName: string): Promise<Organization[]> {
    return await this.organizationRepository.searchOnName(organizationName);
  }
  async updateSettings(settingsDto: any) {
    const organization = await this.organizationRepository.findOne({ id: settingsDto.organizationId });
    // organization.longDescription = settingsDto.longDescription;
    organization.internalDescription = settingsDto.internalDescription;
    organization.pictureUrl = settingsDto.pictureUrl;
    return await organization.save();
  }
  async getSettings(organizationId: any) {
    const organization = await this.organizationRepository.findOne({ id: organizationId });
    return organization;
  }
}
