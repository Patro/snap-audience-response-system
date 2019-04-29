import { concat } from 'rxjs';
import { zip, of } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { SAVE_QUESTION, receiveEntity } from '../actions';
import { QUESTION, QUESTION_OPTION } from '../constants/entityTypes';
import reloadCollections from './reloadCollections';
import withJob from './withJob';

class SaveQuestionService {
  constructor({ question, options }, { api }) {
    this.question = question;
    this.options = options;
    this.api = api;
  }

  call$() {
    if (this.question.id === undefined) {
      return this.createQuestionWithOptions$();
    }
    else if(this.question.deleted === true) {
      return this.destroyQuestionWithOptions$();
    }
    else {
      return this.updateQuestionWithOptions$();
    }
  }

  createQuestionWithOptions$() {
    return this.createQuestion$().pipe(
      mergeMap(createdQuestion =>
        this.createOptions$(createdQuestion).pipe(
          map(createdOptions => ({
            question: createdQuestion,
            options: createdOptions,
          })),
        )
      ),
    );
  }

  updateQuestionWithOptions$() {
    return zip(
      this.updateQuestion$(),
      this.saveOptions$(),
    ).pipe(
      map(([question, options]) => ({ question, options })),
    );
  }

  destroyQuestionWithOptions$() {
    return zip(
      this.destroyQuestion$(),
      this.destroyOptions$(),
    ).pipe(
      map(([question, options]) => ({ question, options })),
    );
  }

  createQuestion$() {
    return this.api.entities.create(this.question);
  }

  updateQuestion$() {
    return this.api.entities.update(this.question);
  }

  destroyQuestion$() {
    return this.api.entities.destroy(this.question);
  }

  createOptions$(question) {
    return zip(
      ...this.options.map(option => this.createOption$(option, question))
    );
  }

  saveOptions$() {
    return zip(
      ...this.options.map(option => this.saveOption$(option))
    );
  }

  saveOption$(option) {
    if (option.id === undefined) {
      return this.createOption$(option, this.question);
    }
    else if(option.deleted === true) {
      return this.destroyOption$(option);
    }
    else {
      return this.updateOption$(option);
    }
  }

  destroyOptions$() {
    return zip(
      ...this.options.map(option => this.destroyOption$(option))
    );
  }

  createOption$(option, question) {
    return this.api.entities.create({
      ...option,
      relationships: {
        question: {
          type: question.type,
          id: question.id,
        },
      },
    })
  }

  updateOption$(option) {
    return this.api.entities.update(option)
  }

  destroyOption$(option) {
    return this.api.entities.destroy(option)
  }
}

const saveQuestionEpic = (action$, state$, dependencies) => (
  action$.pipe(
    filter(action => action.type === SAVE_QUESTION),
    mergeMap(action => processAction$(action, state$, dependencies)),
  )
)

export default saveQuestionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    saveQuestion$(action, dependencies),
    onSuccess(state$, dependencies)
  )
);

const saveQuestion$ = (action, dependencies) => (
  new SaveQuestionService(action, dependencies).call$()
);

const onSuccess = (state$, dependencies) => (
  mergeMap(({ question, options }) =>
    concat(
      of(receiveEntity(question)),
      ...options.map(option => of(receiveEntity(option))),
      reloadCollections(state$, QUESTION, dependencies),
      reloadCollections(state$, QUESTION_OPTION, dependencies),
      of(question).pipe(
        tap(question => redirectToQuestionList(question, dependencies.history)),
      )
    )
  )
);

const redirectToQuestionList = (question, history) => (
  history.push(buildQuestionListUrl(question.relationships.interactiveSession))
);

const buildQuestionListUrl = (session) => (
  `/interactive_sessions/${session.id}/owner`
);
