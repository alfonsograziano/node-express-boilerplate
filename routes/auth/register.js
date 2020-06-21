const router = require("express").Router();
let User = require("../../models/user.model");
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
require("dotenv").config();
const sendEmail = require("../../services/sendEmail")

router.route("/").post([
    check("email").isEmail().withMessage("Please use a valid email! "),
    check("firstName").isLength({min:2}),
    check("password").isLength({min:6})
        .withMessage("Password lenght min is 6 charachers"),
],
    (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const email = req.body.email.trim().toLowerCase();
    const firstName = req.body.firstName.trim();
    const noHashedPassword = req.body.password.trim();

    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(noHashedPassword, salt);

    const newUser = new User({
        email, 
        password, 
        firstName, 
        firstLogin:true, 
        isActive:false
    });

    newUser.save()
        .then((user)=> {
            url = process.env.SERVER_URL + '/api/signup/activate?id='+user._id
            from= '"Test" test@gmail.com'
            subject="Registrazione completa"
            body="<p>Ciao, grazie per esserti registrato. Ecco il link per attivare il tuo account! <a href='"+url+"'>Clicca qui</a></p><br/><p>Se il link non funziona incolla questo link nel browser: "+url+"</p>"
            sendEmail(from, email, subject, body, (err,info)=>{
                if(err){
                    console.log(err)
                    res.status(400).json(err)        
                }else{
                    res.status(200).json(info)
                }
            })
        })
        .catch(err=> {
            if(err.code == 11000){
                res.status(400).json({
                    err: "Email already used..."
                })
            }else{
                console.log(err)
                res.status(401).json("Error" + err);
            }
        });
}); 


router.route("/activate").get((req, res)=>{
   
    const id= req.query.id;
    User.findOne({ _id: id })
    .then(user => {
        user.isActive = true
        user.save()
        res.set('Content-Type', 'text/html');
        //Add here your html template
        res.send('<h2>Account attivato!</h2>');
    })
    .catch(err => res.status(404).json("Errore nell'attivazione dell'account..."));
}); 




module.exports = router;