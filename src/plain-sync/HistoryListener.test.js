// @flow
import HistoryListener, {
  hasPathnameChanged,
  hasSearchChanged
} from "./HistoryListener";

describe("HistoryListener test", () => {
  it("should call onPathnameChange", () => {
    const location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    const listener = new HistoryListener();
    const onPathnameChange = jest.fn();
    listener.setOnPathnameChange(onPathnameChange);

    const listenerFunc = listener.getListenerFunc("path");

    listenerFunc(location);
    const newLocation = { ...location, pathname: "newTestPathname" };
    listenerFunc(newLocation);

    expect(onPathnameChange).toHaveBeenCalledWith(location, newLocation);
  });

  it("should call onSearchChange", () => {
    const location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    const listener = new HistoryListener();
    const onSearchChange = jest.fn();
    listener.setOnSearchChange(onSearchChange);

    const listenerFunc = listener.getListenerFunc(location.pathname);

    listenerFunc(location);
    const newLocation = { ...location, search: "newTestSearch" };
    listenerFunc(newLocation);

    expect(onSearchChange).toHaveBeenCalledWith(location, newLocation);
  });

  it("should correctly detect search change", () => {
    const currentLocation = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    const prevLocation = {
      ...currentLocation,
      search: "newTestSearch"
    };

    expect(hasSearchChanged(prevLocation, currentLocation)).toBeTruthy();
    expect(hasSearchChanged(undefined, currentLocation)).toBeTruthy();
    expect(hasSearchChanged(currentLocation, undefined)).toBeTruthy();
    expect(hasSearchChanged(currentLocation, currentLocation)).toBeFalsy();
  });

  it("should correctly detect pathname change", () => {
    const currentLocation = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    const prevLocation = {
      ...currentLocation,
      pathname: "newTestPathname"
    };

    expect(hasPathnameChanged(prevLocation, currentLocation)).toBeTruthy();
    expect(hasPathnameChanged(undefined, currentLocation)).toBeTruthy();
    expect(hasPathnameChanged(currentLocation, undefined)).toBeTruthy();
    expect(hasPathnameChanged(currentLocation, currentLocation)).toBeFalsy();
  });
});
