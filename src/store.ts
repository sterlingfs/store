import { Subject, merge, zip } from "rxjs";
import { Action } from "./interfaces/action";

import { filter, scan, shareReplay, tap } from "rxjs/operators";

export type ActionCallback = (action: Action) => void;
export type SubscriptionCallback = <T>(
  context: [action: Action, state: T]
) => void;

const INIT_STORE = "INIT_STORE";

export class Store<T> {
  private readonly willDispatch$ = new Subject<Action>();
  private readonly dispatch$ = new Subject<Action>();

  private readonly pushState$ = new Subject<T>();

  private readonly reducer$ = this.dispatch$.pipe(
    filter(({ type }) => type !== INIT_STORE),
    scan(this.rootReducer, {} as T)
  );

  private state$ = merge(this.reducer$, this.pushState$).pipe(
    scan((a, c) => ({ ...a, ...c }), {})
  );

  private readonly subscribe$ = zip(this.dispatch$, this.state$).pipe(
    shareReplay(1)
  );

  constructor(
    private readonly rootReducer: (state: T, action: Action) => T,
    initState?: T
  ) {
    this.subscribe$.toPromise().then(() => {});
    this.dispatch$.next({ type: INIT_STORE, payload: initState });
    initState && this.pushState$.next(initState);
  }

  public pushState(state: T) {
    this.pushState$.next(state);
  }

  public dispatch(action: Action) {
    this.willDispatch$.next(action);
    this.dispatch$.next(action);
  }

  public subscribe(callback: SubscriptionCallback) {
    this.subscribe$.subscribe(callback);
  }

  public subscribeDispatch(callback: ActionCallback) {
    this.dispatch$.subscribe(callback);
  }

  public willDispatch(callback: ActionCallback) {
    this.willDispatch$.subscribe(callback);
  }
}
