const express = require('express');
const sql = require('mssql');
require('dotenv').config(); // Load .env variables

// Azure SQL Database configuration from environment variables
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

const app = express();
const port = 3000;

// Connect to the database and query data
async function getData() {
    try {
        // Connect to the database
        await sql.connect(config);
        const result = await sql.query`SELECT Username, password, description FROM [User]`;
        return result.recordset; // Return the queried data
    } catch (err) {
        console.error('SQL error', err);
        return [];
    }
}

// Handle the root request
app.get('/', async (req, res) => {
    const data = await getData();
    res.send(`<h1>User Data</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
