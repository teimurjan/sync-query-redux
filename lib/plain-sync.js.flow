// @flow
import qs from "query-string";
import createHistory, {
  type BrowserHistory as History
} from "history/createBrowserHistory";
import { type Store } from "redux";

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
    history = createHistory()
  }: {
    history?: History
  }
) => {
  let lastSearch;

  const stopListeningHistory = history.listen(loc => {
    const syncObject = syncObjects.find(obj => obj.pathname === loc.pathname);
    if (!syncObject) return;

    store.dispatch(
      syncObject.actionCreator(
        syncObject.parsed ? qs.parse(loc.search) : loc.search
      )
    );

    lastSearch = loc.search;
  });

  const unsubscribeFromStore = store.subscribe(() => {
    const syncObject = syncObjects.find(
      obj => obj.pathname === history.location.pathname
    );

    if (!syncObject) return;

    const state = store.getState();
    const newSearch = syncObject.selector(state);
    if (newSearch !== lastSearch) {
      const newLocation = `${location.pathname}?${newSearch}`;
      syncObject.replaceState
        ? history.replace(newLocation)
        : history.push(newLocation);
    }
  });

  return {
    stopListeningHistory,
    unsubscribeFromStore
  };
};

export default plainSync;
