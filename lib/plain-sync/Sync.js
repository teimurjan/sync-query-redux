"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSearchFromObject = void 0;

var _qs = _interopRequireDefault(require("qs"));

var _Syncer = _interopRequireDefault(require("./Syncer"));

var _HistoryListener = _interopRequireDefault(require("./HistoryListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getSearchFromObject = obj => {
  const search = _qs.default.stringify(obj);

  return search.length > 0 ? `?${search}` : "";
};

exports.getSearchFromObject = getSearchFromObject;

class Sync {
  constructor(store, history, syncer) {
    _defineProperty(this, "_store", void 0);

    _defineProperty(this, "_history", void 0);

    _defineProperty(this, "_syncer", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_process", cb => {
      this._state.isProcessing = true;
      cb();
      this._state.isProcessing = false;
    });

    _defineProperty(this, "_onSearchChange", (prevLocation, location) => {
      if (this._state.isProcessing) {
        return;
      }

      const newValue = this._getNewValueFromSearch(location.search.slice(1));

      this._process(() => this._store.dispatch(this._syncer.actionCreator(newValue)));
    });

    _defineProperty(this, "_getNewValueFromSearch", search => this._syncer.options.parseQuery ? _qs.default.parse(search) : search);

    _defineProperty(this, "_onStateChange", () => {
      const isPathnameMatches = this._history.location.pathname === this._syncer.pathname;

      if (!isPathnameMatches || this._state.isProcessing) {
        return;
      }

      const stateValue = this._syncer.selector(this._store.getState());

      const search = getSearchFromObject(stateValue);

      if (search === this._history.location.search) {
        return;
      }

      const next = this._syncer.options.replaceState ? this._history.replace : this._history.push;

      this._process(() => next({
        pathname: this._history.location.pathname,
        search: this._syncer.options.stringifyState ? search : stateValue
      }));
    });

    _defineProperty(this, "start", () => {
      const historyListener = new _HistoryListener.default();
      historyListener.setOnSearchChange(this._onSearchChange);

      const stopListeningHistory = this._history.listen(historyListener.getListenerFunc(this._syncer.pathname));

      const unsubscribeFromStore = this._store.subscribe(this._onStateChange);

      if (this._syncer.pathname === this._history.location.pathname) {
        if (this._syncer.options.relyOn === "location") {
          this._onSearchChange(undefined, this._history.location);
        } else {
          this._onStateChange();
        }
      }

      return () => {
        stopListeningHistory();
        unsubscribeFromStore();
      };
    });

    this._store = store;
    this._history = history;
    this._syncer = syncer;
    this._state = {
      isProcessing: false
    };
  }

}

var _default = Sync;
exports.default = _default;