"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pollyfils = require("./pollyfils");

var _pollyfils2 = _interopRequireDefault(_pollyfils);

var _plainSync = require("./plain-sync");

var _plainSync2 = _interopRequireDefault(_plainSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { plainSync: _plainSync2.default };