const express = require('express')
const ownerRouter = new express.Router

// Adding schema
const Owner = require('../models/owner')
const Pizza = require('../models/pizza')
const Topping = require('../models/topping')

// Adding Middlewares
const { ownerAuth } = require('../middleware/auth')

// This router validates user credentials,generates JWT token and adds to User Collection
ownerRouter.post('/owner/login', async (req,res)=>
{
    try
    {
        const user = await Owner.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user ,token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
// This router adds a owner to the Owner Collection
ownerRouter.post('/owner', async (req,res)=>
{
    const owner = Owner(req.body)
    try
    {
        await owner.save()
        res.send({owner})
    }
    catch(e)
    {

        res.status(400).send(e.toString())
    }
})
// This router adds a owner to the Owner Collection
ownerRouter.post('/owner/pizza', ownerAuth, async (req,res)=>
{
    const pizza = Pizza(req.body)
    try
    {
        await pizza.save()
        res.send({pizza})
    }
    catch(e)
    {

        res.status(400).send(e.toString())
    }
})
// This router adds a owner to the Owner Collection
ownerRouter.post('/owner/topping', ownerAuth, async (req,res)=>
{
    const topping = Topping(req.body)
    try
    {
        await topping.save()
        res.send({topping})
    }
    catch(e)
    {

        res.status(400).send(e.toString())
    }
})

ownerRouter.put('/owner/pizza/price',ownerAuth, (req,res) => 
{
    const query = { name : req.body.name }
    Pizza.findOneAndUpdate(query,{ price : req.body.price }).then((pizza) =>
    {
        if (!pizza)
        {
            return res.status(404).send()
        }
        res.send("Price updated ")
    }).catch((e) =>
    {
        res.status(500).send()
    })
})
ownerRouter.put('/owner/topping/price',ownerAuth, (req,res) => 
{
    const query = { name : req.body.name }
    Topping.findOneAndUpdate(query,{ price : req.body.price }).then((topping) =>
    {
        if (!topping)
        {
            return res.status(404).send()
        }
        res.send("Topping Updated")
    }).catch((e) =>
    {
        res.status(500).send()
    })
})

module.exports = ownerRouter
