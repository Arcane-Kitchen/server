import { Request, Response, NextFunction } from "express";
import fetch from 'node-fetch';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const generateImage = async (req: Request, res: Response, next: NextFunction) => {
  const { recipeName } = req.body;

  if (!recipeName) {
    res.status(400).json({ error: 'Recipe name is required' });
    return
}

  try {
    const prompt = `Create an image of the recipe "${recipeName}" served on a medieval plate.`;

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: '512x512',
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate image: imageUrl is undefined');
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const contentType = imageResponse.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'image/png');
    imageResponse.body.pipe(res);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};