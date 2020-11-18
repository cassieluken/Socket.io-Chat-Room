const mongoose=require('mongoose')
const uri = "mongodb+srv://cassie:cassie123@first-cluster.iqjzj.mongodb.net/tcsdb?retryWrites=true&w=majority";
mongoose.connect(uri,{ useUnifiedTopology: true },(err)=>{
console.log('connected')

})
//require('./user.model')