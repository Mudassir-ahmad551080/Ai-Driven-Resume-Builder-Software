
// controoler for creating the new resume

import imagekit from "../config/imagekit.js";
import Resume from "../models/ResumeMode.js";
import fs from "fs";

export const createResume = async (req, res) => {
    try {
        const userId = req.userId
        const { title } = req.body;
        //create new resume
        const newResume = await Resume.create({ userId, title });
        //return the success message
        return res.status(201).json({ message: "Resume created successfuly", resume: newResume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for to delete resume

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId
        const { resumeId } = req.params;
        await Resume.findOneAndDelete({ userId, _id: resumeId });

        return res.status(200).json({ message: "Resume Deleted" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// contoller for to get the user data

export const getRusumeById = async (req, res) => {
    try {
        const userId = req.userId
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(400).json({ message: "Resume not found" })
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// get resume by id public

export const getResumeByIdPublic = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(400).json({ message: "Resume not found" })
        }

        return res.status(200).json(resume);

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// update the resume 

// import imagekit from "../config/imagekit.js";
// import Resume from "../models/ResumeMode.js";
// import fs from "fs";

// ... createResume, deleteResume, getRusumeById ...

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, title, removeBackground } = req.body;
        const image = req.file;

        // ... [Keep Title Update Logic] ...

        if (!resumeData) {
            return res.status(400).json({ message: "No resume data provided for update" });
        }

        let resumeDataCopy = typeof resumeData === 'string'
            ? JSON.parse(resumeData)
            : JSON.parse(JSON.stringify(resumeData));

        // 2. Handle Image Upload
        if (image) {
            const imageBufferData = fs.createReadStream(image.path);

            // Handle the boolean check explicitly (FormData sends strings like "yes" or "true")
            const isRemoveBg = removeBackground === 'yes' || removeBackground === 'true';

            try {
                const response = await imagekit.files.upload({
                    file: imageBufferData,
                    // ✅ FIX 1: Add Date.now() to make filename unique (Busts Browser Cache)
                    fileName: `resume_${resumeId}_${Date.now()}.png`, 
                    folder: 'user-resumes',
                    transformation: {
                        // ✅ FIX 2: Explicitly use the check we made above
                        pre: `w-300,h-300${isRemoveBg ? ',e-bg-remove' : ''}`
                    }
                });

                if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
                resumeDataCopy.personal_info.image = response.url;

                // Delete local file
                fs.unlink(image.path, (err) => {
                    if (err) console.error("Failed to delete local image:", err);
                });

            } catch (uploadError) {
                console.error("ImageKit Upload Failed:", uploadError);
                return res.status(403).json({
                    message: "Image Upload Failed",
                    details: uploadError.message
                });
            }
        }

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true });
        return res.status(200).json({ message: "Saved Successfully", resume });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: error.message });
    }
};