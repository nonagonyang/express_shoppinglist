const express=require('express');
const router=new express.Router()
const ExpressError=require("./expresserror")
const items=require("./fakeDB")

let names = items.map(a => a.name);

router.get("/", (req,res)=>{
    res.json({items:items})

})

router.post("/",(req,res,next)=>{
    try{
        if (!req.body.name) {
            throw new ExpressError("must have an item name",400) 
        }
        if (!req.body.price){
            throw new ExpressError("the item must have a price",400)
        }
        if(req.body.name in names){
            throw new ExpressError("the item has already in the shopping list",400)
        }
        items.push(req.body)
        return res.json({added:req.body})

    }catch(e){return next(e)}   
}) 

router.get("/:name", (req,res,next)=>{
    try{
        const item=items.find(i=>i.name=== req.params.name)
        if(!item){
            throw new ExpressError("invalid item name",404) 
        }
        return res.json({item})

    }catch(e){
        return next(e)
    } 
})

router.patch("/:name", (req,res,next)=>{
    try{
        const item=items.find(i=>i.name=== req.params.name)
        if(item===undefined){
            throw new ExpressError("invalid item name",404) 
        }
        item.name=req.body.name 
        return res.json({item})

    }catch(e){
        return next(e)
    } 
})

router.delete("/:name", function (req, res,next) {
    try{
        const item = items.findIndex(item => item.name === req.params.name)
        if (item === -1) {
        throw new ExpressError("Item not found", 404)
    }
        items.splice(item, 1)
        res.json({ message: "Deleted" })

    }catch(e){
        next(e)
    }
  })

module.exports = router;