// Loading in-built modules
const express = require('express')

const port = process.env.PORT

// Database connection
require('./db/pizzaManager')

// Loading user defined modules
const ownerRouter = require('./routers/owner.js')
const customerRouter = require('./routers/customer.js')

const app = express()

//Adding routers to app
app.use(express.json())
app.use(customerRouter)
app.use(ownerRouter)


app.get('',(req,res)=>
{
    const msg = "Welcome to Pizza Manager API"
    res.send(msg)   
})

app.listen(port,()=>
{
  console.log("Server started")
})