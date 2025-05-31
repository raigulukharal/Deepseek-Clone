
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";


export const login = async (req, res) => {
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const tokenID={
            id:user._id,
          
        }
        
        const token = await jwt.sign(tokenID,"asdfghjklzxcvbnm", {expiresIn: "1D"});
        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: false, // ✅ true only on production (HTTPS)
            sameSite: "Lax",
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        }).status(200).json({
            message:`Weclome back ${user.name}`,
            user,
            token,
            success: true,
           
        }
     
        )
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    console.log("Logout route hit");
    return res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Logout successfully",
    });
};


export const signup = async (req, res) => {  
    try {
        const {firstname,lastname ,email,password}=req.body
        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }

        const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                firstname,
                lastname,
                email,
                password:hashPassword
            })
            return res.status(201).json({
                message: "User registered successfully", 
                user,
                success: true,
            })
        }
    catch (error) {
            console.log(error)
        }
    }