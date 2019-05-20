import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { destroyEntity, receiveEntity } from '../actions';
import destroyEntityEpic from './destroyEntityEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      entities: {
        destroy: jest.fn(entity => of(entity.set('deleted', true))),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return destroyEntityEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('destroyEntityEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        destroyEntity({ id: '100', type: 'SPACESHIP' })
      )
    });
  });

  it('triggers destroy request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      const entity = Immutable.fromJS({ id: '100', type: 'SPACESHIP' });
      expect(epic.api.entities.destroy).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({
        id: '100',
        type: 'SPACESHIP',
        deleted: true,
      });

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
