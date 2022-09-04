const express = require('express')
const router = express.Router()
const userRegistration = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'dkjshdhjskk';

router.post('/register', async(req,res) => {
    
       
    const saltPassword = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, saltPassword);

    const signup = new userRegistration({
        username: req.body.username,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        password: securePassword,
        confirm: req.body.confirm

    })
    signup.save()
    .then(data =>{
        res.json(data)
    })
    .catch(err => {
        res.json(err)
    })
})
router.post('/login', async(req,res) =>{
    const {email, password} = req.body
    const users = await userRegistration.findOne({email});

    if(!users){
        return res.json({status: 'error', error: 'Invalid Email Address'})
    }
    if(await bcrypt.compare(password, users.password)){
        const token = jwt.sign(
            {
                id: users._id,
                email: users.email
            },
            JWT_SECRET
        )
        return res.json({ status: 'ok' , data: token})
    }
    res.json({status : 'error' , error: 'Username or Password is Incorrect'})
})

module.exports = router