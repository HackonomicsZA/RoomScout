import express, {Router, Request, Response } from 'express';
import { Client } from '@neondatabase/serverless'; // Adjust import if necessary
import dotenv from 'dotenv';
import e from 'express';

const router = Router();
dotenv.config();

const app = express();
const port = 5000;

// Initialize Neon client
const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

app.use(express.json());

// TypeScript interface for User data
interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Endpoint to create a new user
app.post('/users', async (req: Request, res: Response) => {
  const { first_name, last_name, email, password }: User = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await client.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default router;