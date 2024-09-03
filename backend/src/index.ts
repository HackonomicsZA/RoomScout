import express from 'express';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';
require('dotenv').config();

const app = express();
const port = 5000;

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!);
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).send('Error querying the database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
