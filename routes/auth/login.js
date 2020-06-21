const router = require("express").Router();
let User = require("../../models/user.model");
var bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

require("dotenv").config(); 


router.route("/").post([
    check("email").isEmail().withMessage("Please use a valid email! "),
    check("password").isLength({min:6})
],(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const email = req.body.email.trim().toLowerCase();
    const psw = req.body.password.trim();

    User.findOne({email: email})
        .then(user =>{
            if(user.isActive){
                if(bcrypt.compareSync(psw, user.password)){
                    var token = jwt.sign({ user: user._id }, process.env.SECRET);
                   
                    res.status(200).json({authToken: token});
                }else{
                    res.status(400).json("Wrong password... Retry!");
                }
            }else{
                res.status(301).json("Account non confirmed");
            }
            
        })
        .catch(err =>{
            console.log(err.message)
            res.status(400).json("Cannot find email...");
        }) 
}); 



module.exports = router;