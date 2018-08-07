// @flow
import plainSync, { handlePathnameChange } from "../src/plain-sync";
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

  it("handles pathname change correctly", () => {
    const location = {
      pathname: "/",
      search: "",
      hash: "",
      state: {},
      key: ""
    };
    const lastPathname = "/lastpathname";
    const pathname = "/path";
    const dependencies = {
      syncObjects: {
        [pathname]: {
          pathname,
          actionCreator: jest.fn(),
          selector: jest.fn(),
          lastQueryString: ""
        },
        [lastPathname]: {
          pathname: lastPathname,
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
    expect(dependencies.syncObjects[lastPathname].lastQueryString).toEqual("");
    handlePathnameChange(location, dependencies);
    expect(dependencies.syncState.lastPathname).toBeUndefined();
    expect(dependencies.syncObjects[lastPathname].lastQueryString).toEqual(
      undefined
    );
  });
});
