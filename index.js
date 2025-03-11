const express = require('express')
const app=express()
require('express-async-errors')
const usersRouter=require('./routers/users_router')
const postsRouter=require('./routers/posts')
const morgan=require('morgan')
const cors=require('cors')
const helmet=require('helmet')
const xss=require('xss-clean')
const mongoSanitize=require('express-mongo-sanitize')
const limiter=require('./middlewares/rate-limiter')


const APIError=require('./util/APIError')
const errorHandler=require('./middlewares/errorhandler')
const mongoose=require('mongoose')
const dotenv=require('dotenv')


dotenv.config()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(limiter)
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use('/users',usersRouter)
app.use('/posts',postsRouter)
app.use(errorHandler)




const PORT=process.env.PORT
const MONGO_URI=process.env.MONGO_URI



app.listen(PORT,async()=>{
    console.log(`Server is running on port ${PORT}`)
    try{
        await mongoose.connect(MONGO_URI)
        console.log(`Connected to database successfully`)
        
    }  
    catch(err){
        console.error(err)
    }
})
