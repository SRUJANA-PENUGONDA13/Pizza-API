const express = require('express')
const customerRouter = new express.Router

// Adding schema
const Customer = require('../models/customer')
const Pizza = require('../models/pizza')
const Topping = require('../models/topping')

// Adding Middlewares
const { customerAuth } = require('../middleware/auth')

// This router validates user credentials,generates JWT token and adds to User Collection
customerRouter.post('/customer/login', async (req,res)=>
{
    try
    {
        const user = await Customer.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user ,token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
// This router adds a customer to the customer Collection
customerRouter.post('/customer', async (req,res)=>
{
    const customer = Customer(req.body)
    try
    {
        await customer.save()
        res.send({customer})
    }
    catch(e)
    {

        res.status(400).send(e.toString())
    }
})

// This router displays price for the given pizza and topping
customerRouter.get('/customer/pizza/topping/:pizzaName/:toppingName', customerAuth, async (req,res)=>
{
    var pizza = await Pizza.find({ name : req.params.pizzaName })
    try
    {
        if(pizza.count == 0)
        {
            throw new Error("Data not found") 
        }
        else
        {
            var topping = await Topping.find({ name : req.params.toppingName })
            {
                if(topping.count == 0)
                {
                    throw new Error("Data not found")
                }
                else
                {
                    var totalPrice = Number(topping[0].price) + Number(pizza[0].price)
                    res.send({ "Pizza" : req.params.pizzaName, "Topping" : req.params.toppingName, "Total Price": totalPrice})
                }
            }
        }
    }
    catch(e)
    {
        res.status(404).send()
    }
})

module.exports = customerRouter
