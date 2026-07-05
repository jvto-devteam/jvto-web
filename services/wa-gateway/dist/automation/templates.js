"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRuleset = loadRuleset;
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
let rulesetCache = null;
function loadRuleset() {
    if (rulesetCache) {
        return rulesetCache;
    }
    const raw = fs_1.default.readFileSync(config_1.config.rulesetPath, "utf8");
    rulesetCache = JSON.parse(raw);
    return rulesetCache;
}
