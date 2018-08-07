import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PLAIN_SYNC_PATH } from ".";

class Main extends Component {
  render() {
    return (
      <ul className="main-router">
        <li>
          <Link to={PLAIN_SYNC_PATH}>Plain Sync Demo</Link>
        </li>
      </ul>
    );
  }
}

export default Main;
