import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import Immutable from 'immutable';
import { receiveCollection } from '../actions';
import buildTestState from '../utils/buildTestState';
import reloadCollections from './reloadCollections';

class TestWrapper {
  constructor({ state$, type } = {}) {
    this.state$ = state$;
    this.type = type;
    this.api = {
      collections: {
        fetch: jest.fn(collection =>
          of(collection.set('entities', Immutable.List()))
        ),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return reloadCollections(this.state$, this.type, this.dependencies)
             .pipe(toArray());
  }
}

describe('reloadCollections', () => {
  let reloadCollections;

  beforeEach(() => {
    reloadCollections = new TestWrapper({ type: 'SPACESHIP' });
  });

  describe('given state with collections', () => {
    beforeEach(() => {
      const collectionA = Immutable.fromJS({
        type: 'SPACESHIP',
        filterParams: { fuel: 'hydrogen' },
        entities: [101],
      });
      const collectionB = Immutable.fromJS({
        type: 'SPACESHIP',
        filterParams: { fuel: 'antimatter' },
        entities: [102],
      });
      const collectionC = Immutable.fromJS({
        type: 'CAR',
        filterParams: { fuel: 'gas' },
        entities: [301],
      });
      reloadCollections.state$ = of(buildTestState({
        collections: [collectionA, collectionB, collectionC]
      }));
    });

    it('triggers fetch requests', (done) => {
      const result$ = reloadCollections.call$();
      result$.subscribe((_actions) => {
        expect(reloadCollections.api.collections.fetch).toBeCalledWith(
          Immutable.fromJS({
            type: 'SPACESHIP',
            filterParams: { fuel: 'hydrogen' },
          })
        );
        expect(reloadCollections.api.collections.fetch).toBeCalledWith(
          Immutable.fromJS({
            type: 'SPACESHIP',
            filterParams: { fuel: 'antimatter' },
          })
        );
        done();
      });
    });

    it('emits receive collection actions', (done) => {
      const expectedActionA = receiveCollection({
        type: 'SPACESHIP', filterParams: { fuel: 'hydrogen' }, entities: [],
      }, expect.anything());
      const expectedActionB = receiveCollection({
        type: 'SPACESHIP', filterParams: { fuel: 'antimatter' }, entities: [],
      }, expect.anything());

      const result$ = reloadCollections.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedActionA);
        expect(actions).toContainEqual(expectedActionB);
        done();
      });
    });
  });

  describe('given state with collections of root types', () => {
    beforeEach(() => {
      reloadCollections.api.config = {
        ROOT_TYPE_MAP: {
          SPACESHIP: 'SHIP',
        },
      };

      const collection = Immutable.fromJS({
        type: 'SHIP',
        filterParams: {},
        entities: [101],
      });
      reloadCollections.state$ = of(buildTestState({
        collections: [collection]
      }));
    });

    it('triggers fetch requests', (done) => {
      const result$ = reloadCollections.call$();
      result$.subscribe((_actions) => {
        expect(reloadCollections.api.collections.fetch).toBeCalledWith(
          Immutable.fromJS({
            type: 'SHIP',
            filterParams: {},
          })
        );
        done();
      });
    });

    it('emits receive collection actions', (done) => {
      const expectedAction = receiveCollection({
        type: 'SHIP', filterParams: {}, entities: [],
      }, expect.anything());

      const result$ = reloadCollections.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });

  describe('given empty state', () => {
    beforeEach(() => {
      reloadCollections.state$ = of(Immutable.Map());
    });

    it('emits nothing', (done) => {
      const result$ = reloadCollections.call$();
      result$.subscribe(actions => {
        expect(actions).toHaveLength(0);
        done();
      });
    });
  });
});
