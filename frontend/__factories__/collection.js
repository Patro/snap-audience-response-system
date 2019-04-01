export const withEntities = (given) => ({
  entities: given.map((entity) => ({
    type: entity.type,
    id: entity.id,
  })),
});

export default { withEntities };
