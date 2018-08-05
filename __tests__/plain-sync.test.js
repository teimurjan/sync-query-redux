// @flow
import plainSync, { updateLastPathnameIfNeeded } from "../src/plain-sync";
import { getHistoryStub } from "./utils";

describe("plainSync module test", () => {
  it("it works without crashes", () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn()
    };
    const syncObjects = [
      {
        pathname: "/path",
        actionCreator: jest.fn(),
        selector: jest.fn()
      }
    ];

    const history = getHistoryStub();
    const sync = plainSync(store, syncObjects, { history });

    expect(history.listen).toHaveBeenCalled();
    expect(store.subscribe).toHaveBeenCalled();
  });

  it("updates last pathname correctly", () => {
    const location = {
      pathname: "/",
      search: "",
      hash: "",
      state: {},
      key: ""
    };
    const lastPathname = '/lastpathname';
    const pathname = "/path";
    const dependencies = {
      syncObjects: {
        [pathname]: {
          pathname: "/path",
          actionCreator: jest.fn(),
          selector: jest.fn(),
          lastQueryString: ""
        }
      },
      syncState: {
        ignoreStateUpdate: false,
        lastPathname
      },
      store: {
        dispatch: jest.fn(),
        getState: jest.fn(),
        subscribe: jest.fn(),
        replaceReducer: jest.fn()
      },
      history: getHistoryStub()
    };

    expect(dependencies.syncState.lastPathname).toEqual(lastPathname);
    updateLastPathnameIfNeeded(location, dependencies);
    expect(dependencies.syncState.lastPathname).toBeUndefined();
  });
});
