const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const login = async (req,res) =>{
    try {
       const {email, password}= req.body;
       const user = await userModel.findOne({email}) ;
       if(!user) res.status(400).send("User not found");
       res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,error});
    }
};

const register = async(req,res) =>{
    try {
       const {name,email, password}= req.body;
       const user = await userModel.findOne({email}) ;
       if(user) res.status(400).send("user already exists. Please login");
       const salt = await bcrypt.genSalt(10);
       const hashed = await bcrypt.hash(password,salt);
       const newUser = new userModel({
        name, 
        email,
        password:hashed,
       });
       res.status(201).json({
        success: true,
        newUser,
      });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,error});
    }
}

module.exports= {login, register};