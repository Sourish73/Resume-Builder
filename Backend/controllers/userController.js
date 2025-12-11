import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//GENERATE TOKEN
const generateToken = (userId)=>{
    return jwt.sign({id : userId}, process.env.JWT_SECRET,{expiresIn : '7d'})
}


export const registerUser = async(req,res)=>{
    try{
        console.log("REQ BODY:", req.body);
        const{name, email,password} = req.body;
        //CHECK USER EXIST OR NOT
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(409).json({message : "User already Exist"})
        }
        if(!password || password.length < 8){
            return res.status(400).json({ success : false, message : "Password must be atleast 8 characters"})
        }
        //HASHING PASSWORD
         const salt = await bcrypt.genSalt(10);
         const hashedpassword = await bcrypt.hash(password,salt);

         const user = await User.create({
            name,
            email,
            password : hashedpassword,
         })
         res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
         })
    }
    catch(error){
     res.status(500).json({
        message : "Server Error",
        error : error.message
     })
    }
}
//LOGIN 
export const loginUser = async(req,res)=>{
    try{
        const{email,password} = req.body;
        
        // Input validation
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message : "Invalid email or password"}) // ✅ Changed to 401
        }
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
           return res.status(401).json({message : "Invalid email or password"}) // ✅ Changed to 401
        }
        
        res.status(200).json({ // ✅ Changed to 200 (success)
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
         })
    }
    catch(error){
        console.error("Login error:", error);
        res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}
export const getUserProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({message : "User not found"})
        }
        res.json(user)
    }
    catch(error){
        res.status(500).json({
        message : "Server Error",
        error : error.message
    })
}
}
