import { Subject, merge, zip } from "rxjs";
import { Action } from "./interfaces/action";

import { filter, scan, shareReplay } from "rxjs/operators";

export type ActionCallback = (action: Action) => void;
export type Context<S> = { action: Action; state: S };
export type SubscriptionCallback = <S>(context: Context<S>) => void;

export interface Store<S> {
  pushState(state: S): void;

  dispatch(action: Action): void;

  subscribe(callback: SubscriptionCallback): void;

  subscribeDispatch(callback: ActionCallback): void;

  willDispatch(callback: ActionCallback): void;
}

export function Store<S = any>(
  rootReducer: (state: S, action: Action) => S,
  initState?: S
): Store<S> {
  const INIT_STORE = "INIT_STORE";

  const willDispatch$ = new Subject<Action>();
  const dispatch$ = new Subject<Action>();
  const pushState$ = new Subject<S>();
  const reducer$ = dispatch$.pipe(
    filter(({ type }) => type !== INIT_STORE),
    scan(rootReducer, {} as S)
  );

  const state$ = merge(reducer$, pushState$).pipe(
    scan((a, c) => ({ ...a, ...c }), {})
  );

  const subscribe$ = zip(dispatch$, state$, (action, state) => ({
    action,
    state,
  })).pipe(shareReplay(1));

  subscribe$.toPromise().then(() => {});
  dispatch$.next({ type: INIT_STORE, payload: initState });
  initState && pushState$.next(initState);

  // Interface
  function pushState(state: S) {
    pushState$.next(state);
  }

  function dispatch(action: Action) {
    willDispatch$.next(action);
    dispatch$.next(action);
  }

  function subscribe(callback: SubscriptionCallback) {
    subscribe$.subscribe(callback);
  }

  function subscribeDispatch(callback: ActionCallback) {
    dispatch$.subscribe(callback);
  }

  function willDispatch(callback: ActionCallback) {
    willDispatch$.subscribe(callback);
  }

  return { pushState, dispatch, subscribe, subscribeDispatch, willDispatch };
}
