"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HistoryListener = function HistoryListener() {
  var _this = this;

  _classCallCheck(this, HistoryListener);

  this.listenTo = function (pathname) {
    return function (location) {
      _this.currentLocation = location;
      var isLocationMatches = location.pathname === pathname;
      if (isLocationMatches && _this._hasSearchChanged() && _this._onSearchChange) {
        _this._onSearchChange(_this.prevLocation, location);
      } else if (_this._hasPathnameChanged() && _this._onPathnameChange) {
        _this._onPathnameChange(_this.prevLocation, location);
      }
      _this.currentLocation = undefined;
      _this.prevLocation = location;
    };
  };

  this._hasSearchChanged = function () {
    var isSearchChanged = !!_this.currentLocation && !!_this.prevLocation && _this.currentLocation.search !== _this.prevLocation.search;
    var isNewLocation = !_this.prevLocation && !!_this.currentLocation;
    return isSearchChanged || isNewLocation;
  };

  this._hasPathnameChanged = function () {
    return (_this.prevLocation || {}).pathname !== (_this.currentLocation || {}).pathname;
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