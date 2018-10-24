"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Syncer = function Syncer(pathname, actionCreator, selector, options) {
  _classCallCheck(this, Syncer);

  this.pathname = pathname;
  this.actionCreator = actionCreator;
  this.selector = selector;
  this.options = options || {};
};

exports.default = Syncer;