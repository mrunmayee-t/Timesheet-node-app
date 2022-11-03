const express = require('express');
const User = require('../models/users');
const router = express.Router();



//create user
router.post('/users', async(req,res) => {
    const user = new User(req.body);
    try{
        const userExists = await User.findByUsername(req.body.email);
        if(userExists){
            res.status(400).send('User already exists!');
        }
        else
        {
            await user.save();
            res.status(201).send();
        }
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send({ user });
    }
    catch(e){
        res.status(400).send('User not found! Please register first!');
    }
});

module.exports = router;