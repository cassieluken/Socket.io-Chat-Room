var express = require('express');

var bp = require('body-parser');
const mongoose = require('mongoose')
var cors = require('cors');

require('./dbconnect')
const UserModel = require('./message.model')


var app= express()
app.use(bp.json());
app.use(cors());


app.post('/',(req,res)=>{
    var data=req.body;
    new UserModel(data).save().then(result=>{
        res.json(result)
    })
    //mongoose.save      
})
app.get('/getusers',async(req,res)=>{
    //res.send used for larger more intense queries?
    /* collection.find().toArray().then(result=>{
        console.log('display user')
        res.send(result)
    }) */
    //callback - res.json used for smaller queries with json
    /* UserModel.find().then(results=>{
        res.json(results)
    }) */
    //await async
    const results = await UserModel.find()
    res.json(results)
})
app.get('/tab',(req,res)=>{
    res.json({'data':'value'});
})
app.delete('/deleteusers/:Name',(req,res)=>{
const data=req.params.Name 
/* collection.deleteOne({Name:data})
res.send('record is deleted') */
    UserModel.deleteOne({uname:data})
})
app.put('/updateusers/:Name',(req,res)=>{
    var data=req.body
    var Name= req.params.Name
    collection.updateOne({Name:Name},{$set:data})
    res.send('records Updated')
})
app.listen(3000,()=>{
    console.log('server is ready')
})

