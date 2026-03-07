import ai from "../config/ai.js";
import Resume from "../models/ResumeMode.js";
import { createRequire } from "module";   // ← line 1 (ESM built-in)
const require = createRequire(import.meta.url);  // ← line 2 (creates require)
const pdfParse = require("pdf-parse");    // ← line 3 (now require works)

// Controller to enhance Professional Summary
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { usercontent } = req.body;
        if (!usercontent) {
            return res.status(400).json({ message: "User content is required" });
        }
        
        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: "You are an expert resume writer. Rewrite the following professional summary to be impactful, professional, and ATS-friendly and provide the answer in 2-3 sentences. Do not include introductory text like 'Here is the summary', just provide the refined text." },
                { role: "user", content: usercontent }
            ],
            temperature: 0.7, // Adds a little creativity
        });
        
        const enhancedSummary = response.choices[0].message.content;
        return res.status(200).json({ enhancedSummary });

    } catch (error) {
        console.error("AI API Error:", error);
        return res.status(500).json({ message: "AI Service Error", details: error.message });
    }
}

// Controller to enhance Job Descriptions
export const enhanceJobDescription = async (req, res) => {
    try {
        const { usercontent } = req.body;
        if (!usercontent) {
            return res.status(400).json({ message: "Job description is required" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: "You are an expert resume writer. Enhance the following job description bullet point to be result-oriented, compelling, and ATS-friendly. Keep it to 2-3 sentences. Output ONLY the refined text." },
                { role: "user", content: usercontent }
            ],
            temperature: 0.7,
        });

        const enhancedJobDescription = response.choices[0].message.content;
        return res.status(200).json({ enhancedJobDescription });

    } catch (error) {
        console.error("AI Job Desc Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

// Controller to upload Resume (Extract Data to JSON)
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ message: "Resume text content is missing" });
        }

        const systemPrompt = `You are an expert AI data extractor. You must extract data from the resume text and return it in strict JSON format.`;
        
        const userPrompt = `
        Analyze this resume text:
        ---
        ${resumeText}
        ---
        
        Return a valid JSON object matching this structure exactly. Do not add markdown formatting like \`\`\`json.
        {
          "professional_summary": "string",
          "skills": ["string"],
          "personal_info": {
             "full_name": "string",
             "profession": "string",
             "email": "string",
             "linkedin": "string",
             "website": "string",
             "phone": "string",
             "location": "string"
          },
          "experience": [
             { "company": "string", "position": "string", "description": "string", "start_date": "string", "end_date": "string", "is_current": boolean }
          ],
          "education": [
             { "institute": "string", "degree": "string", "field": "string", "graduation_date": "string", "gpa": "string" }
          ],
          "projects": [
             { "name": "string", "description": "string", "type": "string" }
          ]
        }`;

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            // Groq requires strictly "json_object" for JSON mode
            response_format: { type: "json_object" }, 
            temperature: 0, // 0 is best for extraction tasks to be deterministic
        });

        // Parse the JSON result
        const content = response.choices[0].message.content;
        const extractedData = JSON.parse(content);

        const newResume = await Resume.create({
            userId,
            title,
            ...extractedData
        });

        return res.json({ resumeId: newResume._id });

    } catch (error) {
        console.error("AI Upload Error:", error);
        return res.status(500).json({ message: "Failed to parse resume data", error: error.message });
    }
}

// function to create the resume 
// ... existing imports

