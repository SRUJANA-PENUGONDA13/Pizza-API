const mongoose = require('mongoose')
const { Schema } = mongoose

const toppingSchema = new Schema({
    name: {
        type : String,
        unique: true,
        required: true,
        lowercase: true,
        trim:true
    },
    price: {
        type : Number,
        default: 30,
        trim:true
    }
})

const Topping = mongoose.model('Topping', toppingSchema);
module.exports = Topping
