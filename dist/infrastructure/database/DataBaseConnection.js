"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const pg_1 = require("pg");
class DatabaseConnection {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        this.pool = new pg_1.Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    async getClient() {
        return this.pool.connect();
    }
    async query(text, params) {
        const client = await this.getClient();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
    async close() {
        await this.pool.end();
    }
}
exports.DatabaseConnection = DatabaseConnection;
