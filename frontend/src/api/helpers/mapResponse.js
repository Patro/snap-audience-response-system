import Immutable from 'immutable';
import camelCase from 'lodash/camelCase';
import toUpper from 'lodash/toUpper';
import deepMapKeys from './deepMapKeys';

const mapResponse = (response) => {
  const data = response.get('data');
  if (data === undefined) { return; }

  return Immutable.isList(data) ? mapToCollection(data) : mapToEntity(data);
};
export default mapResponse;

const mapToCollection = (resourceObjects) => (
  Immutable.Map({
    entities: resourceObjects.map(mapToEntity)
  })
);

const mapToEntity = (resourceObject) => {
  let entity = Immutable.Map();

  const id = resourceObject.get('id');
  if (id !== undefined) {
    entity = entity.set('id', id);
  }

  const type = resourceObject.get('type');
  if (type !== undefined) {
    entity = entity.set('type', toUpper(type));
  }

  const attributes = resourceObject.get('attributes');
  if (attributes !== undefined) {
    entity = entity.set('attributes', mapAttributes(attributes));
  }

  const relationships = resourceObject.get('relationships');
  if (relationships !== undefined) {
    entity = entity.set('relationships', mapRelationships(relationships));
  }

  return entity;
};

const mapAttributes = (attributes) => (
  deepMapKeys(attributes, camelCase)
);

const mapRelationships = (relationships) => (
  relationships.mapEntries(([ key, relationship ]) => (
    [ camelCase(key), mapRelationship(relationship) ]
  ))
);

const mapRelationship = (relationship) => {
  const data = relationship.get('data');
  if (Immutable.isList(data)) {
    return data.map(mapResourceIdentifier);
  }
  else if (Immutable.isMap(data)) {
    return mapResourceIdentifier(data);
  }
};

const mapResourceIdentifier = (resourceIdentifer) => (
  Immutable.Map({
    id: resourceIdentifer.get('id'),
    type: toUpper(resourceIdentifer.get('type')),
  })
);
