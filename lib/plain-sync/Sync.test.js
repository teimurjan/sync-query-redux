"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Sync = require("./Sync");

var _Sync2 = _interopRequireDefault(_Sync);

var _Syncer = require("./Syncer");

var _Syncer2 = _interopRequireDefault(_Syncer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTestStore = function getTestStore() {
  return {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn()
  };
};

var getTestHistory = function getTestHistory() {
  return {
    length: 1,
    location: {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    },
    action: "PUSH",
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    listen: jest.fn(),
    block: jest.fn()
  };
};

var getTestSyncer = function getTestSyncer(pathname, options) {
  return new _Syncer2.default(pathname, jest.fn(), jest.fn(), options);
};

describe("Sync test", function () {
  it("should process correctly", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    sync._state.isProcessing = true;

    var cb = jest.fn();
    sync._process(cb);
    expect(cb).toHaveBeenCalled();
    expect(sync._state.isProcessing).toBeFalsy();
  });

  it("should not call onSearchChange is processing", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    sync._state.isProcessing = true;

    var location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    sync._onSearchChange(undefined, location);
    expect(sync._store.dispatch).not.toHaveBeenCalled();
  });

  it("should call onSearchChange", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    var location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "?test=search",
      state: {}
    };
    sync._onSearchChange(undefined, location);
    expect(sync._store.dispatch).toHaveBeenCalled();
  });

  it("should get raw search if parseQuery is false", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    expect(sync._getNewValueFromSearch("?test=search")).toEqual("?test=search");
  });

  it("should get parsed search if parseQuery is true", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname, {
      parseQuery: true
    });
    var sync = new _Sync2.default(store, history, syncer);

    expect(sync._getNewValueFromSearch("test=search")).toEqual({
      test: "search"
    });
  });

  it("should not process state change if it's processing", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    sync._state.isProcessing = true;

    sync._onStateChange();
    expect(sync._syncer.selector).not.toHaveBeenCalled();
  });

  it("should not process state change if pathname not matches", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname + "NOT_MATCHES");
    var sync = new _Sync2.default(store, history, syncer);

    sync._onStateChange();
    expect(sync._syncer.selector).not.toHaveBeenCalled();
  });

  it("should not process state change if seacrh has not been changed", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, _extends({}, history, { location: _extends({}, history.location, { search: "" }) }), syncer);

    sync._onStateChange();
    expect(sync._history.replace).not.toHaveBeenCalled();
    expect(sync._history.push).not.toHaveBeenCalled();
  });

  it("should process state change", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var newSearch = "?new=search";
    syncer.selector = jest.fn().mockReturnValue(newSearch);
    var sync = new _Sync2.default(store, history, syncer);

    sync._onStateChange();
    expect(sync._history.push).toHaveBeenCalledWith({
      pathname: history.location.pathname,
      search: newSearch
    });
  });

  it("should start correctly", function () {
    var store = getTestStore();
    var history = getTestHistory();
    var syncer = getTestSyncer(history.location.pathname);
    var sync = new _Sync2.default(store, history, syncer);

    sync.start();
    expect(sync._history.listen).toHaveBeenCalled();
    expect(sync._store.subscribe).toHaveBeenCalled();

    // relyOn=state
    expect(sync._history.push).toHaveBeenCalled();
  });
});