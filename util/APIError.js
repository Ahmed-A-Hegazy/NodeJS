class APIError extends Error{
    constructor(message,statusCode){
        super(message)
        Error.captureStackTrace(this,this.constructor)
        this.statusCode=statusCode
    }
}

module.exports=APIError