import express from 'express';
import chatRouter from './src/routes/chat.js';

const app = express();
app.use(express.json());

// Mount the chat router
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
