const express=require('express')
const ExpressError=require("./expresserror")
const routes=require("./routes")

const app=express();

app.use(express.json())

app.use("/items",routes)






app.use((req,res,next)=>{
    const e = new ExpressError("Page not Found",404)
    next(e)
})


app.use(function(err,req,res,next){
    let status=err.status || 500;
    let msg=err.msg;
    return res.status(status).json({error:{msg,status}})

})


module.exports=app
