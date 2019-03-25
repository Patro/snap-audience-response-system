import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import snakeCase from 'lodash/snakeCase';
import deepMapKeys from './deepMapKeys';

const buildBody = ({ id, type, attributes, relationships }) => {
  const data = {};
  if (id !== undefined) {
    data.id = id;
  }
  if (type !== undefined) {
    data.type = snakeCase(type);
  }
  if (attributes !== undefined) {
    data.attributes = buildAttributes(attributes);
  }
  if (relationships !== undefined) {
    data.relationships = buildRelationships(relationships);
  }
  return { data };
};
export default buildBody;

const buildAttributes = (attributes) => (
  deepMapKeys(attributes, snakeCase)
);

const buildRelationships = (relationships) => {
  const keys = Object.keys(relationships);
  const mapped = {};
  keys.forEach(key => {
    const relationship = relationships[key];
    mapped[snakeCase(key)] = {
      data: buildRelationship(relationship),
    };
  });
  return mapped;
};

const buildRelationship = (relationship) => {
  if (isArray(relationship)) {
    return relationship.map(buildResourceIdentifier);
  }
  else if (isObject(relationship)) {
    return buildResourceIdentifier(relationship);
  }
};

const buildResourceIdentifier = (entityIdentifier) => ({
  id: entityIdentifier.id,
  type: snakeCase(entityIdentifier.type),
});
