const jwt = require('jsonwebtoken')
const Customer = require('../models/customer')
const Owner = require('../models/owner')


// This method validates the user by using request header once the authentication is successful,
// it continues with the corresponding CURD operations

const customerAuth = async (req, res, next) =>
{
    try
    {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await Customer.findOne({ _id : decoded._id , 'tokens.token': token})
        if (!user)
        {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch(e)
    {
        res.status(401).send({ error : "Please authenticate"})
    }
}

const ownerAuth = async (req, res, next) =>
{
    try
    {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await Owner.findOne({ _id : decoded._id , 'tokens.token': token})
        if (!user)
        {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch(e)
    {
        res.status(401).send({ error : "Please authenticate"})
    }
}

module.exports = { customerAuth, ownerAuth} 