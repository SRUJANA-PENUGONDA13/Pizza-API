const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose

const ownerSchema = new Schema({
    name: {
        type : String,
        required: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) 
        {
            if (value.toLowerCase().includes('password')) 
            {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    email:
    {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Please provide valid email address')
            }
        }
    },
    contact: 
    {
        type : String,
        validate(value)
        {
            if( value.length != 10 )
                throw new Error('Mobile number is invalid')
        }
    },
    tokens : [{
        token: {
            type : String,
            required: true
        }
    }]
})

// This method encrypt the password using bcryptjs module before storing into the database
ownerSchema.pre('save', async function (next) 
{
    const owner = this
    try
    {
        if (owner.isModified('password'))
        {
            owner.password = await bcrypt.hash(owner.password, 8)
        }        
    }
    catch(e)
    {
        throw new Error(e)
    }
    next()
})

// Adding static method to the instance of a collection to generate JWT token

ownerSchema.methods.generateAuthToken = async function()
{
    try
    {
        const user = this
        const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    }
    catch(e)
    {
        throw new Error(e)
    }
}

//Adding static method to the schema and retrieving user data by using credentials
ownerSchema.statics.findByCredentials = async function(email,password)
{
    const user = await Owner.findOne({ email })
    if(!user)
    {
        throw new Error("Invalid Username")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error("Invalid Password")
    }
    return user
}
const Owner = mongoose.model('Owner', ownerSchema);
module.exports = Owner 