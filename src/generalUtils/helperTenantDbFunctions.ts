export const createHelperQueryBuilder = (repository, request, tableName) => {
  return repository
    .createQueryBuilder(tableName)
    .andWhere(`${tableName}.organizationId =${request.body.organizationId}`);
};

export const helperFindOne = (repository, request, filter) => {
  return repository.findOne({ ...filter, organizationId: request.body.organizationId });
};

export const helperFind = (repository, request, filter) => {
  return repository.find({ ...filter, organizationId: request.body.organizationId });
};

export const helperSave = async (repository, request) => {
  return await repository.create({ organizationId: request.body.organizationId }).save();
};
