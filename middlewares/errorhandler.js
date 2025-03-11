const APIError = require('../util/APIError')
const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    console.log('😊')
    
    if (err instanceof APIError) {
        return res.status(err.statusCode || 500).json({status:'failure',message:err.message || 'Internal Server Error'})
    }

    console.error(err.stack)
    res.status(500).json({status:'failure',message:'Internal Server Error'})
}

module.exports = errorHandler