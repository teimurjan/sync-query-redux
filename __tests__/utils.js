// @flow
import type {
  BrowserHistory as History,
  BrowserLocation
} from "history/createBrowserHistory";

export const getHistoryStub = (): History => ({
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
    state: {},
    key: ""
  },
  push: jest.fn(),
  replace: jest.fn()
});
