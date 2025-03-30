import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);


app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack || err); 
  const statusCode = err.statusCode || 500; 
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

