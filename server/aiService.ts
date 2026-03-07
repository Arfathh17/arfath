import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

export const analyzeResume = async (resumeText: string) => {
  const model = "gemini-3.1-pro-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the following resume text and provide a structured JSON response.
    Resume Text: ${resumeText}
    
    The response must be in JSON format with the following schema:
    {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "technicalSkills": string[],
      "softSkills": string[],
      "experience": string[],
      "education": string[],
      "improvementSuggestions": string[],
      "suggestedJobRoles": string[],
      "skillsToLearn": string[]
    }`,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getCareerAdvice = async (userMessage: string, history: { role: string; content: string }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a professional career advisor. Help users with career advice, resume tips, and job search strategies.",
    },
  });

  // Add history to chat if needed, but for simplicity we'll just send the message
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};

export const generateInterviewQuestion = async (resumeAnalysis: any, type: string, previousQuestions: string[]) => {
  const model = "gemini-3.1-pro-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Based on this resume analysis: ${JSON.stringify(resumeAnalysis)}, generate one ${type} interview question.
    Avoid these previous questions: ${previousQuestions.join(", ")}.
    Return only the question text.`,
  });

  return response.text;
};

export const evaluateInterviewAnswer = async (question: string, answer: string) => {
  const model = "gemini-3.1-pro-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Evaluate this interview answer.
    Question: ${question}
    Answer: ${answer}
    
    Provide a JSON response:
    {
      "score": number (0-10),
      "feedback": string,
      "improvement": string
    }`,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
};
