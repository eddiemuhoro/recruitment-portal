import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const generateChatResponse = async (messages: ChatMessage[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};

export const generateJobRecommendations = async (userProfile: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a job recommendation assistant. Analyze the user profile and suggest relevant job opportunities."
        },
        {
          role: "user",
          content: userProfile
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating job recommendations:', error);
    throw error;
  }
};

export const enhanceSearchQuery = async (query: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a search query enhancement assistant. Convert natural language queries into optimized search terms."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error enhancing search query:', error);
    throw error;
  }
}; 