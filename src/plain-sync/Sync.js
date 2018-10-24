// @flow
import qs from "qs";
import type {
  BrowserHistory as History,
  BrowserLocation as Location
} from "history/createBrowserHistory";
import type { Store } from "redux";
import Syncer from "./Syncer";
import HistoryListener from "./HistoryListener";

class Sync {
  _store: Store<any, any>;
  _history: History;
  _syncer: Syncer;
  _lastQueryString: ?string;

  constructor(store: Store<any, any>, history: History, syncer: Syncer) {
    this._store = store;
    this._history = history;
    this._syncer = syncer;
    this._lastQueryString = undefined;
    this.sync.bind(this);
  }

  _onPathnameChange(prevLocation: ?Location, location: Location) {
    this._lastQueryString = undefined;
  }

  _onSearchChange(prevLocation: ?Location, location: Location) {
    const isFirstChange = this._lastQueryString === undefined;
    const shouldStartFromState =
      isFirstChange && this._syncer.options.relyOn === "state";
    if (shouldStartFromState || location.state.ignore) {
      return;
    }

    const q = this._syncer.options.parseQuery
      ? qs.parse(location.search)
      : location.search;
    this._store.dispatch(this._syncer.actionCreator(q));

    this._lastQueryString = location.search;
  }

  _onStateChange() {
    if (this._history.location.pathname !== this._syncer.pathname) {
      return;
    }

    const value = this._syncer.selector(this._store.getState());
    const q = this._syncer.options.stringifyState
      ? `?${qs.stringify(value)}`
      : value;

    const next = this._syncer.options.replaceState
      ? this._history.replace
      : this._history.push;
    next({
      pathname: this._history.location.pathname,
      search: q,
      state: { ignore: true }
    });

    this._lastQueryString = q;
  }

  sync() {
    const historyListener = new HistoryListener();
    historyListener.setOnPathnameChange(this._onPathnameChange.bind(this));
    historyListener.setOnSearchChange(this._onSearchChange.bind(this));

    const stopListeningHistory = this._history.listen(
      historyListener.listenPathname(this._syncer.pathname)
    );
    const unsubscribeFromStore = this._store.subscribe(this._onStateChange.bind(this));

    return () => {
      stopListeningHistory();
      unsubscribeFromStore();
    };
  }
}

export default Sync;
