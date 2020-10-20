import { Store } from "../index";

// TODO Check this object for api
// window.__REDUX_DEVTOOLS_EXTENSION__()

enum ActionType {
  initChapter = "initChapter",
  initPage = "initPage",
  getPage = "getPage",
}

type State = {
  appState: {
    status: string;
  };
  moduleA?: { title: string };
};

const initState: State = {
  appState: {
    status: "init",
  },
};

const store = new Store<State>((state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
}, initState);

console.log("Begin logging...");

store.subscribe(([action, state]) => {
  console.group("STATE_CHANGED:");
  console.log("action type:", `${action.type}`);
  console.log("payload:", JSON.stringify(action.payload, null, 2));
  console.log("state:", JSON.stringify(state, null, 2));
  console.log();
  console.groupEnd();
});

const action = {
  type: ActionType.initChapter,
  payload: { status: "init" },
};

store.dispatch(action);

const action1 = {
  type: ActionType.initPage,
  payload: { status: "init" },
};

store.dispatch(action1);

const action2 = {
  type: ActionType.initPage,
  payload: { status: "screwed", pageNumber: 1 },
};

store.dispatch(action2);

const action3 = {
  type: "WRITE_IN",
  payload: { status: "screwed", pageNumber: 1 },
};

store.dispatch(action3);
