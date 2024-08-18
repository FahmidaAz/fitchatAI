import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "You are a compassionate and knowledgeable AI chatbot specializing in health and wellbeing. Your primary goal is to provide accurate, supportive, and actionable advice on topics such as mental health, physical fitness, nutrition, stress management, and general wellness. Always prioritize the user's safety and wellbeing, offering encouragement and positivity. Avoid making medical diagnoses or prescribing treatments, and always recommend consulting with a healthcare professional for personalized medical advice. Your tone should be warm, empathetic, and respectful, ensuring the user feels heard and understood.";

// Function to check if a message is related to health and wellbeing
function isHealthAndWellbeingRelated(message) {
  const keywords = ['health', 'wellbeing', 'mental', 'fitness', 'nutrition', 'stress', 'wellness', 'exercise', 'diet', 'therapy', 'meditation', 'self-care'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

// POST function to handle incoming requests
export async function POST(req) { 
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Check if the incoming message is related to health and wellbeing
  if (!data.some(msg => isHealthAndWellbeingRelated(msg.content))) {
    const responseMessage = "I'm sorry, but I can only help with health and wellbeing topics. Please ask me questions related to mental health, physical fitness, nutrition, stress management, or general wellness.";
    return new NextResponse(responseMessage, { status: 200 }); // Respond with a suggestion for related topics
  }

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
