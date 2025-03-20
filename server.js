import nodeFetch from 'node-fetch';
global.fetch = nodeFetch;
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import { sql } from '@vercel/postgres';
sql.fetch = nodeFetch;
import express from 'express';
import indexHandler from './api/index.js';
import passengersHandler from './api/passengers.js';
import { initializeDatabase, testDatabaseConnection } from './lib/db.js';

const app = express();
const port = process.env.PORT || 3000;

// Update CORS configuration
const corsOptions = {
  origin: ['https://flybuddyprod.vercel.app', 'http://localhost:4000', "https://www.maccopypasta.com/", "https://skymates.co", "https://www.skymates.co"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => indexHandler(req, res));

app.get('/api/passengers', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM passengers`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /api/passengers:', error.stack);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/passengers', async (req, res) => {
  try {
    const { name, age, type, date, fromCity, toCity, phone, email, airlines, comments } = req.body;
    const generateRandomId = () => Math.floor(10000 + Math.random() * 90000).toString();
    const id = generateRandomId();
    const result = await sql`
      INSERT INTO passengers (id, name, age, type, date, "fromCity", "toCity", phone, email, airlines, comments)
      VALUES (${id}, ${name}, ${age}, ${type}, ${date}, ${fromCity}, ${toCity}, ${phone}, ${email}, ${airlines}, ${comments})
      RETURNING id
    `;
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error in POST /api/passengers:', error.stack);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.options('*', cors(corsOptions));

async function startServer() {
  try {
    await initializeDatabase();
    await testDatabaseConnection();
    
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;