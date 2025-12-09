import { GoogleGenAI } from "@google/genai";

interface GenerateParams {
  prompt: string;
  inputImage?: string; // base64
  inputImages?: string[]; // base64 array
}

interface EditParams {
  prompt: string;
  images: string[]; // base64 array
}

export async function generateImage(params: GenerateParams) {
  const { prompt, inputImage, inputImages } = params;

  // The API key must be obtained exclusively from the environment variable process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use flash image model for general tasks
  const model = "gemini-2.5-flash-image";

  const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt }
  ];

  const imagesToProcess = inputImages || (inputImage ? [inputImage] : []);

  for (const image of imagesToProcess) {
    if (image && image.startsWith('data:')) {
      const [header, base64Data] = image.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      contentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }
  }

  const response = await ai.models.generateContent({
    model,
    contents: contentParts,
  });

  // Extract image from response
  // Gemini 2.5 Flash Image returns image in inlineData
  let imageData = null;
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        break;
      }
    }
  }

  if (!imageData) {
    throw new Error("No image generated from Gemini.");
  }

  return {
    success: true,
    imageUrl: `data:image/png;base64,${imageData}`,
    description: prompt
  };
}

export async function editImage(params: EditParams) {
  const { prompt, images } = params;

  // The API key must be obtained exclusively from the environment variable process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-image";

  const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt }
  ];

  for (const image of images) {
    if (image && image.startsWith('data:')) {
      const [header, base64Data] = image.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      contentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }
  }

  const response = await ai.models.generateContent({
    model,
    contents: contentParts
  });

  let imageData = null;
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        break;
      }
    }
  }

  if (!imageData) {
    throw new Error("No edited image returned.");
  }

  return {
    success: true,
    imageUrl: `data:image/png;base64,${imageData}`,
    description: `Edited: ${prompt}`
  };
}