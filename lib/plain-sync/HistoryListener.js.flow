// @flow
import type { BrowserLocation as Location } from "history/createBrowserHistory";

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

  listenTo = (pathname: string) => (location: Location) => {
    this.currentLocation = location;
    const isLocationMatches = location.pathname === pathname;
    if (isLocationMatches && this._hasSearchChanged() && this._onSearchChange) {
      this._onSearchChange(this.prevLocation, location);
    } else if (this._hasPathnameChanged() && this._onPathnameChange) {
      this._onPathnameChange(this.prevLocation, location);
    }
    this.currentLocation = undefined;
    this.prevLocation = location;
  };

  _hasSearchChanged = () => {
    const isSearchChanged =
      !!this.currentLocation &&
      !!this.prevLocation &&
      this.currentLocation.search !== this.prevLocation.search;
    const isNewLocation = !this.prevLocation && !!this.currentLocation;
    return isSearchChanged || isNewLocation;
  };

  _hasPathnameChanged = () =>
    (this.prevLocation || {}).pathname !== (this.currentLocation || {}).pathname;

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
