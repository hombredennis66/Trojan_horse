import express from 'express';
import { generateChatResponse } from '../lib/ai-gateway.js';

const router = express.Router();

// Handle incoming chat inquiries from the dashboard UI
router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const aiResponse = await generateChatResponse(message, history || []);
    return res.json({ response: aiResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
