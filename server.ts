// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth_routes';
import sequelize from './config/db.config';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;

sequelize
  .sync() // Sync database models
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
