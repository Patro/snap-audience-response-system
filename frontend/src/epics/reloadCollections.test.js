import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { receiveCollection } from '../actions';
import reloadCollections from './reloadCollections';

class TestWrapper {
  constructor({ state$, type } = {}) {
    this.state$ = state$;
    this.type = type;
    this.api = {
      collections: {
        fetch: jest.fn(collection => of(collection)),
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
      const collectionA = {
        type: 'SPACESHIP',
        filterParams: { fuel: 'hydrogen' },
        entities: [101],
      };
      const collectionB = {
        type: 'SPACESHIP',
        filterParams: { fuel: 'antimatter' },
        entities: [102],
      };
      const collectionC = {
        type: 'CAR',
        filterParams: { fuel: 'gas' },
        entities: [301],
      };
      reloadCollections.state$ = of({
        collections: {
          SPACESHIP: {
            '{"fuel":"hydrogen"}': collectionA,
            '{"fuel":"antimatter"}': collectionB,
          },
          CAR: {
            '{"fuel":"gas"}': collectionC,
          },
        },
      });
    });

    it('triggers fetch requests', (done) => {
      const result$ = reloadCollections.call$();
      result$.subscribe((_actions) => {
        expect(reloadCollections.api.collections.fetch).toBeCalledWith({
          type: 'SPACESHIP', filterParams: { fuel: 'hydrogen' },
        });
        expect(reloadCollections.api.collections.fetch).toBeCalledWith({
          type: 'SPACESHIP', filterParams: { fuel: 'antimatter' },
        });
        done();
      });
    });

    it('emits receive collection actions', (done) => {
      const expectedActionA = receiveCollection({
        type: 'SPACESHIP', filterParams: { fuel: 'hydrogen' },
      }, expect.anything());
      const expectedActionB = receiveCollection({
        type: 'SPACESHIP', filterParams: { fuel: 'antimatter' },
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

      const collection = {
        type: 'SHIP',
        filterParams: {},
        entities: [101],
      };
      reloadCollections.state$ = of({
        collections: {
          SHIP: { '{}': collection },
        },
      });
    });

    it('triggers fetch requests', (done) => {
      const result$ = reloadCollections.call$();
      result$.subscribe((_actions) => {
        expect(reloadCollections.api.collections.fetch).toBeCalledWith({
          type: 'SHIP', filterParams: {},
        });
        done();
      });
    });

    it('emits receive collection actions', (done) => {
      const expectedAction = receiveCollection({
        type: 'SHIP', filterParams: {},
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
      reloadCollections.state$ = of({});
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
