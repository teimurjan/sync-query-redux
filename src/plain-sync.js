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
  parsed?: boolean,
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

export const updateLastPathnameIfNeeded = (
  newLoc: BrowserLocation,
  { syncState }: Dependencies
) => {
  if (newLoc.pathname !== syncState.lastPathname) {
    syncState.lastPathname = undefined;
  }
};

const createActionIfNeeded = (
  loc: BrowserLocation,
  syncObject: StatefulSyncObject,
  { syncState, store }: Dependencies
) => {
  syncState.ignoreStateUpdate = true;
  if (loc.search !== syncObject.lastQueryString) {
    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );
    syncObject.lastQueryString = loc.search;
  }
  syncState.ignoreStateUpdate = false;
};

const makeHistoryListener = (dependencies: Dependencies) => (
  loc: BrowserLocation
) => {
  const { syncState, syncObjects } = dependencies;
  updateLastPathnameIfNeeded(loc, dependencies);

  if (loc.state && loc.state.isInvokedByStateSubscriber) return;

  syncState.lastPathname = loc.pathname;
  const syncObject = syncObjects[loc.pathname];
  if (!syncObject) return;

  createActionIfNeeded(loc, syncObject, dependencies);
};

const updateStateIfNeeded = (
  syncObject: StatefulSyncObject,
  { history, store, syncState }: Dependencies
) => {
  const state = store.getState();
  const newQueryString = syncObject.selector(state);

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
    createActionIfNeeded(history.location, syncObject, dependencies);
  }

  updateStateIfNeeded(syncObject, dependencies);
};

const plainSync = (
  store: Store<any, any>,
  syncObjects: Array<SyncObject>,
  { history }: { history: History }
) => {
  const syncState = {
    ignoreStateUpdate: false,
    lastPathname: undefined
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
