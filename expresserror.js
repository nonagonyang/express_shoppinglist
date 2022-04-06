class ExpressError extends Error{
    constructor(msg,status){
        super();
        this.msg=msg;
        this.status=status
        console.log(this.stack)
    }
    
}

//export
module.exports=ExpressError;