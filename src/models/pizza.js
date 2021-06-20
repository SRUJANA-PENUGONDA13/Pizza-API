const mongoose = require('mongoose')
const { Schema } = mongoose

const pizzaSchema = new Schema({
    name: {
        type : String,
        unique: true,
        required: true,
        lowercase: true,
        trim:true
    },
    price: {
        type : Number,
        default: 100,
        trim:true
    }
})

const Pizza = mongoose.model('Pizza', pizzaSchema);
module.exports = Pizza
