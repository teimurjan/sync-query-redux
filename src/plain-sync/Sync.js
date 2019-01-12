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
  _state: {
    isProcessing: boolean
  };

  constructor(store: Store<any, any>, history: History, syncer: Syncer) {
    this._store = store;
    this._history = history;
    this._syncer = syncer;
    this._state = {
      isProcessing: false
    };
  }

  _process = (cb: Function) => {
    this._state.isProcessing = true;
    cb();
    this._state.isProcessing = false;
  };

  _onSearchChange = (prevLocation: ?Location, location: Location) => {
    if (this._state.isProcessing) {
      return;
    }
    const newValue = this._getNewValueFromSearch(location.search.slice(1));
    this._process(() =>
      this._store.dispatch(this._syncer.actionCreator(newValue))
    );
  };

  _getNewValueFromSearch = (search: string) =>
    this._syncer.options.parseQuery ? qs.parse(search) : search;

  _onStateChange = () => {
    const isPathnameMatches =
      this._history.location.pathname === this._syncer.pathname;
    if (!isPathnameMatches || this._state.isProcessing) {
      return;
    }

    const q = this._getNewQueryFromState();
    if (q === this._history.location.search) {
      return
    }
    const next = this._syncer.options.replaceState
      ? this._history.replace
      : this._history.push;
    this._process(() =>
      next({
        pathname: this._history.location.pathname,
        search: q,
      })
    );
  };

  _getNewQueryFromState = () => {
    const value = this._syncer.selector(this._store.getState());
    return this._syncer.options.stringifyState
      ? `?${qs.stringify(value)}`
      : value;
  };

  start = () => {
    const historyListener = new HistoryListener();
    historyListener.setOnSearchChange(this._onSearchChange);
    const stopListeningHistory = this._history.listen(
      historyListener.getListenerFunc(this._syncer.pathname)
    );
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
  };
}

export default Sync;
