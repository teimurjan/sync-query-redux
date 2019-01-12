// @flow
import type { BrowserLocation as Location } from "history/createBrowserHistory";

export const hasSearchChanged = (
  prevLocation: ?Location,
  nextLocation: ?Location
) => (nextLocation || {}).search !== (prevLocation || {}).search;

export const hasPathnameChanged = (
  prevLocation: ?Location,
  nextLocation: ?Location
) => (nextLocation || {}).pathname !== (prevLocation || {}).pathname;

class HistoryListener {
  prevLocation: ?Location;
  currentLocation: ?Location;
  _onPathnameChange: ?(prevLocation: ?Location, location: Location) => any;
  _onSearchChange: ?(prevLocation: ?Location, location: Location) => any;

  constructor() {
    this.prevLocation = undefined;
    this.currentLocation = undefined;
    this._onPathnameChange = undefined;
    this._onSearchChange = undefined;
  }

  getListenerFunc = (pathname: string) => (location: Location) => {
    this.currentLocation = location;
    const isPathnameMatches = location.pathname === pathname;
    if (
      isPathnameMatches &&
      hasSearchChanged(this.prevLocation, this.currentLocation) &&
      this._onSearchChange
    ) {
      this._onSearchChange(this.prevLocation, location);
    } else if (
      hasPathnameChanged(this.prevLocation, this.currentLocation) &&
      this._onPathnameChange
    ) {
      this._onPathnameChange(this.prevLocation, location);
    }
    this.currentLocation = undefined;
    this.prevLocation = location;
  };

  setOnPathnameChange = (
    cb: (prevLocation: ?Location, location: Location) => any
  ) => {
    this._onPathnameChange = cb;
  };

  setOnSearchChange = (
    cb: (prevLocation: ?Location, location: Location) => any
  ) => {
    this._onSearchChange = cb;
  };
}

export default HistoryListener;