// Controller to Generate Full Resume from Chat
export const generateResumeFromChat = async (req, res) => {
    try {
        const { userMessage, currentResume } = req.body;

        if (!userMessage) {
            return res.status(400).json({ message: "Message is required" });
        }

        // 1. Define the Resume Schema (same as before)
        const resumeSchema = `
        {
          "professional_summary": "string",
          "skills": ["string"],
          "personal_info": {
             "full_name": "string", "profession": "string", "email": "string", 
             "linkedin": "string", "website": "string", "phone": "string", "location": "string"
          },
          "experience": [
             { "company": "string", "position": "string", "description": "string", "start_date": "YYYY-MM", "end_date": "YYYY-MM", "is_current": boolean }
          ],
          "education": [
             { "institute": "string", "degree": "string", "field": "string", "graduation_date": "YYYY", "gpa": "string" }
          ],
          "projects": [
             { "name": "string", "description": "string", "type": "string" }
          ]
        }`;

        // 2. Define the WRAPPER Schema (Critical Change)
        // This allows the AI to choose between a 'chat' response or a 'resume' update
        const systemPrompt = `
        You are an expert AI Resume Builder. 
        
        STRICT OUTPUT RULE: You must return a JSON object with this specific structure:
        {
            "responseType": "chat" | "resume_update",
            "message": "string (The text reply to show the user)",
            "resumeData": ${resumeSchema} (OR null if responseType is 'chat')
        }

        LOGIC RULES:
        1. IF the user asks a general question (e.g., "Hello", "How are you", "What is your name", "What is the weather"):
           - Set "responseType": "chat"
           - Set "message": "I am a Resume Builder AI, I can help you create and optimize your resume. Please ask me to create or update your resume with specific details."
           - Set "resumeData": null

        2. IF the user provides resume details or asks to create/update:
           - Set "responseType": "resume_update"
           - Set "message": "I have updated your resume based on your request."
           - Set "resumeData": (The fully populated resume JSON object).

        CONTEXT:
        ${currentResume ? `CURRENT RESUME DATA: ${JSON.stringify(currentResume)}` : "NO EXISTING RESUME. CREATE NEW."}
        
        USER INPUT: "${userMessage}"
        `;

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            response_format: { type: "json_object" }, 
            temperature: 0.5,
        });

        const content = response.choices[0].message.content;
        const generatedData = JSON.parse(content);

        // Return the whole wrapped object
        return res.status(200).json({ success: true, data: generatedData });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return res.status(500).json({ message: "AI Generation Failed", details: error.message });
    }
};

// ... existing imports

// Controller to Analyze Resume
export const analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({ message: "Resume content is required for analysis." });
        }

        // ✅ Truncate resume to ~3000 chars to leave room for the response
        const truncatedResume = resumeText.slice(0, 3000);

        const systemPrompt = `
        You are a strict ATS (Applicant Tracking System) and expert Hiring Manager.
        Analyze the provided resume text.

        You MUST return ONLY a valid JSON object. No explanation, no markdown, no extra text.
        Return exactly this structure:
        {
            "score": <number 0-100>,
            "summary": "<one sentence>",
            "strengths": ["<point>", "<point>", "<point>"],
            "weaknesses": ["<point>", "<point>", "<point>"],
            "improvement_steps": [
                { "section": "<name>", "advice": "<advice>" },
                { "section": "<name>", "advice": "<advice>" },
                { "section": "<name>", "advice": "<advice>" }
            ]
        }

        Scoring Criteria:
        - Quantifiable results (numbers/metrics) in experience.
        - Proper use of action verbs.
        - ATS readability (keywords).
        - Formatting structure (implied by text organization).
        `;

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Resume Text:\n${truncatedResume}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 1024, // ✅ explicit budget for the response
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        return res.status(200).json({ success: true, analysis });

    } catch (error) {
        console.error("Resume Analysis Error:", error);
        return res.status(500).json({ message: "Failed to analyze resume", error: error.message });
    }
};


// Interview Preparation Controller (Placeholder)


// ─────────────────────────────────────────────
//  POST /api/interview/start
//  Body: { resumeText: string }
//  Returns: { question, questionNumber, totalQuestions }
// ─────────────────────────────────────────────
export const startInterview = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ message: "Resume text is required to start the interview." });
        }

        const systemPrompt = `
        You are an expert technical interviewer and career coach.
        You have just read the candidate's resume. Your job is to ask them 7 targeted, professional interview questions — one at a time.
        
        STRICT OUTPUT RULE: Return ONLY a valid JSON object. No markdown, no extra text.
        Return exactly:
        {
            "question": "<the interview question>",
            "questionContext": "<short 1-line reason why you're asking this — e.g., based on their React experience>"
        }

        RULES:
        - Ask Question 1 now. Make it a warm opener based on their most notable skill or experience.
        - Questions must be specific to THEIR resume — not generic.
        - Keep the question concise (1–2 sentences max).
        `;

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here is my resume:\n\n${resumeText.slice(0, 3000)}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
            max_tokens: 300,
        });

        const data = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            success: true,
            question: data.question,
            questionContext: data.questionContext,
            questionNumber: 1,
            totalQuestions: 7,
        });

    } catch (error) {
        console.error("Interview Start Error:", error);
        return res.status(500).json({ message: "Failed to start interview", error: error.message });
    }
};


