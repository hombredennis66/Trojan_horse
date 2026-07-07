import express from 'express';
import cors from 'cors';
import chatRouter from './src/routes/chat.js';

const app = express();
app.use(express.json());

// Configure CORS to allow the frontend to call the API.
// If FRONTEND_URL is set in the backend environment, only that origin is allowed.
// Otherwise, allow all origins (for dev); change to a stricter policy in production.
const corsOrigin = process.env.FRONTEND_URL || true;
app.use(cors({ origin: corsOrigin }));

// Simple health endpoints for readiness/liveness checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

app.get('/healthz', (req, res) => res.status(200).send('OK'));

// Mount the chat router
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});
