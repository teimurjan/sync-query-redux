"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

var _Syncer = require("./Syncer");

var _Syncer2 = _interopRequireDefault(_Syncer);

var _HistoryListener = require("./HistoryListener");

var _HistoryListener2 = _interopRequireDefault(_HistoryListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sync = function () {
  function Sync(store, history, syncer) {
    _classCallCheck(this, Sync);

    this._store = store;
    this._history = history;
    this._syncer = syncer;
    this._lastQueryString = undefined;
    this.sync.bind(this);
  }

  _createClass(Sync, [{
    key: "_onPathnameChange",
    value: function _onPathnameChange(prevLocation, location) {
      this._lastQueryString = undefined;
    }
  }, {
    key: "_onSearchChange",
    value: function _onSearchChange(prevLocation, location) {
      var isFirstChange = this._lastQueryString === undefined;
      var shouldStartFromState = isFirstChange && this._syncer.options.relyOn === "state";
      if (shouldStartFromState || location.state.ignore) {
        return;
      }

      var q = this._syncer.options.parseQuery ? _qs2.default.parse(location.search) : location.search;
      this._store.dispatch(this._syncer.actionCreator(q));

      this._lastQueryString = location.search;
    }
  }, {
    key: "_onStateChange",
    value: function _onStateChange() {
      if (this._history.location.pathname !== this._syncer.pathname) {
        return;
      }

      var value = this._syncer.selector(this._store.getState());
      var q = this._syncer.options.stringifyState ? "?" + _qs2.default.stringify(value) : value;

      var next = this._syncer.options.replaceState ? this._history.replace : this._history.push;
      next({
        pathname: this._history.location.pathname,
        search: q,
        state: { ignore: true }
      });

      this._lastQueryString = q;
    }
  }, {
    key: "sync",
    value: function sync() {
      var historyListener = new _HistoryListener2.default();
      historyListener.setOnPathnameChange(this._onPathnameChange.bind(this));
      historyListener.setOnSearchChange(this._onSearchChange.bind(this));

      var stopListeningHistory = this._history.listen(historyListener.listenPathname(this._syncer.pathname));
      var unsubscribeFromStore = this._store.subscribe(this._onStateChange.bind(this));

      return function () {
        stopListeningHistory();
        unsubscribeFromStore();
      };
    }
  }]);

  return Sync;
}();

exports.default = Sync;