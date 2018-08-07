"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlePathnameChange = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handlePathnameChange = exports.handlePathnameChange = function handlePathnameChange(newLoc, _ref) {
  var syncState = _ref.syncState,
      syncObjects = _ref.syncObjects;

  if (newLoc.pathname !== syncState.lastPathname) {
    var lastSyncObject = syncObjects[syncState.lastPathname || ""];
    if (lastSyncObject) lastSyncObject.lastQueryString = undefined;
    syncState.lastPathname = newLoc.pathname;
  }
};

var handleHistoryChange = function handleHistoryChange(loc, syncObject, _ref2) {
  var syncState = _ref2.syncState,
      store = _ref2.store;

  syncState.ignoreStateUpdate = true;
  if (loc.search !== syncObject.lastQueryString) {
    var value = syncObject.parseQuery ? _qs2.default.parse(loc.search) : loc.search;
    store.dispatch(syncObject.actionCreator(value));
    syncObject.lastQueryString = loc.search;
  }
  syncState.ignoreStateUpdate = false;
};

var makeHistoryListener = function makeHistoryListener(dependencies) {
  return function (loc) {
    var syncState = dependencies.syncState,
        syncObjects = dependencies.syncObjects;

    handlePathnameChange(loc, dependencies);

    if (loc.state && loc.state.isInvokedByStateSubscriber) return;

    var syncObject = syncObjects[loc.pathname];
    if (!syncObject) return;

    var _syncObject$initialFr = syncObject.initialFrom,
        initialFrom = _syncObject$initialFr === undefined ? "location" : _syncObject$initialFr,
        lastQueryString = syncObject.lastQueryString;


    var isFirstChange = lastQueryString === undefined;
    if (initialFrom === "state" && isFirstChange) {
      handleStateChange(syncObject, dependencies);
    } else {
      handleHistoryChange(loc, syncObject, dependencies);
    }
  };
};

var handleStateChange = function handleStateChange(syncObject, _ref3) {
  var history = _ref3.history,
      store = _ref3.store,
      syncState = _ref3.syncState;

  var state = store.getState();
  var value = syncObject.selector(state);
  var newQueryString = syncObject.stringifyState ? _qs2.default.stringify(value) : value;

  if (newQueryString !== syncObject.lastQueryString) {
    syncObject.lastQueryString = newQueryString;
    var newLocation = "" + location.pathname + newQueryString;
    syncObject.replaceState ? history.replace(newLocation, { isInvokedByStateSubscriber: true }) : history.push(newLocation, { isInvokedByStateSubscriber: true });
  }
};

var makeStoreSubscriber = function makeStoreSubscriber(dependencies) {
  return function () {
    var syncState = dependencies.syncState,
        history = dependencies.history,
        syncObjects = dependencies.syncObjects;

    if (syncState.ignoreStateUpdate) return;

    var syncObject = syncObjects[history.location.pathname];
    if (!syncObject) return;

    var _syncObject$initialFr2 = syncObject.initialFrom,
        initialFrom = _syncObject$initialFr2 === undefined ? "location" : _syncObject$initialFr2,
        lastQueryString = syncObject.lastQueryString;


    var isFirstChange = lastQueryString === undefined;
    if (initialFrom === "location" && isFirstChange) {
      handleHistoryChange(history.location, syncObject, dependencies);
    } else {
      handleStateChange(syncObject, dependencies);
    }
  };
};

var plainSync = function plainSync(store, syncObjects, _ref4) {
  var history = _ref4.history;

  var syncState = {
    ignoreStateUpdate: false,
    lastPathname: history.location.pathname
  };

  var statefulSyncObjects = syncObjects.reduce(function (acc, obj) {
    return _extends({}, acc, _defineProperty({}, obj.pathname, _extends({}, obj, {
      lastQueryString: undefined
    })));
  }, {});

  var dependencies = {
    syncObjects: statefulSyncObjects,
    syncState: syncState,
    store: store,
    history: history
  };

  var historyListener = makeHistoryListener(dependencies);
  var storeSubscriber = makeStoreSubscriber(dependencies);

  var stopListeningHistory = history.listen(historyListener);
  var unsubscribeFromStore = store.subscribe(storeSubscriber);

  storeSubscriber();

  return function () {
    stopListeningHistory();
    unsubscribeFromStore();
  };
};

exports.default = plainSync;