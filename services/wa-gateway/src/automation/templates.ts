import fs from "fs";
import { config } from "../config";
import { Ruleset } from "../types";

let rulesetCache: Ruleset | null = null;

export function loadRuleset(): Ruleset {
  if (rulesetCache) {
    return rulesetCache;
  }

  const raw = fs.readFileSync(config.rulesetPath, "utf8");
  rulesetCache = JSON.parse(raw) as Ruleset;
  return rulesetCache;
}
