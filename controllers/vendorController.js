const Vendor=require('../models/Vendor');
const jwt=require(`jsonwebtoken`);
const bcrypt = require('bcrypt');
const dotEnv=require('dotenv');
dotEnv.config();
const secretKey=process.env.whatIsYourName; 

const venderRegister=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const vendorEmail=await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json({message:"Vendor already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newVendor=new Vendor({
            username,
            email,
            password : hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message:"Vendor registered successfully"});
        console.log("registered");
        }catch (error){
            console.log(error);
            res.status(500).json({message:"Server error"});
        }
}
const vendorLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const vendor=await Vendor.findOne({ email });
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})

        res.status(200).json({message:"Login successful",token});
        console.log(email,"this is your token:", token);
    }catch (error){
        console.log(error);
        res.status(500).json({error:" Internal Server error"});
    }
}
const getAllVendors=async(req,res)=>{
    try{
        const vendors=await Vendor.find().populate('firm');
        res.json({vendors})
    }catch(error){
         console.log(error);
        res.status(500).json({message:" Internal Server error"});
    }
}
const getVendorById=async(req,res)=>{
    const vendorId=req.params.apple;
    try {
        const vendor=await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor not found"});
        }
        res.status(200).json({vendor});
    } catch (error) {
         console.log(error);
        res.status(500).json({message:" Internal Server error"});
    }
}
module.exports={venderRegister,vendorLogin,getAllVendors,getVendorById};