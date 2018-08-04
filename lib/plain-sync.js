"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plainSync = function plainSync(store, syncObjects, _ref) {
  var history = _ref.history;

  var lastSearch = void 0,
      ignoreLocationUpdate = void 0,
      ignoreStateUpdate = void 0;

  var stopListeningHistory = history.listen(function (loc) {
    if (ignoreLocationUpdate) return;

    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === loc.pathname;
    });
    if (!syncObject) return;

    lastSearch = loc.search;

    ignoreStateUpdate = true;
    store.dispatch(syncObject.actionCreator(syncObject.parsed ? _queryString2.default.parse(loc.search) : loc.search));
    ignoreStateUpdate = false;
  });

  var unsubscribeFromStore = store.subscribe(function () {
    if (ignoreStateUpdate) return;

    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === history.location.pathname;
    });

    if (!syncObject) return;

    var state = store.getState();
    var newSearch = syncObject.selector(state);
    if (newSearch !== lastSearch) {
      var newLocation = location.pathname + "?" + newSearch;
      ignoreLocationUpdate = true;
      syncObject.replaceState ? history.replace(newLocation) : history.push(newLocation);
      ignoreLocationUpdate = false;
    }
  });

  return {
    stopListeningHistory: stopListeningHistory,
    unsubscribeFromStore: unsubscribeFromStore
  };
};
exports.default = plainSync;