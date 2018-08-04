"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateLastPathnameIfNeeded = function updateLastPathnameIfNeeded(newLoc, _ref) {
  var syncState = _ref.syncState,
      updateState = _ref.updateState;

  if (newLoc.pathname !== syncState.lastPathname) {
    updateState({ lastPathname: undefined });
  }
};

var findSyncObject = function findSyncObject(loc, _ref2) {
  var syncObjects = _ref2.syncObjects;

  var syncObject = syncObjects.find(function (obj) {
    return obj.pathname === loc.pathname;
  });
  if (!syncObject) return;
  syncObject.lastSearch = loc.search;
  return syncObject;
};

var createActionIfNeeded = function createActionIfNeeded(loc, syncObject, _ref3) {
  var updateState = _ref3.updateState,
      store = _ref3.store;

  updateState({ ignoreStateUpdate: true });
  if (loc.search !== syncObject.lastSearch) {
    store.dispatch(syncObject.actionCreator(syncObject.parsed ? _queryString2.default.parse(loc.search) : loc.search));
  }
  updateState({ ignoreStateUpdate: false });
};

var makeHistoryListener = function makeHistoryListener(dependencies) {
  return function (loc) {
    var syncState = dependencies.syncState,
        updateState = dependencies.updateState;

    updateLastPathnameIfNeeded(loc, dependencies);
    if (syncState.ignoreLocationUpdate) return;

    updateState({ lastPathname: loc.pathname });
    var syncObject = findSyncObject(loc, dependencies);
    if (!syncObject) return;

    createActionIfNeeded(loc, syncObject, dependencies);
  };
};

var updateStateIfNeeded = function updateStateIfNeeded(syncObject, _ref4) {
  var history = _ref4.history,
      store = _ref4.store,
      updateState = _ref4.updateState;

  var state = store.getState();
  var newSearch = syncObject.selector(state);

  if (newSearch !== syncObject.lastSearch) {
    syncObject.lastSearch = newSearch;
    var newLocation = location.pathname + "?" + newSearch;
    updateState({ ignoreLocationUpdate: true });
    syncObject.replaceState ? history.replace(newLocation) : history.push(newLocation);
    updateState({ ignoreLocationUpdate: false });
  }
};

var makeStoreSubscriber = function makeStoreSubscriber(dependencies) {
  return function () {
    var syncState = dependencies.syncState,
        history = dependencies.history;

    if (syncState.ignoreStateUpdate) return;

    var syncObject = findSyncObject(history.location, dependencies);
    if (!syncObject) return;

    if (syncObject.initialFrom === "location" && syncObject.lastSearch === undefined) return;

    updateStateIfNeeded(syncObject, dependencies);
  };
};

var plainSync = function plainSync(store, syncObjects, _ref5) {
  var history = _ref5.history;

  var syncState = {
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false,
    lastPathname: undefined
  };

  var _syncObjects = syncObjects.map(function (o) {
    return _extends({}, o, { lastSearch: undefined });
  });

  var updateState = function updateState(property) {
    syncState = _extends({}, syncState, property);
  };

  var dependencies = {
    syncObjects: _syncObjects,
    syncState: syncState,
    store: store,
    history: history,
    updateState: updateState
  };

  var stopListeningHistory = history.listen(makeHistoryListener(dependencies));

  var unsubscribeFromStore = store.subscribe(makeStoreSubscriber(dependencies));

  return {
    stopListeningHistory: stopListeningHistory,
    unsubscribeFromStore: unsubscribeFromStore
  };
};

exports.default = plainSync;