"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plainSync = function plainSync(store, syncObjects, _ref) {
  var history = _ref.history;

  var syncState = {
    lastSearch: undefined,
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false
  };

  var stopListeningHistory = history.listen(function (loc) {
    if (syncState.ignoreLocationUpdate) return;

    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === loc.pathname;
    });
    if (!syncObject) return;

    syncState.lastSearch = loc.search;

    syncState.ignoreStateUpdate = true;
    store.dispatch(syncObject.actionCreator(syncObject.parsed ? _queryString2.default.parse(loc.search) : loc.search));
    syncState.ignoreStateUpdate = false;
  });

  var unsubscribeFromStore = store.subscribe(function () {
    if (syncState.ignoreStateUpdate) return;

    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === history.location.pathname;
    });

    if (!syncObject) return;

    var state = store.getState();
    var newSearch = syncObject.selector(state);
    if (newSearch !== syncState.lastSearch) {
      syncState.lastSearch = newSearch;
      var newLocation = location.pathname + "?" + newSearch;
      syncState.ignoreLocationUpdate = true;
      syncObject.replaceState ? history.replace(newLocation) : history.push(newLocation);
      syncState.ignoreLocationUpdate = false;
    }
  });

  return {
    stopListeningHistory: stopListeningHistory,
    unsubscribeFromStore: unsubscribeFromStore
  };
};
exports.default = plainSync;