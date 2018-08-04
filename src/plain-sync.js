// @flow
import qs from "query-string";
import type { BrowserHistory as History, BrowserLocation as Location } from "history/createBrowserHistory";
import type { Store } from "redux";

type SyncObject = {
  pathname: string,
  actionCreator: (
    search: string | Object
  ) => { type: string, [key: string]: any },
  selector: (state: Object) => any,
  parsed?: boolean,
  replaceState?: boolean,
  initialFrom?: "location" | "state"
};

type StatefulSyncObject = SyncObject & {
  lastSearch: ?string
};

type SyncState = {
  ignoreLocationUpdate: boolean,
  ignoreStateUpdate: boolean,
  lastPathname: ?string
};

type Dependencies = {
    syncObjects: Array<StatefulSyncObject>,
    syncState: SyncState,
    store: Store,
    history: History,
    updateState: ({[key: string]: any}) => void,
}

const updateLastPathnameIfNeeded = (newLoc: Location, { syncState, updateState }: Dependencies) => {
  if (newLoc.pathname !== syncState.lastPathname) {
    updateState({ lastPathname: undefined });
  }
};


const findSyncObject = (loc: Location, {syncObjects, updateState}: Dependencies) => {
  const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
  if (!syncObject) return;
  syncObject.lastSearch = loc.search;
  return syncObject;
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
  let syncState = {
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false,
    lastPathname: undefined
  };

  const _syncObjects = syncObjects.map(o => ({ ...o, lastSearch: undefined }));

  const dependencies = {
    syncObjects: _syncObjects,
    syncState,
    store,
    history,
    updateState,
  }

  const findSyncObject = (loc: Location) => {
    const syncObject = _syncObjects.find(obj => obj.pathname === loc.pathname);
    if (!syncObject) return;
    syncObject.lastSearch = loc.search;
    return syncObject;
  };

  const createActionIfNeeded = (loc: Location, syncObject: StatefulSyncObject) => {
    syncState.ignoreStateUpdate = true;
    if (loc.search !== syncObject.lastSearch) {
      store.dispatch(
        syncObject.actionCreator(
          syncObject.parsed ? qs.parse(loc.search) : loc.search
        )
      );
    }
    syncState.ignoreStateUpdate = false;
  };

  const stopListeningHistory = history.listen(loc => {
    updateLastPathnameIfNeeded(loc);
    if (syncState.ignoreLocationUpdate) return;

    syncState.lastPathname = loc.pathname;
    const syncObject = findSyncObject(loc);
    if (!syncObject) return;

    createActionIfNeeded(loc, syncObject);
  });

  const updateStateIfNeeded = (syncObject: StatefulSyncObject) => {
    const state = store.getState();
    const newSearch = syncObject.selector(state);
    if (newSearch !== syncObject.lastSearch) {
      syncObject.lastSearch = newSearch;
      const newLocation = `${location.pathname}?${newSearch}`;
      syncState.ignoreLocationUpdate = true;
      syncObject.replaceState
        ? history.replace(newLocation)
        : history.push(newLocation);
      syncState.ignoreLocationUpdate = false;
    }
  };

  const unsubscribeFromStore = store.subscribe(() => {
    if (syncState.ignoreStateUpdate) return;

    const syncObject = findSyncObject(history.location);
    if (!syncObject) return;

    if (
      syncObject.initialFrom === "location" &&
      syncObject.lastSearch === undefined
    )
      return;

    updateStateIfNeeded(syncObject);
  });

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
