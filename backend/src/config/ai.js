import OpenAI from "openai";
import dotenv from "dotenv";

// 1. MUST BE FIRST
dotenv.config(); 

// 2. DEBUG: This will print in your terminal (not Postman)
// If this says "MISSING", your .env file is not in the root folder
console.log("GROQ KEY STATUS:", process.env.GROQ_API_KEY ? "LOADED" : "MISSING");

const ai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY, 
    baseURL: process.env.GROQ_BASE_URL 
});

export default ai;