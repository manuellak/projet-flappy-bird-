/** 
 * 
*/

const express=require('express')
const app=express()
const fs=require('fs')
const path= require('path')
 
//MIDDLEWARE
app.use(express.static(path.join(__dirname,'public')))

//main route
app.get('/',function(req,res){
    res.sendFile(__dirname+ '/index.html')
})
// port 
app.listen(8080,function(){
    console.log('server ready on 8080')
})