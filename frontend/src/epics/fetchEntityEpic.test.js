import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { fetchEntity, receiveEntity } from '../actions';
import fetchEntityEpic from './fetchEntityEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      entities: {
        fetch: jest.fn(entity => of(entity.set('attributes', Immutable.Map()))),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return fetchEntityEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('fetchEntityEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        fetchEntity('SPACESHIP', '100')
      )
    });
  });

  it('triggers fetch request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      const entity = Immutable.fromJS({ type: 'SPACESHIP', id: '100' });
      expect(epic.api.entities.fetch).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({
        type: 'SPACESHIP', id: '100', attributes: {},
      });

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
