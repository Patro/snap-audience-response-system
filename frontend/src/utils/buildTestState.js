import Immutable from 'immutable';

const buildTestState = ({ entities = [], collections = [], jobs = [] }) => (
  Immutable.Map({
    entities: mapEntities(entities),
    collections: mapCollections(collections),
    jobs: mapJobs(jobs),
  })
);

export default buildTestState;

const mapEntities = (entities) => (
  entities.reduce(
    (map, entity) => map.setIn([entity.get('type'), entity.get('id')], entity),
    Immutable.Map()
  )
);

const mapCollections = (collections) => (
  collections.reduce(
    (map, collection) => (
      map.setIn(
        [collection.get('type'), collection.get('filterParams')],
        collection
      )
    ),
    Immutable.Map()
  )
);

const mapJobs = (jobs) => (
  jobs.reduce((map, job) => map.set(job.get('id'), job), Immutable.Map())
)
