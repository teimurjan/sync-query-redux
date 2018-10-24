"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

var _Syncer = require("./Syncer");

var _Syncer2 = _interopRequireDefault(_Syncer);

var _HistoryListener = require("./HistoryListener");

var _HistoryListener2 = _interopRequireDefault(_HistoryListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sync = function Sync(store, history, syncer) {
  var _this = this;

  _classCallCheck(this, Sync);

  this._onPathnameChange = function (prevLocation, location) {
    _this._lastQueryString = undefined;
  };

  this._onSearchChange = function (prevLocation, location) {
    if ((location.state || {}).ignore) {
      return;
    }
    var newValue = _this._getNewValueFromSearch(location.search.slice(1));
    _this._store.dispatch(_this._syncer.actionCreator(newValue));

    _this._lastQueryString = location.search;
  };

  this._getNewValueFromSearch = function (search) {
    return _this._syncer.options.parseQuery ? _qs2.default.parse(search) : search;
  };

  this._onStateChange = function () {
    if (_this._history.location.pathname !== _this._syncer.pathname) {
      return;
    }

    var q = _this._getNewQueryFromState();
    var next = _this._syncer.options.replaceState ? _this._history.replace : _this._history.push;
    next({
      pathname: _this._history.location.pathname,
      search: q,
      state: { ignore: true }
    });

    _this._lastQueryString = q;
  };

  this._getNewQueryFromState = function () {
    var value = _this._syncer.selector(_this._store.getState());
    return _this._syncer.options.stringifyState ? "?" + _qs2.default.stringify(value) : value;
  };

  this.start = function () {
    var historyListener = new _HistoryListener2.default();
    historyListener.setOnPathnameChange(_this._onPathnameChange);
    historyListener.setOnSearchChange(_this._onSearchChange);

    var stopListeningHistory = _this._history.listen(historyListener.listenTo(_this._syncer.pathname));
    var unsubscribeFromStore = _this._store.subscribe(_this._onStateChange);

    if (_this._syncer.options.relyOn === "location") {
      _this._onSearchChange(undefined, _this._history.location);
    } else {
      _this._onStateChange();
    }

    return function () {
      stopListeningHistory();
      unsubscribeFromStore();
    };
  };

  this._store = store;
  this._history = history;
  this._syncer = syncer;
  this._lastQueryString = undefined;
};

exports.default = Sync;