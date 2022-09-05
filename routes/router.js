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
router.get('/read', async(req,res) => {
    userRegistration.find({}, (err,result) =>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })

})
router.delete('/delete/:id', async(req,res) => {
   
   try{
    await userRegistration.findByIdAndDelete({_id: req.params.id});
    res.status(201).json("User deleted")
   }
   catch(err){
    res.status(409).json({message: err.message})
   }
})
router.put('/update/:id', async(req,res) => {
 
    try{
     await userRegistration.findByIdAndUpdate({_id: req.params.id}, {
         $set: req.body
     });
     res.status(201).json("User Updated")
    }
    catch(err){
     res.status(409).json({message: err.message})
    }
 })


module.exports = router