// ─────────────────────────────────────────────
//  POST /api/interview/respond
//  Body: { resumeText, messages: [{role, content}], questionNumber, userAnswer }
//  Returns: { question, questionNumber } OR { isComplete, result }
// ─────────────────────────────────────────────
export const respondToAnswer = async (req, res) => {
    try {
        const { resumeText, messages, questionNumber, userAnswer } = req.body;

        if (!resumeText || !messages || !questionNumber) {
            return res.status(400).json({ message: "resumeText, messages, and questionNumber are required." });
        }

        const TOTAL_QUESTIONS = 7;
        const isLastQuestion = questionNumber >= TOTAL_QUESTIONS;

        // ── FINAL REPORT: after the last answer ──
        if (isLastQuestion) {
            const systemPrompt = `
            You are a strict interview evaluator and career coach.
            You have the candidate's resume and the full interview transcript.
            Generate a final structured evaluation.
            
            STRICT OUTPUT RULE: Return ONLY a valid JSON object. No markdown, no extra text.
            Return exactly:
            {
                "score": <number 0-100>,
                "grade": "<A / B / C / D / F>",
                "performance": "<Excellent / Good / Average / Needs Improvement>",
                "summary": "<2-sentence overall performance summary>",
                "strengths": ["<strength>", "<strength>", "<strength>"],
                "weaknesses": ["<weakness>", "<weakness>", "<weakness>"],
                "skippedQuestions": <number of questions the user said they don't know or skipped>,
                "tipsToGetHired": [
                    { "tip": "<actionable tip title>", "detail": "<1-sentence explanation, personalized to their resume>" },
                    { "tip": "<actionable tip title>", "detail": "<1-sentence explanation>" },
                    { "tip": "<actionable tip title>", "detail": "<1-sentence explanation>" },
                    { "tip": "<actionable tip title>", "detail": "<1-sentence explanation>" },
                    { "tip": "<actionable tip title>", "detail": "<1-sentence explanation>" }
                ]
            }

            SCORING:
            - Each answered question = up to ~14 points.
            - Skipped/don't-know answers = 0 points.
            - Quality of answers: strong/detailed = full points, vague = half points.
            `;

            const fullConversation = [
                { role: "user", content: `Resume:\n${resumeText.slice(0, 2000)}` },
                ...messages,
                { role: "user", content: userAnswer || "I don't know." }
            ];

            const response = await ai.chat.completions.create({
                model: process.env.GROQ_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...fullConversation
                ],
                response_format: { type: "json_object" },
                temperature: 0.3,
                max_tokens: 1024,
            });

            const result = JSON.parse(response.choices[0].message.content);

            return res.status(200).json({
                success: true,
                isComplete: true,
                result,
            });
        }

        // ── NEXT QUESTION ──
        const nextQuestionNumber = questionNumber + 1;
        const skipped = !userAnswer || userAnswer.trim() === "" || userAnswer.toLowerCase().includes("don't know") || userAnswer.toLowerCase().includes("skip");

        const systemPrompt = `
        You are an expert technical interviewer conducting a live interview.
        You have the candidate's resume and the conversation so far.

        STRICT OUTPUT RULE: Return ONLY a valid JSON object. No markdown, no extra text.
        Return exactly:
        {
            "acknowledgment": "<1-sentence response to their last answer — encouraging if good, gentle if skipped>",
            "question": "<Question ${nextQuestionNumber} of ${TOTAL_QUESTIONS}: the next interview question>",
            "questionContext": "<short 1-line reason for this question>"
        }

        RULES:
        - If they skipped or said they don't know: acknowledge briefly and move on without dwelling on it.
        - The next question must be different from all previous questions.
        - Stay specific to their resume (skills, projects, experience, gaps).
        - Keep the question to 1–2 sentences.
        - Never repeat a question.
        ${skipped ? '- The user just skipped the last question. Acknowledge gently.' : ''}
        `;

        const fullConversation = [
            { role: "user", content: `Resume:\n${resumeText.slice(0, 2000)}` },
            ...messages,
            { role: "user", content: userAnswer || "(skipped)" }
        ];

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                ...fullConversation
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
            max_tokens: 300,
        });

        const data = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            success: true,
            isComplete: false,
            acknowledgment: data.acknowledgment,
            question: data.question,
            questionContext: data.questionContext,
            questionNumber: nextQuestionNumber,
            totalQuestions: TOTAL_QUESTIONS,
        });

    } catch (error) {
        console.error("Interview Respond Error:", error);
        return res.status(500).json({ message: "Failed to process answer", error: error.message });
    }
};


// ─────────────────────────────────────────────
//  POST /api/interview/parse-pdf
//  Body: multipart/form-data — file: PDF
//  Returns: { resumeText }
//  (Optional — use if you want backend PDF parsing)
// ─────────────────────────────────────────────
export const parsePdfResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded." });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ message: "Could not extract text from this PDF." });
        }

        return res.status(200).json({ success: true, resumeText });

    } catch (error) {
        console.error("PDF Parse Error:", error);
        return res.status(500).json({ message: "Failed to parse PDF", error: error.message });
    }
};

// ... existing exports