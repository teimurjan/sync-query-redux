"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasSearchChanged = exports.hasSearchChanged = function hasSearchChanged(prevLocation, nextLocation) {
  return (nextLocation || {}).search !== (prevLocation || {}).search;
};
var hasPathnameChanged = exports.hasPathnameChanged = function hasPathnameChanged(prevLocation, nextLocation) {
  return (nextLocation || {}).pathname !== (prevLocation || {}).pathname;
};

var HistoryListener = function HistoryListener() {
  var _this = this;

  _classCallCheck(this, HistoryListener);

  this.getListenerFunc = function (pathname) {
    return function (location) {
      _this.currentLocation = location;
      var isPathnameMatches = location.pathname === pathname;
      if (isPathnameMatches && hasSearchChanged(_this.prevLocation, _this.currentLocation) && _this._onSearchChange) {
        _this._onSearchChange(_this.prevLocation, location);
      } else if (hasPathnameChanged(_this.prevLocation, _this.currentLocation) && _this._onPathnameChange) {
        _this._onPathnameChange(_this.prevLocation, location);
      }
      _this.currentLocation = undefined;
      _this.prevLocation = location;
    };
  };

  this.setOnPathnameChange = function (cb) {
    _this._onPathnameChange = cb;
  };

  this.setOnSearchChange = function (cb) {
    _this._onSearchChange = cb;
  };

  this.prevLocation = undefined;
  this.currentLocation = undefined;
  this._onPathnameChange = undefined;
  this._onSearchChange = undefined;
};

exports.default = HistoryListener;