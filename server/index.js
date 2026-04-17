import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Load product data
const productsPath = path.join(__dirname, 'products.json');
let products = [];

async function loadProducts() {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    products = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

loadProducts();

// API Endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/chat', async (req, res) => {
  const { messages, input } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are an elite, high-end personal shopping assistant for "LuxeBuy", a luxury retail platform. 
Keep your answers concise, elegant, and focused on fashion, accessories, and high-end retail. 
Respond in plain text only. Do not use markdown, bold formatting, bullet points, or asterisks.
Current product catalog includes: ${products.map(p => `${p.name} (${p.price})`).join(', ')}.
Please answer the user's latest query thoughtfully.`;

    const chatHistory = messages
      .slice(1) // Skip welcome message
      .map(m => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
      .join('\n');
    
    const fullPrompt = `${systemPrompt}\n\nChat History:\n${chatHistory}\nClient: ${input}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text.replace(/\*\*/g, '').replace(/\*/g, '') }); // Stripping any accidental markdown
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} (0.0.0.0)`);
});
