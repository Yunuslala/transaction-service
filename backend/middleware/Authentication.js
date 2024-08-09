const express=require("express");
require('dotenv').config();
const jwt=require("jsonwebtoken");

exports.Authentication=async(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        const decoded=jwt.verify(token,process.env.secret);
        if(decoded){
             req.body.UserId=decoded.UserId;
             req.body.role=decoded.role;
             next()
        }else{
            return res.status(400).send({success:false,msg:"Invalid token"});
        }
    }else{
        return res.status(400).send({success:false,msg:"Token is  required to use this resources"});
    }
}
