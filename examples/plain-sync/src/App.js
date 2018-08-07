import React, { Component } from "react";
import { Route } from "react-router-dom";
import { PLAIN_SYNC_PATH } from ".";
import PlainSyncDemo from "./PlainSyncDemo";
import Main from "./Main";

class App extends Component {
  render() {
    return (
        <div>
          <Route exact path="/" component={Main} />
          <Route path={PLAIN_SYNC_PATH} component={PlainSyncDemo} />
        </div>
    );
  }
}

export default App;
