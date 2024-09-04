import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';

// Initialize dotenv
config();

// Initialize the Neon client
const sql = neon(process.env.DATABASE_URL!);

// Create an Express application
const app = express();

// Use CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint for handling sign-in
app.post('/signin', async (req: Request, res: Response) => {
  try {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    // Parse the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Execute the query
    const result = await sql`
      SELECT id, 
             first_name, 
             last_name, 
             email, 
             password 
      FROM users
      WHERE email = ${email} 
      AND password = ${password};
    `;

    if (result.length === 0) {
      // If no matching user found
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (result.length === 1) {
      // If no matching user found
     console.log("Successful authentication");
    }

    const user = result[0];

    // Successful authentication
    return res.status(200).json({ 
      message: 'Sign-in successful', 
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});