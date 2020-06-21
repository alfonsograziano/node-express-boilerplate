const router = require("express").Router();
let User = require("../models/user.model");
const { check, validationResult } = require('express-validator')
require("dotenv").config();
const axios = require("axios")
var path = require('path')


router.route("/").get((req, res) => {
    const username = req.decoded.user;

    User.findOne({ _id: username })
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(404).json("Error" + err));
});


router.route("/delete").delete((req, res) => {
    const username = req.decoded.user;

    User.findOneAndDelete({ _id: username })
        .then(doc => {
            res.status(200).json("User with id " + username + " deleted")
        })
        .catch(err => {
            res.status(401).json("Error" + err);
        });
})



router.route("/setfirstlogin").post((req, res) => {
    const username = req.decoded.user;

    User.findOne({ _id: username })
        .then(user => {
            user.firstLogin = false
            user.save()
            res.status(200).json("user with id " + username + " correctly updated")
        })
        .catch(err => res.status(404).json("Error" + err));
});


router.route("/setcontacts").post((req, res) => {
    const username = req.decoded.user;

    User.findOne({ _id: username })
    .then(user => {

        if(typeof req.body.phoneNumber === "undefined" && 
            typeof req.body.otherContact === "undefined" && 
            typeof req.body.instagramAccount === "undefined"){
                res.status(200).json("all fields are empty... user not updated")
        }else{
            //Add here other types of validation
            user.contacts = {}
            if(typeof req.body.phoneNumber !== "undefined"){
                user.contacts.phoneNumber = req.body.phoneNumber
            }
            if(typeof req.body.otherContact !== "undefined"){
                user.contacts.otherContact = req.body.otherContact
            }
            if(typeof req.body.instagramAccount !== "undefined"){
                user.contacts.instagramAccount = req.body.instagramAccount
            }
            user.save()
            res.status(200).json("user with id " + username + " correctly updated")
      
        }
    })
    .catch(err => res.status(404).json("Error" + err));
   
});


module.exports = router;

