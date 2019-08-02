"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Syncer {
  constructor(pathname, actionCreator, selector, options) {
    _defineProperty(this, "pathname", void 0);

    _defineProperty(this, "actionCreator", void 0);

    _defineProperty(this, "selector", void 0);

    _defineProperty(this, "options", void 0);

    this.pathname = pathname;
    this.actionCreator = actionCreator;
    this.selector = selector;
    this.options = options || {};
  }

}

var _default = Syncer;
exports.default = _default;