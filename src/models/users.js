const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true,
        trim: true,
    },
    lName:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email Invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isLength(value,6,undefined)){
                throw new Error('Length must be grater than 6');
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be password');
            }
        }
    }
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to find!');
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login!')
    }
    return user;
}

userSchema.statics.findByUsername = async(email) => {
    const user = await User.findOne({ email });
    if(user){
        return true;
    }
    return false;
}

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bycrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('Users', userSchema);

module.exports = User;