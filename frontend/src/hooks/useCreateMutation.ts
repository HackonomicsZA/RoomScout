import { useMutation } from '@tanstack/react-query';
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const db = neon('postgresql://eneldb_owner:fBDcMzl26pIy@ep-shiny-bonus-a55ktfq3-pooler.us-east-2.aws.neon.tech/roomscoutdb?sslmode=require');

interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const useCreateMutation = () => {
  return useMutation({
    mutationFn: async (newUser: User) => {
      try {
        // Create a new user in the database
        const query = `
          INSERT INTO users (first_name, last_name, email, password) 
          VALUES ($1, $2, $3, $4) 
          RETURNING *;
        `;
        const values = [newUser.first_name, newUser.last_name, newUser.email, newUser.password];

        const result = await db(query, values);
        
        if (result.length === 0) {
          throw new Error('Failed to create user');
        }

        return result[0];
      } catch (error) {
        throw new Error(`Error: ${(error as Error).message}`);
      }

    }  });};

export default useCreateMutation;
