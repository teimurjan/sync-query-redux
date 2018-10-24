

class HistoryListener {

  constructor() {
    this.listenTo = pathname => location => {
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

    this._hasSearchChanged = () => {
      const isSearchChanged = !!this.currentLocation && !!this.prevLocation && this.currentLocation.search !== this.prevLocation.search;
      const isNewLocation = !this.prevLocation && !!this.currentLocation;
      return isSearchChanged || isNewLocation;
    };

    this._hasPathnameChanged = () => (this.prevLocation || {}).pathname !== (this.currentLocation || {}).pathname;

    this.setOnPathnameChange = cb => {
      this._onPathnameChange = cb;
    };

    this.setOnSearchChange = cb => {
      this._onSearchChange = cb;
    };

    this.prevLocation = undefined;
    this.currentLocation = undefined;
    this._onPathnameChange = undefined;
    this._onSearchChange = undefined;
  }

}


export default HistoryListener;