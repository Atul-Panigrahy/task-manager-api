
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

const auth = async (req,res,next) => {
    // console.log("auth middleware");

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxZjE3NDY2Y2I4OTVhYjgzNjQ5YmQiLCJpYXQiOjE2MTM5MzY2NDh9.JUWMFpSQR5rltwt5ikR6_SMe8Npx4dk5LrnB2IE215k
    
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'});
    }
}

module.exports = auth