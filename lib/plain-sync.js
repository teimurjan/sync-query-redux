"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

var _createBrowserHistory = require("history/createBrowserHistory");

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

require("redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plainSync = function plainSync(store, syncObjects, _ref) {
  var _ref$history = _ref.history,
      history = _ref$history === undefined ? (0, _createBrowserHistory2.default)() : _ref$history;

  var lastSearch = void 0;

  var stopListeningHistory = history.listen(function (loc) {
    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === loc.pathname;
    });
    if (!syncObject) return;

    store.dispatch(syncObject.actionCreator(syncObject.parsed ? _queryString2.default.parse(loc.search) : loc.search));

    lastSearch = loc.search;
  });

  var unsubscribeFromStore = store.subscribe(function () {
    var syncObject = syncObjects.find(function (obj) {
      return obj.pathname === history.location.pathname;
    });

    if (!syncObject) return;

    var state = store.getState();
    var newSearch = syncObject.selector(state);
    if (newSearch !== lastSearch) {
      var newLocation = location.pathname + "?" + newSearch;
      syncObject.replaceState ? history.replace(newLocation) : history.push(newLocation);
    }
  });

  return {
    stopListeningHistory: stopListeningHistory,
    unsubscribeFromStore: unsubscribeFromStore
  };
};
exports.default = plainSync;