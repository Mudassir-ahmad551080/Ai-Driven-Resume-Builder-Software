import ai from "../config/ai.js";
import Resume from "../models/ResumeMode.js";

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

        // 1. Strict Resume Validation
        const validationPrompt = `
        Analyze if the following text is a professional resume or CV.
        It should contain typical resume sections like Experience, Education, or Skills.
        If it is NOT a resume (e.g., it's a random story, a letter, a list of groceries, or gibberish), respond with "NOT_A_RESUME".
        Otherwise, respond with "IS_A_RESUME".

        Text:
        ${resumeText.slice(0, 1000)}
        `;

        const validationResponse = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [{ role: "user", content: validationPrompt }],
            temperature: 0,
        });

        if (validationResponse.choices[0].message.content.includes("NOT_A_RESUME")) {
            return res.status(400).json({ message: "The uploaded file does not appear to be a valid resume. Please upload a professional CV." });
        }

        // 2. Artificial 10-second processing delay
        await new Promise(resolve => setTimeout(resolve, 10000));

        // ✅ Truncate resume to ~3000 chars to leave room for the response
        const truncatedResume = resumeText.slice(0, 3000);

        const systemPrompt = `
        You are a brutal, high-standard ATS (Applicant Tracking System) and a cynical Fortune 500 Hiring Manager.
        Your goal is to find every single flaw in the provided resume. Be extremely critical.

        SCORING LOGIC (Deduction Model):
        - Start at 100.
        - Deduct 10-20 points if there are no quantifiable metrics (%, $, numbers) in the experience section.
        - Deduct 10 points if action verbs are generic (e.g., "helped", "managed", "worked on") instead of powerful (e.g., "orchestrated", "spearheaded", "optimized").
        - Deduct 10 points for vague professional summaries or "objective" statements.
        - Deduct 5 points for each missing core skill expected for the role described.
        - A score of 90+ is RESERVED ONLY for world-class, perfectly optimized resumes. Most "good" resumes should fall between 60-80.

        You MUST return ONLY a valid JSON object. No explanation, no markdown, no extra text.
        Return exactly this structure:
        {
            "score": <number 0-100>,
            "summary": "<a critical one-sentence summary of why the score is what it is>",
            "strengths": ["<point>", "<point>", "<point>"],
            "weaknesses": ["<point>", "<point>", "<point>"],
            "pro_tips": ["<high-impact tip>", "<high-impact tip>", "<high-impact tip>"]
        }
        `;

        const response = await ai.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Resume Text:\n${truncatedResume}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 1024,
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
        You are Alex, a professional HR interviewer. You have just reviewed the candidate's resume.
        Your job is to ask 7 targeted, professional interview questions — one at a time.
        Mix warmup, behavioral, and technical questions based on their resume.

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
            You are Alex, a professional HR interviewer.
            You have the candidate's resume and the full interview transcript.
            Generate a final structured evaluation.

            STRICT OUTPUT RULE: Return ONLY a valid JSON object. No markdown, no extra text.
            Return exactly:
            {
                "score": <number 0-100>,
                "grade": "<A / B / C / D / F>",
                "performance": "<Excellent / Good / Average / Needs Improvement>",
                "hiringRecommendation": "<Strong Hire / Hire / Consider / Do Not Hire>",
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
        You are Alex, a professional HR interviewer conducting a live interview.
        You have the candidate's resume and the conversation so far.
        Acknowledge their last answer naturally before asking the next question.

        STRICT OUTPUT RULE: Return ONLY a valid JSON object. No markdown, no extra text.
        Return exactly:
        {
            "acknowledgment": "<1-sentence response to their last answer — react naturally like a real interviewer>",
            "question": "<Question ${nextQuestionNumber} of ${TOTAL_QUESTIONS}: the next interview question>",
            "questionContext": "<short 1-line reason for this question>"
        }

        RULES:
        - If they skipped or said they don't know: acknowledge briefly and move on without dwelling on it.
        - Mix warmup, behavioral, and technical questions.
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



// ... existing exports