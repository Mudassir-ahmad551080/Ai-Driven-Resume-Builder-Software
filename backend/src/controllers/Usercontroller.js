// controllder for the user registerUseration endpoint

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import Resume from "../models/ResumeMode.js";
import generateToken from "../util/generateToken.js";



//Post : /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // check if user is already exists
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // creat a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = generateToken(newUser._id);
        newUser.password = undefined; // hide password
        return res.status(201).json({ message: "User registered successfully", token,user: newUser });
    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(400).json({ message: error.message });
    }
}

// controller for user login
export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // check if user is already exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // check if password is correct
        if(!user.comparePassword(password)){
         return res.status(400).json({ message: "Invalid email or password" });
        }

        // return succes message
        const token = generateToken(user._id);
        user.password = undefined
        // creat a new user
       
        return res.status(200).json({ message: "Login Succecful", token,user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// function to get the user data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        // chekc if user is exist
        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // return user
        user.password = undefined;
        return res.status(200).json({ user });
    } catch (error) {
         return res.status(400).json({ message: error.message });
    }
}

// controler for geting Resume


export const getUserResume = async(req,res)=>{
    try {
         const userId = req.userId;
        //  return user resume
        const resumes = await  Resume.find({userId});
        return res.status(200).json({resumes})
    } catch (error) {
         return res.status(400).json({ message: error.message });
    }
}

