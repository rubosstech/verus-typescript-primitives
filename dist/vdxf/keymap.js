"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttestationDataVdxfidMap = exports.attestationDataKeys = exports.keymap = void 0;
const keylist = require("./keys");
const AttestationData = require("./classes/AttestationData");
exports.keymap = Object.keys(keylist).reduce((obj, item) => { obj[keylist[item].vdxfid] = keylist[item]; return obj; }, {});
exports.attestationDataKeys = Object.keys(AttestationData).reduce((obj, item) => { obj[AttestationData[item].vdxfid] = AttestationData[item]; return obj; }, {});
exports.AttestationDataVdxfidMap = AttestationData.AttestationVdxfidMap;
