// @flow
import qs from "query-string";
import type { BrowserHistory as History } from "history/createBrowserHistory";
import type { Store } from "redux";

type SyncObject = {
  pathname: string,
  actionCreator: (
    search: string | Object
  ) => { type: string, [key: string]: any },
  selector: (state: Object) => any,
  parsed?: boolean,
  replaceState?: boolean
};

const plainSync = (
  store: Store<any, any>,
  syncObjects: Array<SyncObject>,
  {
    history
  }: {
    history: History
  }
) => {
  const state = {
    lastSearch: undefined,
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false
  };

  const stopListeningHistory = history.listen(loc => {
    if (state.ignoreLocationUpdate) return;

    const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
    if (!syncObject) return;

    state.lastSearch = loc.search;

    state.ignoreStateUpdate = true;
    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );
    state.ignoreStateUpdate = false;
  });

  const unsubscribeFromStore = store.subscribe(() => {
    if (state.ignoreStateUpdate) return;

    const syncObject = syncObjects.find(
      obj => obj.pathname === history.location.pathname
    );

    if (!syncObject) return;

    const state = store.getState();
    const newSearch = syncObject.selector(state);
    if (newSearch !== lastSearch) {
      state.lastSearch = newSearch;
      const newLocation = `${location.pathname}?${newSearch}`;
      state.ignoreLocationUpdate = true;
      syncObject.replaceState
        ? history.replace(newLocation)
        : history.push(newLocation);
      state.ignoreLocationUpdate = false;
    }
  });

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
