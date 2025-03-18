import { Request, Response } from "express";
import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  const { input } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a wise medieval wizard who helps with ingredient substitutions.' },
          { role: 'user', content: input },
        ],
        max_tokens: 150,
        n: 1,
        stop: ['\n', 'User:', 'AI:'],
      }),
    });

    const data = await response.json() as { choices: { message: { content: string } }[] };
    if (data.choices && data.choices.length > 0) {
      const aiMessage = data.choices[0].message.content.trim();
      res.json({ message: aiMessage });
    } else {
      res.status(500).json({ error: 'No choices found in the response.' });
    }
  } catch (error) {
    console.error('Error fetching AI response:', error);
    res.status(500).json({ error: 'Error fetching AI response.' });
  }
};