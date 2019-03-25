import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import toUpper from 'lodash/toUpper';
import deepMapKeys from './deepMapKeys';

const mapResponse = (response) => {
  const data = response.data;
  if (data === undefined) { return; }

  return isArray(data) ? mapToCollection(data) : mapToEntity(data);
};
export default mapResponse;

const mapToCollection = (resourceObjects) => ({
  entities: resourceObjects.map(mapToEntity)
});

const mapToEntity = (resourceObject) => {
  const entity = {};
  const id = resourceObject.id;
  if (id !== undefined) {
    entity.id = id;
  }
  const type = resourceObject.type;
  if (type !== undefined) {
    entity.type = toUpper(type);
  }
  const attributes = resourceObject.attributes;
  if (attributes !== undefined) {
    entity.attributes = mapAttributes(attributes);
  }
  const relationships = resourceObject.relationships;
  if (relationships !== undefined) {
    entity.relationships = mapRelationships(relationships);
  }
  return entity;
};

const mapAttributes = (attributes) => (
  deepMapKeys(attributes, camelCase)
);

const mapRelationships = (relationships) => {
  const keys = Object.keys(relationships);
  const mapped = {};
  keys.forEach(key => {
    const relationship = relationships[key];
    mapped[camelCase(key)] = mapRelationship(relationship);
  });
  return mapped;
};

const mapRelationship = (relationship) => {
  if (isArray(relationship.data)) {
    return relationship.data.map(mapResourceIdentifier);
  }
  else if (isObject(relationship.data)) {
    return mapResourceIdentifier(relationship.data);
  }
};

const mapResourceIdentifier = (resourceIdentifer) => ({
  id: resourceIdentifer.id,
  type: toUpper(resourceIdentifer.type),
});
