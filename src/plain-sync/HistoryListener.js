// @flow
import type { BrowserLocation as Location } from "history/createBrowserHistory";

class HistoryListener {
  prevLocation: ?Location;
  location: ?Location;
  _onPathnameChange: ?(prevLocation: ?Location, location: Location) => any;
  _onSearchChange: ?(prevLocation: ?Location, location: Location) => any;

  constructor() {
    this.prevLocation = undefined;
    this.location = undefined;
    this._onPathnameChange = undefined;
    this._onSearchChange = undefined;
    this.listenPathname.bind(this);
    this._hasSearchChanged.bind(this);
    this.setOnPathnameChange.bind(this);
    this.setOnSearchChange.bind(this);
  }

  listenPathname(pathname: string) {
    return (function(location: Location) {
      this.location = location;
      if (location.pathname === pathname) {
        if (this._hasSearchChanged() && this._onSearchChange) {
          this._onSearchChange(this.prevLocation, location);
        }
      } else if (
        (this.prevLocation || {}).pathname === location.pathname &&
        this._onPathnameChange
      ) {
        this._onPathnameChange(this.prevLocation, location);
      }
      this.location = undefined;
      this.prevLocation = location;
    }).bind(this);
  }

  _hasSearchChanged() {
    const isSearchChanged =
      !!this.location &&
      !!this.prevLocation &&
      this.location.search !== this.prevLocation.search;
    const isNewLocation = !this.prevLocation && !!this.location;
    return isSearchChanged || isNewLocation;
  }

  setOnPathnameChange(
    cb: (prevLocation: ?Location, location: Location) => any
  ) {
    this._onPathnameChange = cb;
  }

  setOnSearchChange(cb: (prevLocation: ?Location, location: Location) => any) {
    this._onSearchChange = cb;
  }
}

export default HistoryListener;
