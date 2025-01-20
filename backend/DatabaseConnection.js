import mysql from 'mysql2/promise';
import fs from 'fs';

class DatabaseConnection {
    static #instance = null;
    static #initializing = false;

    static async getInstance() {
        if (DatabaseConnection.#instance) {
            return DatabaseConnection.#instance;
        }

        if (DatabaseConnection.#initializing) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (DatabaseConnection.#instance) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 50);
            });
            return DatabaseConnection.#instance;
        }

        DatabaseConnection.#initializing = true;
        DatabaseConnection.#instance = await this.initDatabase();
        DatabaseConnection.#initializing = false;

        return DatabaseConnection.#instance;
    }

    static async initDatabase() {
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'admin',
                password: 'admin',
                database: 'tp4_quality_software',
                port: 3306
            });

            await this.executeFile(connection, 'backend/assets/dropTables.sql');
            await this.executeFile(connection, 'backend/assets/createTables.sql');

            console.log("Database initialized");
            return connection;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async executeFile(connection, file, separator = ';') {
        console.log(`Executing file: ${file}`);
        const queries = fs.readFileSync(file, 'utf-8');
        for (let query of queries.split(separator)) {
            if (query.trim() !== '') {
                await connection.query(query);
            }
        }
    }
}

export default DatabaseConnection;