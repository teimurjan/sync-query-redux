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
  const syncState = {
    lastSearch: undefined,
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false
  };

  const stopListeningHistory = history.listen(loc => {
    if (syncState.ignoreLocationUpdate) return;

    const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
    if (!syncObject) return;

    syncState.lastSearch = loc.search;

    syncState.ignoreStateUpdate = true;
    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );
    syncState.ignoreStateUpdate = false;
  });

  const unsubscribeFromStore = store.subscribe(() => {
    if (syncState.ignoreStateUpdate) return;

    const syncObject = syncObjects.find(
      obj => obj.pathname === history.location.pathname
    );

    if (!syncObject) return;

    const state = store.getState();
    const newSearch = syncObject.selector(state);
    if (newSearch !== syncState.lastSearch) {
      syncState.lastSearch = newSearch;
      const newLocation = `${location.pathname}?${newSearch}`;
      syncState.ignoreLocationUpdate = true;
      syncObject.replaceState
        ? history.replace(newLocation)
        : history.push(newLocation);
      syncState.ignoreLocationUpdate = false;
    }
  });

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
