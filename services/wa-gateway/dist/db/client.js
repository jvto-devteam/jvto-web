"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg");
const config_1 = require("../config");
exports.pool = new pg_1.Pool({
    connectionString: config_1.config.databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
});
async function query(sql, params = []) {
    return exports.pool.query(sql, params);
}
