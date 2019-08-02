import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { increment, decrement } from "./actions";

class PlainSync extends Component {
  render() {
    const { counter, increment, decrement } = this.props;
    return (
      <div className="container">
        <p className="value">Counter value is: {counter}</p>
        <button onClick={increment}>INCREMENT</button>
        <button onClick={decrement}>DECREMENT</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  counter: state.plainSyncCounter
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      decrement
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlainSync);
