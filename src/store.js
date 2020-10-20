"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const INIT_STORE = "INIT_STORE";
class Store {
    constructor(rootReducer, initState) {
        this.rootReducer = rootReducer;
        this.willDispatch$ = new rxjs_1.Subject();
        this.dispatch$ = new rxjs_1.Subject();
        this.pushState$ = new rxjs_1.Subject();
        this.reducer$ = this.dispatch$.pipe(operators_1.filter(({ type }) => type !== INIT_STORE), operators_1.scan(this.rootReducer, {}));
        this.state$ = rxjs_1.merge(this.reducer$, this.pushState$).pipe(operators_1.scan((a, c) => ({ ...a, ...c }), {}));
        this.subscribe$ = rxjs_1.zip(this.dispatch$, this.state$).pipe(operators_1.shareReplay(1));
        this.subscribe$.toPromise().then(() => { });
        this.dispatch$.next({ type: INIT_STORE, payload: initState });
        initState && this.pushState$.next(initState);
    }
    pushState(state) {
        this.pushState$.next(state);
    }
    dispatch(action) {
        this.willDispatch$.next(action);
        this.dispatch$.next(action);
    }
    subscribe(callback) {
        this.subscribe$.subscribe(callback);
    }
    subscribeDispatch(callback) {
        this.dispatch$.subscribe(callback);
    }
    willDispatch(callback) {
        this.willDispatch$.subscribe(callback);
    }
}
exports.Store = Store;
