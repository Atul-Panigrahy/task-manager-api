
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task= require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        //trim the whitespaces before and after the name
        trim:true
    },
    age: {
        type: Number,
        default: 0,
        //own customized age validator
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
        

    },
    email: { 
        type: String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type:String,
        required: true,
        minlength: 7,
        trim:true,
        validate(value)  {
             if(value.toLowerCase().includes('password')){

                throw new Error("Password can't contain 'password'")
            }
        }
    },
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
})


//virtual property =>relatioship between user and tasks entity
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


// userSchema.methods.getPublicProfile = function () {
userSchema.methods.toJSON = function () {
    const user =this
    const userObject = user.toObject()
    
    //restrict the data sent to authenticated user .. dont send tokens and password
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET)

    //add to user token
    user.tokens = user.tokens.concat({token})
    await user.save() //saving them to database

    return token

}


userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            
            throw new Error('Unable to login')
        }
    
        return user
}


// hash the plain text passsword before saving
userSchema.pre('save', async function(next) {
    
    const user = this

    // console.log('just before saving');

    if(user.isModified('password')){
        
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})

//delet tasks when the user  is deleted
userSchema.pre('remove',async function (next) {
    const user = this
    Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User