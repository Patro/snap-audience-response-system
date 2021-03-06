import Immutable from 'immutable'
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { respondToPoll, receiveEntity } from '../actions';
import { RESPONSE, QUESTION_OPTION } from '../constants/entityTypes'
import respondToPollEpic from './respondToPollEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      _id: 1,
      entities: {
        create: jest.fn(entity =>
          of(entity.set('id', '_' + this.api._id++))
        ),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return respondToPollEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('respondToPollEpic', () => {
  let epic, expectedResponseA, expectedResponseB;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        respondToPoll({ id: '100', type: 'POLL' }, ['600', '601'])
      )
    });

    expectedResponseA = Immutable.fromJS({
      type: RESPONSE,
      relationships: {
        poll: { id: '100', type: 'POLL' },
        pickedQuestionOption: { id: '600', type: QUESTION_OPTION },
      },
    });

    expectedResponseB = Immutable.fromJS({
      type: RESPONSE,
      relationships: {
        poll: { id: '100', type: 'POLL' },
        pickedQuestionOption: { id: '601', type: QUESTION_OPTION },
      },
    });
  });

  it('triggers create request for every given option id', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      expect(epic.api.entities.create).toBeCalledWith(expectedResponseA);
      expect(epic.api.entities.create).toBeCalledWith(expectedResponseB);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedActionA = receiveEntity(
        expectedResponseA.set('id', '_1')
      );
      const expectedActionB = receiveEntity(
        expectedResponseB.set('id', '_2')
      );

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedActionA);
        expect(actions).toContainEqual(expectedActionB);
        done();
      });
    });
  });
});
