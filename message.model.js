const mongoose = require ('mongoose')
var chatschema=new mongoose.Schema

({
    name:{
        type:String,
    },
    text:{
        type:String,
    },
    room:{
        type:String,
    },
    timestamp:{
        type:Date, default: Date.now()
    }
})
module.exports=mongoose.model('chat',chatschema)