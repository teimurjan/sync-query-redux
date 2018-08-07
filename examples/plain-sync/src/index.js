import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { plainSync } from "sync-query-redux";
import createHistory from "history/createBrowserHistory";
import App from "./App";
import { setCounter } from "./PlainSyncDemo/actions";
import { rootReducer } from "./reducer";
import "./index.css";

const history = createHistory();

const loggerMiddleware = createLogger({
  level: "info",
  duration: true,
  collapsed: true
});

const store = createStore(rootReducer, applyMiddleware(loggerMiddleware));

export const PLAIN_SYNC_PATH = `${process.env.PUBLIC_URL}/plain-sync`;

plainSync(
  store,
  [
    {
      pathname: PLAIN_SYNC_PATH,
      actionCreator: setCounter,
      selector: state => ({ counter: state.plainSyncCounter }),
      parseQuery: true,
      stringifyState: true,
      initialFrom: "state",
      replaceState: true
    }
  ],
  {
    history
  }
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
