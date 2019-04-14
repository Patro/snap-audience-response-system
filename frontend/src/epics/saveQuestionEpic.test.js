import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import factories from '../../__factories__';
import { saveQuestion, receiveEntity } from '../actions';
import { SINGLE_CHOICE_QUESTION } from '../constants/entityTypes';
import saveQuestionEpic from './saveQuestionEpic';

class TestWrapper {
  constructor({ action$, state$, entity } = {}) {
    this.action$ = action$;
    this.state$ = state$;
    this.entity = entity;
    this.api = {
      _id: 1,
      entities: {
        create: jest.fn(entity => of({ ...entity, id: '_' + this.api._id++ })),
        destroy: jest.fn(entity => of({ ...entity, deleted: true })),
        update: jest.fn(entity => of(entity)),
      },
    };
    this.history = {
      push: jest.fn(),
    };
  }

  get dependencies() {
    return {
      api: this.api,
      history: this.history,
    };
  }

  call() {
    return saveQuestionEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('joinSessionEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper();
  });

  describe('given new question and options', () => {
    let question, optionA, optionB, relationshipToQuestion;

    beforeEach(() => {
      const session = factories.interactiveSession.entity({ id: 100 });
      question = factories.singleChoiceQuestion.entity({
        relationships: {
          interactiveSession: { id: session.id, type: session.type }
        },
      });
      question.id = undefined;
      optionA = factories.questionOption.entity({ attributes: { text: 'A' } });
      delete optionA.id;
      delete optionA.relationships;
      optionB = factories.questionOption.entity({ attributes: { text: 'B' } });
      delete optionB.id;
      delete optionB.relationships;
      relationshipToQuestion = { type: SINGLE_CHOICE_QUESTION, id: '_1', };

      epic.action$ = of(
        saveQuestion(question, [optionA, optionB], 'jobId')
      );
    });

    it('triggers create request for question', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.create).toBeCalledWith(question);
        done();
      });
    });

    it('triggers create request for option a', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.create).toBeCalledWith({
          ...optionA,
          relationships: { question: relationshipToQuestion },
        });
        done();
      });
    });

    it('triggers create request for option b', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.create).toBeCalledWith({
          ...optionB,
          relationships: { question: relationshipToQuestion },
        });
        done();
      });
    });

    describe('when request succeeds', () => {
      it('redirects to interactive session owner', (done) => {
        const result$ = epic.call();
        result$.subscribe(_actions => {
          expect(epic.history.push).toBeCalledWith('/interactive_sessions/100/owner');
          done();
        });
      });

      it('emits receive entity action for question', (done) => {
        const expectedAction = receiveEntity({ ...question, id: '_1' });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option a', (done) => {
        const expectedAction = receiveEntity({
          ...optionA,
          id: '_2',
          relationships: { question: relationshipToQuestion },
        });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option b', (done) => {
        const expectedAction = receiveEntity({
          ...optionB,
          id: '_3',
          relationships: { question: relationshipToQuestion },
        });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });
    });
  });

  describe('given new option', () => {
    let question, optionA, optionB, relationshipToQuestion;

    beforeEach(() => {
      question = factories.singleChoiceQuestion.entity();
      optionA = factories.questionOption.entity({ attributes: { text: 'A' } });
      delete optionA.id;
      delete optionA.relationships;
      optionB = factories.questionOption.entity({ attributes: { text: 'B' } });
      relationshipToQuestion = { type: question.type, id: question.id, };

      epic.action$ = of(
        saveQuestion(question, [optionA, optionB], 'jobId')
      );
    });

    it('triggers update request for question', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.update).toBeCalledWith(question);
        done();
      });
    });

    it('triggers create request for option a', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.create).toBeCalledWith({
          ...optionA,
          relationships: { question: relationshipToQuestion },
        });
        done();
      });
    });

    it('triggers update request for option b', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.update).toBeCalledWith(optionB);
        done();
      });
    });

    describe('when request succeeds', () => {
      it('emits receive entity action for question', (done) => {
        const expectedAction = receiveEntity(question);

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option a', (done) => {
        const expectedAction = receiveEntity({
          ...optionA,
          id: '_1',
          relationships: { question: relationshipToQuestion },
        });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option b', (done) => {
        const expectedAction = receiveEntity(optionB);

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });
    });
  });

  describe('given question that is marked as deleted', () => {
    let question, optionA;

    beforeEach(() => {
      question = factories.singleChoiceQuestion.entity({ deleted: true });
      optionA = factories.questionOption.entity();

      epic.action$ = of(
        saveQuestion(question, [optionA], 'jobId')
      );
    });

    it('triggers delete request', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.destroy).toBeCalledWith(question);
        done();
      });
    });

    describe('when request succeeds', () => {
      it('emits receive entity action for question', (done) => {
        const expectedAction = receiveEntity(question);

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option a', (done) => {
        const expectedAction = receiveEntity({
          ...optionA,
          deleted: true
        });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });
    });
  });

  describe('given option that is marked as deleted', () => {
    let question, optionA, optionB;

    beforeEach(() => {
      question = factories.singleChoiceQuestion.entity();
      optionA = factories.questionOption.entity({
        attributes: { text: 'A' },
        deleted: true,
      });
      optionB = factories.questionOption.entity({ attributes: { text: 'B' } });

      epic.action$ = of(
        saveQuestion(question, [optionA, optionB], 'jobId')
      );
    });

    it('triggers update request for question', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.update).toBeCalledWith(question);
        done();
      });
    });

    it('triggers delete request for option a', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.destroy).toBeCalledWith(optionA);
        done();
      });
    });

    it('triggers update request for option b', (done) => {
      const result$ = epic.call();
      result$.subscribe(_actions => {
        expect(epic.api.entities.update).toBeCalledWith(optionB);
        done();
      });
    });

    describe('when request succeeds', () => {
      it('emits receive entity action for question', (done) => {
        const expectedAction = receiveEntity(question);

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option a', (done) => {
        const expectedAction = receiveEntity({
          ...optionA,
          deleted: true
        });

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });

      it('emits receive entity action for option b', (done) => {
        const expectedAction = receiveEntity(optionB);

        const result$ = epic.call();
        result$.subscribe(actions => {
          expect(actions).toContainEqual(expectedAction);
          done();
        });
      });
    });
  });
});
