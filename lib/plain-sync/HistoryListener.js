"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.hasPathnameChanged = exports.hasSearchChanged = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const hasSearchChanged = (prevLocation, nextLocation) => (nextLocation || {}).search !== (prevLocation || {}).search;

exports.hasSearchChanged = hasSearchChanged;

const hasPathnameChanged = (prevLocation, nextLocation) => (nextLocation || {}).pathname !== (prevLocation || {}).pathname;

exports.hasPathnameChanged = hasPathnameChanged;

class HistoryListener {
  constructor() {
    _defineProperty(this, "prevLocation", void 0);

    _defineProperty(this, "currentLocation", void 0);

    _defineProperty(this, "_onPathnameChange", void 0);

    _defineProperty(this, "_onSearchChange", void 0);

    _defineProperty(this, "getListenerFunc", pathname => location => {
      this.currentLocation = location;
      const isPathnameMatches = location.pathname === pathname;

      if (isPathnameMatches && hasSearchChanged(this.prevLocation, this.currentLocation) && this._onSearchChange) {
        this._onSearchChange(this.prevLocation, location);
      } else if (hasPathnameChanged(this.prevLocation, this.currentLocation) && this._onPathnameChange) {
        this._onPathnameChange(this.prevLocation, location);
      }

      this.currentLocation = undefined;
      this.prevLocation = location;
    });

    _defineProperty(this, "setOnPathnameChange", cb => {
      this._onPathnameChange = cb;
    });

    _defineProperty(this, "setOnSearchChange", cb => {
      this._onSearchChange = cb;
    });

    this.prevLocation = undefined;
    this.currentLocation = undefined;
    this._onPathnameChange = undefined;
    this._onSearchChange = undefined;
  }

}

var _default = HistoryListener;
exports.default = _default;