// @flow
import qs from "qs";
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
  parseQuery?: boolean,
  stringifyState?: boolean,
  replaceState?: boolean,
  initialFrom?: "location" | "state"
};

type StatefulSyncObject = SyncObject & {
  lastQueryString: ?string
};

type SyncState = {
  ignoreStateUpdate: boolean,
  lastPathname: ?string
};

type Dependencies = {
  syncObjects: { [pathname: string]: StatefulSyncObject },
  syncState: SyncState,
  store: Store<any, any>,
  history: History
};

export const handlePathnameChange = (
  newLoc: BrowserLocation,
  { syncState, syncObjects }: Dependencies
) => {
  if (newLoc.pathname !== syncState.lastPathname) {
    const lastSyncObject = syncObjects[syncState.lastPathname || ""];
    if (lastSyncObject) lastSyncObject.lastQueryString = undefined;
    syncState.lastPathname = newLoc.pathname;
  }
};

const handleHistoryChange = (
  loc: BrowserLocation,
  syncObject: StatefulSyncObject,
  { syncState, store }: Dependencies
) => {
  syncState.ignoreStateUpdate = true;
  if (loc.search !== syncObject.lastQueryString) {
    const value = syncObject.parseQuery ? qs.parse(loc.search) : loc.search;
    store.dispatch(syncObject.actionCreator(value));
    syncObject.lastQueryString = loc.search;
  }
  syncState.ignoreStateUpdate = false;
};

const makeHistoryListener = (dependencies: Dependencies) => (
  loc: BrowserLocation
) => {
  const { syncState, syncObjects } = dependencies;
  handlePathnameChange(loc, dependencies);

  if (loc.state && loc.state.isInvokedByStateSubscriber) return;

  const syncObject = syncObjects[loc.pathname];
  if (!syncObject) return;

  const { initialFrom = "location", lastQueryString } = syncObject;

  const isFirstChange = lastQueryString === undefined;
  if (initialFrom === "state" && isFirstChange) {
    handleStateChange(syncObject, dependencies);
  } else {
    handleHistoryChange(loc, syncObject, dependencies);
  }
};

const handleStateChange = (
  syncObject: StatefulSyncObject,
  { history, store, syncState }: Dependencies
) => {
  const state = store.getState();
  const value = syncObject.selector(state);
  const newQueryString = syncObject.stringifyState
    ? qs.stringify(value)
    : value;

  if (newQueryString !== syncObject.lastQueryString) {
    syncObject.lastQueryString = newQueryString;
    const newLocation = `${location.pathname}${newQueryString}`;
    syncObject.replaceState
      ? history.replace(newLocation, { isInvokedByStateSubscriber: true })
      : history.push(newLocation, { isInvokedByStateSubscriber: true });
  }
};

const makeStoreSubscriber = (dependencies: Dependencies) => () => {
  const { syncState, history, syncObjects } = dependencies;
  if (syncState.ignoreStateUpdate) return;

  const syncObject = syncObjects[history.location.pathname];
  if (!syncObject) return;

  const { initialFrom = "location", lastQueryString } = syncObject;

  const isFirstChange = lastQueryString === undefined;
  if (initialFrom === "location" && isFirstChange) {
    handleHistoryChange(history.location, syncObject, dependencies);
  } else {
    handleStateChange(syncObject, dependencies);
  }
};

const plainSync = (
  store: Store<any, any>,
  syncObjects: Array<SyncObject>,
  { history }: { history: History }
) => {
  const syncState = {
    ignoreStateUpdate: false,
    lastPathname: history.location.pathname
  };

  const statefulSyncObjects = syncObjects.reduce(
    (acc, obj) => ({
      ...acc,
      [obj.pathname]: {
        ...obj,
        lastQueryString: undefined
      }
    }),
    {}
  );

  const dependencies = {
    syncObjects: statefulSyncObjects,
    syncState,
    store,
    history
  };

  const historyListener = makeHistoryListener(dependencies);
  const storeSubscriber = makeStoreSubscriber(dependencies);

  const stopListeningHistory = history.listen(historyListener);
  const unsubscribeFromStore = store.subscribe(storeSubscriber);

  storeSubscriber();

  return () => {
    stopListeningHistory();
    unsubscribeFromStore();
  };
};

export default plainSync;
