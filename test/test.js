"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
// TODO Check this object for api
// window.__REDUX_DEVTOOLS_EXTENSION__()
var ActionType;
(function (ActionType) {
    ActionType["initChapter"] = "initChapter";
    ActionType["initPage"] = "initPage";
    ActionType["getPage"] = "getPage";
})(ActionType || (ActionType = {}));
const initState = {
    appState: {
        status: "init",
    },
};
const store = new index_1.Store((state, action) => {
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
