const mongoose = require("mongoose")

const userschema =  new mongoose.Schema({
    first_name : { type : String , default : null},
    last_name : { type : String , default : null},
    email : { type : String , unique : null},
    password : { type : String ,},
    token : { type : String ,},
})

module.exports = mongoose.model("user", userschema)