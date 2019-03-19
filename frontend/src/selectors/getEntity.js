const getEntity = (state, type, id) => {
  const entities = state.entities;
  if (entities === undefined) { return; }

  const entitiesOfType = entities[type];
  if (entitiesOfType === undefined) { return; }

  return entitiesOfType[id];
};

export default getEntity;
