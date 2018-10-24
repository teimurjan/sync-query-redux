"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HistoryListener = function () {
  function HistoryListener() {
    _classCallCheck(this, HistoryListener);

    this.prevLocation = undefined;
    this.location = undefined;
    this._onPathnameChange = undefined;
    this._onSearchChange = undefined;
    this.listenPathname.bind(this);
    this._hasSearchChanged.bind(this);
    this.setOnPathnameChange.bind(this);
    this.setOnSearchChange.bind(this);
  }

  _createClass(HistoryListener, [{
    key: "listenPathname",
    value: function listenPathname(pathname) {
      return function (location) {
        this.location = location;
        if (location.pathname === pathname) {
          if (this._hasSearchChanged() && this._onSearchChange) {
            this._onSearchChange(this.prevLocation, location);
          }
        } else if ((this.prevLocation || {}).pathname === location.pathname && this._onPathnameChange) {
          this._onPathnameChange(this.prevLocation, location);
        }
        this.location = undefined;
        this.prevLocation = location;
      };
    }
  }, {
    key: "_hasSearchChanged",
    value: function _hasSearchChanged() {
      var isSearchChanged = !!this.location && !!this.prevLocation && this.location.search !== this.prevLocation.search;
      var isNewLocation = !this.prevLocation && !!this.location;
      return isSearchChanged || isNewLocation;
    }
  }, {
    key: "setOnPathnameChange",
    value: function setOnPathnameChange(cb) {
      this._onPathnameChange = cb;
    }
  }, {
    key: "setOnSearchChange",
    value: function setOnSearchChange(cb) {
      this._onSearchChange = cb;
    }
  }]);

  return HistoryListener;
}();

exports.default = HistoryListener;