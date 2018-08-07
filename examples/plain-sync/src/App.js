import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { PLAIN_SYNC_PATH } from ".";
import PlainSyncDemo from "./PlainSyncDemo";
import Main from "./Main";

class App extends Component {
  render() {
    const { PUBLIC_URL } = process.env;
    return (
        <Switch>
          <Route exact path={PUBLIC_URL} component={Main} />
          <Route path={PLAIN_SYNC_PATH} component={PlainSyncDemo} />
        </Switch>
    );
  }
}

export default App;
