"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateLastPathnameIfNeeded = function updateLastPathnameIfNeeded(newLoc, _ref) {
  var syncState = _ref.syncState;

  if (newLoc.pathname !== syncState.lastPathname) {
    syncState.lastPathname = undefined;
  }
};

var createActionIfNeeded = function createActionIfNeeded(loc, syncObject, _ref2) {
  var syncState = _ref2.syncState,
      store = _ref2.store;

  syncState.ignoreStateUpdate = true;
  if (loc.search !== syncObject.lastSearch) {
    store.dispatch(syncObject.actionCreator(syncObject.parsed ? _queryString2.default.parse(loc.search) : loc.search));
    syncObject.lastSearch = loc.search;
  }
  syncState.ignoreStateUpdate = false;
};

var makeHistoryListener = function makeHistoryListener(dependencies) {
  return function (loc) {
    var syncState = dependencies.syncState,
        syncObjects = dependencies.syncObjects;

    updateLastPathnameIfNeeded(loc, dependencies);
    if (syncState.ignoreLocationUpdate) return;

    syncState.lastPathname = loc.pathname;
    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === loc.pathname;
    });
    if (!syncObject) return;

    createActionIfNeeded(loc, syncObject, dependencies);
  };
};

var updateStateIfNeeded = function updateStateIfNeeded(syncObject, _ref3) {
  var history = _ref3.history,
      store = _ref3.store,
      syncState = _ref3.syncState;

  var state = store.getState();
  var newSearch = syncObject.selector(state);

  if (newSearch !== syncObject.lastSearch) {
    syncObject.lastSearch = newSearch;
    var newLocation = "" + location.pathname + newSearch;
    syncState.ignoreLocationUpdate = true;
    syncObject.replaceState ? history.replace(newLocation) : history.push(newLocation);
    syncState.ignoreLocationUpdate = false;
  }
};

var makeStoreSubscriber = function makeStoreSubscriber(dependencies) {
  return function () {
    var syncState = dependencies.syncState,
        history = dependencies.history,
        syncObjects = dependencies.syncObjects;

    if (syncState.ignoreStateUpdate) return;

    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === history.location.pathname;
    });
    if (!syncObject) return;

    if (syncObject.initialFrom === "location" && syncObject.lastSearch === undefined) return;

    updateStateIfNeeded(syncObject, dependencies);
  };
};

var plainSync = function plainSync(store, syncObjects, _ref4) {
  var history = _ref4.history;

  var syncState = {
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false,
    lastPathname: undefined
  };

  var _syncObjects = syncObjects.map(function (o) {
    return _extends({}, o, { lastSearch: undefined });
  });

  var dependencies = {
    syncObjects: _syncObjects,
    syncState: syncState,
    store: store,
    history: history
  };

  var stopListeningHistory = history.listen(makeHistoryListener(dependencies));

  var unsubscribeFromStore = store.subscribe(makeStoreSubscriber(dependencies));

  return {
    stopListeningHistory: stopListeningHistory,
    unsubscribeFromStore: unsubscribeFromStore
  };
};

exports.default = plainSync;