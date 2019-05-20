import Immutable from 'immutable';
import snakeCase from 'lodash/snakeCase';
import deepMapKeys from './deepMapKeys';

const buildBody = (entity) => {
  let data = Immutable.Map();

  const id = entity.get('id');
  if (id !== undefined) {
    data = data.set('id', id);
  }

  const type = entity.get('type');
  if (type !== undefined) {
    data = data.set('type', snakeCase(type));
  }

  const attributes = entity.get('attributes');
  if (attributes !== undefined) {
    data = data.set('attributes', buildAttributes(attributes));
  }

  const relationships = entity.get('relationships');
  if (relationships !== undefined) {
    data = data.set('relationships', buildRelationships(relationships));
  }

  return Immutable.Map({ data });
};
export default buildBody;

const buildAttributes = (attributes) => (
  deepMapKeys(attributes, snakeCase)
);

const buildRelationships = (relationships) => (
  relationships.mapEntries(([ key, relationship ]) => (
    [
      snakeCase(key),
      Immutable.Map({ data: buildRelationship(relationship) })
    ]
  ))
);

const buildRelationship = (relationship) => {
  if (Immutable.isList(relationship)) {
    return relationship.map(buildResourceIdentifier);
  }
  else if (Immutable.isMap(relationship)) {
    return buildResourceIdentifier(relationship);
  }
};

const buildResourceIdentifier = (entityIdentifier) => (
  Immutable.Map({
    id: entityIdentifier.get('id'),
    type: snakeCase(entityIdentifier.get('type')),
  })
);
