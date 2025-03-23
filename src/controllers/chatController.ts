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

export const imageWithAi = async (req: Request, res: Response): Promise<void> => {
  const { recipeName } = req.body;
  const prompt = `Generate a high-quality image of a delicious ${recipeName}, part of a medieval feast on ornate plates, featuring golden goblets, wooden tables with intricate carvings, warm candlelight, and realistic textures. Include rich color tones and an artistic, painterly style.`;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '512x512',
      }),
    });

    const data = await response.json() as { data: { url: string }[] };
    const imageUrl = data.data[0]?.url;
    console.log(imageUrl);
    if (!imageUrl) {
      res.status(500).json({ error: 'Failed to generate image: imageUrl is undefined' });
      return;
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error generating image' });
  }
};

export const parseRecipe = async (req: Request, res: Response): Promise<void> => {
  const { rawText } = req.body;

  const prompt = `
  Extract the following details from the raw recipe text:
  - Name
  - Description
  - Ingredients (quantity, unit, description)
  - Instructions
  - Nutrition (calories, macronutrients)
  - Prep time
  - Difficulty (EASY, INTERMEDIATE, HARD)
  - Meal type

  Raw recipe text:
  ${rawText}
  Output the details in the following JSON format without triple backticks:
  {
      "name": "string",
      "description": "string",
      "image": null,
      "difficulty": "string",
      "prep_time": int,
      "instructions": ["string"],
      "nutrition": {
          "calories": int,
          "macronutrients": {
              "fat": {"unit": "string", "amount": int, "percentage": int},
              "carbs": {"unit": "string", "amount": int, "percentage": int},
              "protein": {"unit": "string", "amount": int, "percentage": int}
          }
      },
      "meal_type": ["string"],
      "ingredients": {
          "ingredient_name": {"quantity": int, "unit": "string", "description": "string"}
      }
  }
  `;

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
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json() as { choices: { message: { content: string } }[] };
    const messageContent = data.choices[0]?.message?.content?.trim();
    if (!messageContent) {
      res.status(500).json({ error: 'Failed to parse recipe: response content is null or undefined' });
      return
    }

    // Remove any triple backticks from the response
    const cleanedContent = messageContent.replace(/```json|```/g, '');

    try {
      const recipe = JSON.parse(cleanedContent);
      res.json(recipe);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Failed to parse recipe: invalid JSON format' });
    }
  } catch (error) {
    console.error('Error parsing recipe:', error);
    res.status(500).json({ error: 'Error parsing recipe' });
  }
};