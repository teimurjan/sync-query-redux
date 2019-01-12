// @flow
import Sync from "./Sync";
import Syncer, { type Options } from "./Syncer";

const getTestStore = () => ({
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn()
});

const getTestHistory = () => ({
  length: 1,
  location: {
    hash: "testHash",
    key: "testKey",
    pathname: "testPathname",
    search: "testSearch",
    state: {}
  },
  action: "PUSH",
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  listen: jest.fn(),
  block: jest.fn()
});

const getTestSyncer = (pathname: string, options: ?Options) =>
  new Syncer(pathname, jest.fn(), jest.fn(), options);

describe("Sync test", () => {
  it("should process correctly", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    sync._state.isProcessing = true;

    const cb = jest.fn();
    sync._process(cb);
    expect(cb).toHaveBeenCalled();
    expect(sync._state.isProcessing).toBeFalsy();
  });

  it("should not call onSearchChange is processing", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    sync._state.isProcessing = true;

    const location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    sync._onSearchChange(undefined, location);
    expect(sync._store.dispatch).not.toHaveBeenCalled();
  });

  it("should call onSearchChange", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    const location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "?test=search",
      state: {}
    };
    sync._onSearchChange(undefined, location);
    expect(sync._store.dispatch).toHaveBeenCalled();
  });

  it("should get raw search if parseQuery is false", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    expect(sync._getNewValueFromSearch("?test=search")).toEqual("?test=search");
  });

  it("should get parsed search if parseQuery is true", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname, {
      parseQuery: true
    });
    const sync = new Sync(store, history, syncer);

    expect(sync._getNewValueFromSearch("test=search")).toEqual({
      test: "search"
    });
  });

  it("should not process state change if it's processing", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    sync._state.isProcessing = true;

    sync._onStateChange();
    expect(sync._syncer.selector).not.toHaveBeenCalled();
  });

  it("should not process state change if pathname not matches", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname + "NOT_MATCHES");
    const sync = new Sync(store, history, syncer);

    sync._onStateChange();
    expect(sync._syncer.selector).not.toHaveBeenCalled();
  });

  it("should not process state change if seacrh has not been changed", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(
      store,
      { ...history, location: { ...history.location, search: "" } },
      syncer
    );

    sync._onStateChange();
    expect(sync._history.replace).not.toHaveBeenCalled();
    expect(sync._history.push).not.toHaveBeenCalled();
  });

  it("should process state change", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const newSearch = "?new=search";
    syncer.selector = jest.fn().mockReturnValue(newSearch);
    const sync = new Sync(store, history, syncer);

    sync._onStateChange();
    expect(sync._history.push).toHaveBeenCalledWith({
      pathname: history.location.pathname,
      search: newSearch
    });
  });

  it("should start correctly", () => {
    const store = getTestStore();
    const history = getTestHistory();
    const syncer = getTestSyncer(history.location.pathname);
    const sync = new Sync(store, history, syncer);

    sync.start();
    expect(sync._history.listen).toHaveBeenCalled();
    expect(sync._store.subscribe).toHaveBeenCalled();
    
    // relyOn=state
    expect(sync._history.push).toHaveBeenCalled();
  });
});
