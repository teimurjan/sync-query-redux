// @flow
import qs from "query-string";
import type {
  BrowserHistory as History,
  BrowserLocation
} from "history/createBrowserHistory";
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
  store: Store<any, any>,
  history: History,
  updateState: ({ [key: $Keys<SyncState>]: any }) => void
};

const updateLastPathnameIfNeeded = (
  newLoc: BrowserLocation,
  { syncState, updateState }: Dependencies
) => {
  if (newLoc.pathname !== syncState.lastPathname) {
    updateState({ lastPathname: undefined });
  }
};

const findSyncObject = (
  loc: BrowserLocation,
  { syncObjects }: Dependencies
) => {
  const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
  if (!syncObject) return;
  syncObject.lastSearch = loc.search;
  return syncObject;
};

const createActionIfNeeded = (
  loc: BrowserLocation,
  syncObject: StatefulSyncObject,
  { updateState, store }: Dependencies
) => {
  updateState({ ignoreStateUpdate: true });
  if (loc.search !== syncObject.lastSearch) {
    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );
  }
  updateState({ ignoreStateUpdate: false });
};

const makeHistoryListener = (dependencies: Dependencies) => (
  loc: BrowserLocation
) => {
  const { syncState, updateState } = dependencies;
  updateLastPathnameIfNeeded(loc, dependencies);
  if (syncState.ignoreLocationUpdate) return;

  updateState({ lastPathname: loc.pathname });
  const syncObject = findSyncObject(loc, dependencies);
  if (!syncObject) return;

  createActionIfNeeded(loc, syncObject, dependencies);
};

const updateStateIfNeeded = (
  syncObject: StatefulSyncObject,
  { history, store, updateState }: Dependencies
) => {
  const state = store.getState();
  const newSearch = syncObject.selector(state);

  if (newSearch !== syncObject.lastSearch) {
    syncObject.lastSearch = newSearch;
    const newLocation = `${location.pathname}?${newSearch}`;
    updateState({ ignoreLocationUpdate: true });
    syncObject.replaceState
      ? history.replace(newLocation)
      : history.push(newLocation);
    updateState({ ignoreLocationUpdate: false });
  }
};

const makeStoreSubscriber = (dependencies: Dependencies) => () => {
  const { syncState, history } = dependencies;
  if (syncState.ignoreStateUpdate) return;

  const syncObject = findSyncObject(history.location, dependencies);
  if (!syncObject) return;

  if (
    syncObject.initialFrom === "location" &&
    syncObject.lastSearch === undefined
  )
    return;

  updateStateIfNeeded(syncObject, dependencies);
};

const plainSync = (
  store: Store<any, any>,
  syncObjects: Array<SyncObject>,
  { history }: { history: History }
) => {
  let syncState = {
    ignoreLocationUpdate: false,
    ignoreStateUpdate: false,
    lastPathname: undefined
  };

  const _syncObjects = syncObjects.map(o => ({ ...o, lastSearch: undefined }));

  const updateState = (property: { [key: $Keys<SyncState>]: any }) => {
    syncState = {
      ...syncState,
      ...property
    };
  };

  const dependencies = {
    syncObjects: _syncObjects,
    syncState,
    store,
    history,
    updateState
  };

  const stopListeningHistory = history.listen(
    makeHistoryListener(dependencies)
  );

  const unsubscribeFromStore = store.subscribe(
    makeStoreSubscriber(dependencies)
  );

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
