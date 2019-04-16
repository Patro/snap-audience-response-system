import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { destroyEntity, receiveEntity } from '../actions';
import destroyEntityEpic from './destroyEntityEpic';

class TestWrapper {
  constructor({ action$, state$ } = {}) {
    this.action$ = action$;
    this.state$ = state$;
    this.api = {
      entities: {
        destroy: jest.fn(entity => of({ ...entity, deleted: true })),
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
  let entity, epic;

  beforeEach(() => {
    entity = { id: 100, type: 'SPACESHIP' };
    epic = new TestWrapper({
      action$: of(
        destroyEntity(entity)
      )
    });
  });

  it('triggers destroy request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      expect(epic.api.entities.destroy).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({
        ...entity,
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
