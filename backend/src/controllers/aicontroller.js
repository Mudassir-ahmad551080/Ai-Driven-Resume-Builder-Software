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

// ... existing exports