// @flow
import plainSync from "../src/plain-sync";

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

    const history = {
      action: "PUSH",
      block: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      length: 1,
      listen: jest.fn(),
      location: {
        pathname: "/",
        search: "",
        hash: "",
        state: "",
        key: ""
      },
      push: jest.fn(),
      replace: jest.fn()
    };
    const sync = plainSync(store, syncObjects, { history });

    expect(history.listen).toHaveBeenCalled();
    expect(store.subscribe).toHaveBeenCalled();
  });
});
