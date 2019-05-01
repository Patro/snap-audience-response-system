import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { updateEntity, receiveEntity } from '../actions';
import updateEntityEpic from './updateEntityEpic';

class TestWrapper {
  constructor({ action$ }) {
    this.action$ = action$;
    this.state$ = of({});
    this.api = {
      entities: {
        update: jest.fn(entity => of(entity)),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return updateEntityEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('updateEntityEpic', () => {
  let entity, epic;

  beforeEach(() => {
    entity = { id: '100', type: 'SPACESHIP' };
    epic = new TestWrapper({
      action$: of(
        updateEntity(entity)
      )
    });
  });

  it('triggers update request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      expect(epic.api.entities.update).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity(entity);

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
