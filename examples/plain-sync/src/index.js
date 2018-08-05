import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { plainSync } from "sync-query-redux";
import createHistory from "history/createBrowserHistory";
import App from "./App";
import { setCounter } from "./actions";
import { counter } from "./reducer";
import "./index.css";

const history = createHistory();

const loggerMiddleware = createLogger({
  level: "info",
  duration: true,
  collapsed: true
});

const store = createStore(counter, applyMiddleware(loggerMiddleware));

plainSync(
  store,
  [
    {
      pathname: "/all",
      actionCreator: setCounter,
      selector: state => `?counter=${state}`,
      parsed: true
    }
  ],
  {
    history
  }
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
