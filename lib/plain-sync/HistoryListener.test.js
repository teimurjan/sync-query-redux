"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _HistoryListener = require("./HistoryListener");

var _HistoryListener2 = _interopRequireDefault(_HistoryListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("HistoryListener test", function () {
  it("should call onPathnameChange", function () {
    var location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    var listener = new _HistoryListener2.default();
    var onPathnameChange = jest.fn();
    listener.setOnPathnameChange(onPathnameChange);

    var listenerFunc = listener.getListenerFunc("path");

    listenerFunc(location);
    var newLocation = _extends({}, location, { pathname: "newTestPathname" });
    listenerFunc(newLocation);

    expect(onPathnameChange).toHaveBeenCalledWith(location, newLocation);
  });

  it("should call onSearchChange", function () {
    var location = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    var listener = new _HistoryListener2.default();
    var onSearchChange = jest.fn();
    listener.setOnSearchChange(onSearchChange);

    var listenerFunc = listener.getListenerFunc(location.pathname);

    listenerFunc(location);
    var newLocation = _extends({}, location, { search: "newTestSearch" });
    listenerFunc(newLocation);

    expect(onSearchChange).toHaveBeenCalledWith(location, newLocation);
  });

  it("should correctly detect search change", function () {
    var currentLocation = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    var prevLocation = _extends({}, currentLocation, {
      search: "newTestSearch"
    });

    expect((0, _HistoryListener.hasSearchChanged)(prevLocation, currentLocation)).toBeTruthy();
    expect((0, _HistoryListener.hasSearchChanged)(undefined, currentLocation)).toBeTruthy();
    expect((0, _HistoryListener.hasSearchChanged)(currentLocation, undefined)).toBeTruthy();
    expect((0, _HistoryListener.hasSearchChanged)(currentLocation, currentLocation)).toBeFalsy();
  });

  it("should correctly detect pathname change", function () {
    var currentLocation = {
      hash: "testHash",
      key: "testKey",
      pathname: "testPathname",
      search: "testSearch",
      state: {}
    };
    var prevLocation = _extends({}, currentLocation, {
      pathname: "newTestPathname"
    });

    expect((0, _HistoryListener.hasPathnameChanged)(prevLocation, currentLocation)).toBeTruthy();
    expect((0, _HistoryListener.hasPathnameChanged)(undefined, currentLocation)).toBeTruthy();
    expect((0, _HistoryListener.hasPathnameChanged)(currentLocation, undefined)).toBeTruthy();
    expect((0, _HistoryListener.hasPathnameChanged)(currentLocation, currentLocation)).toBeFalsy();
  });
});