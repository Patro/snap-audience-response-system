import { zip, merge, of } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { SAVE_QUESTION, receiveEntity } from '../actions';
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

const saveQuestionEpic = (action$, _, dependencies) => (
  action$.pipe(
    filter(action => action.type === SAVE_QUESTION),
    mergeMap(action => processAction(action, dependencies))
  )
)

export default saveQuestionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    saveQuestionAndRedirect$(action, dependencies),
    mergeMap(result => merge(
      of(receiveEntity(result.question)),
      ...result.options.map(option => of(receiveEntity(option)))
    ))
  )
);

const saveQuestionAndRedirect$ = (action, dependencies) => (
  new SaveQuestionService(action, dependencies).call$().pipe(
    tap(({ question }) =>
      redirectToSessionOwner(question, dependencies.history)
    )
  )
);

const redirectToSessionOwner = (question, history) => (
  history.push(buildSessionOwnerUrl(question.relationships.interactiveSession))
);

const buildSessionOwnerUrl = (session) => (
  `/interactive_sessions/${session.id}/owner`
);
