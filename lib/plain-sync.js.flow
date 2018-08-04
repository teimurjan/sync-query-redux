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
  let lastSearch, ignoreLocationUpdate, ignoreStateUpdate;

  const stopListeningHistory = history.listen(loc => {
    if (ignoreLocationUpdate) return;

    const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
    if (!syncObject) return;

    lastSearch = loc.search;

    ignoreStateUpdate = true;
    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );
    ignoreStateUpdate = false;
  });

  const unsubscribeFromStore = store.subscribe(() => {
    if (ignoreStateUpdate) return;

    const syncObject = syncObjects.find(
      obj => obj.pathname === history.location.pathname
    );

    if (!syncObject) return;

    const state = store.getState();
    const newSearch = syncObject.selector(state);
    if (newSearch !== lastSearch) {
      const newLocation = `${location.pathname}?${newSearch}`;
      ignoreLocationUpdate = true;
      syncObject.replaceState
        ? history.replace(newLocation)
        : history.push(newLocation);
      ignoreLocationUpdate = false;
    }
  });

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
