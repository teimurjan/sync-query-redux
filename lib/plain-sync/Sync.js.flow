// @flow
import qs from "qs";
import type {
  BrowserHistory as History,
  BrowserLocation as Location
} from "history/createBrowserHistory";
import type { Store } from "redux";
import Syncer from "./Syncer";
import HistoryListener from "./HistoryListener";

interface ISync {
  constructor(store: Store<any, any>, history: History, syncer: Syncer): void;
  start(): Function;
}

class Sync implements ISync {
  _store: Store<any, any>;
  _history: History;
  _syncer: Syncer;
  _lastQueryString: ?string;

  constructor(store: Store<any, any>, history: History, syncer: Syncer) {
    this._store = store;
    this._history = history;
    this._syncer = syncer;
    this._lastQueryString = undefined;
  }

  _onPathnameChange = (prevLocation: ?Location, location: Location) => {
    this._lastQueryString = undefined;
  };

  _onSearchChange = (prevLocation: ?Location, location: Location) => {
    if ((location.state || {}).ignore) {
      return;
    }
    const newValue = this._getNewValueFromSearch(location.search.slice(1));
    this._store.dispatch(this._syncer.actionCreator(newValue));

    this._lastQueryString = location.search;
  };

  _getNewValueFromSearch = (search: string) =>
    this._syncer.options.parseQuery ? qs.parse(search) : search;

  _onStateChange = () => {
    if (this._history.location.pathname !== this._syncer.pathname) {
      return;
    }

    const q = this._getNewQueryFromState();
    const next = this._syncer.options.replaceState
      ? this._history.replace
      : this._history.push;
    next({
      pathname: this._history.location.pathname,
      search: q,
      state: { ignore: true }
    });

    this._lastQueryString = q;
  };

  _getNewQueryFromState = () => {
    const value = this._syncer.selector(this._store.getState());
    return this._syncer.options.stringifyState
      ? `?${qs.stringify(value)}`
      : value;
  };

  start = () => {
    const historyListener = new HistoryListener();
    historyListener.setOnPathnameChange(this._onPathnameChange);
    historyListener.setOnSearchChange(this._onSearchChange);

    const stopListeningHistory = this._history.listen(
      historyListener.listenTo(this._syncer.pathname)
    );
    const unsubscribeFromStore = this._store.subscribe(this._onStateChange);

    if (this._syncer.options.relyOn === "location") {
      this._onSearchChange(undefined, this._history.location);
    } else {
      this._onStateChange();
    }

    return () => {
      stopListeningHistory();
      unsubscribeFromStore();
    };
  };
}

export default Sync;
