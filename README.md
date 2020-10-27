# README

## Install

```
npm install @sterlingfs/store
```

## Usage

Import the store

```
import Store from '@sterlingfs/store'
```

Make a store

```
function reducer((state, { type, payload}) => {
  return { ...state, [type]: payload }
})

const store = Store(reducer)
```

Dispatch to the store

```
store.dispatch({ type: 'fetch', payload: 'awaiting})
```

Subscribe to the store

```
store.subscribe(({type, payload}, state) => {
  // Update view
})
```

## API

```
interface Store<S=any>(reducer: ReducerFunction, initState: S): Store {

  // Replaces the existing state
  pushState(state: S)

  // Sends an action to the store
  dispatch(action: Action)

  // Callback receives last dispatched action and the new state that was returned after the action was reduced
  subscribe(callback: SubscriptionCallback)

  subscribeDispatch(callback: ActionCallback)

  willDispatch(callback: ActionCallback)

}

```

## Types

```
interface Store<S=any>(reducer: ReducerFunction, initState: S): Store {

  pushState(state: S): void;

  dispatch(action: Action): void;

  subscribe(callback: SubscriptionCallback): void;

  subscribeDispatch(callback: ActionCallback): void;

  willDispatch(callback: ActionCallback): void;

}

type Action = { type: string, payload: any };

type ReducerFunction = (state: S, action: Action) => S

```
