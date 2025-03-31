const mongoose = require("mongoose");
require("dotenv").config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = null;
            Database.instance = this;
        }
        return Database.instance;
    }

    async _connect() {
        if (this.connection) return this.connection; 

        try {
            const mongoUri = process.env.MONGODB_URI;
            this.connection = await mongoose.connect(mongoUri, {
                tls: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            });
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error(`MongoDB connection error: ${err}`);
        }

        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        return this.connection;
    }

    async getConnection() {
        if (!this.connection) {
            await this._connect();
        }
        return this.connection;
    }

    async closeConnection() {
        if (this.connection) {
            await mongoose.connection.close();
            this.connection = null;
            console.log("MongoDB connection closed.");
        }
    }
}

const databaseInstance = new Database();
module.exports = databaseInstance;
