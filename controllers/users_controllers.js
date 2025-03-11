const APIError = require('../util/APIError')
// const fs=require('fs').promises
const User=require('../models/users')
const bcrypt=require('bcrypt')
const util=require('util')
const jwt=require('jsonwebtoken')
const jwtVerify=util.promisify(jwt.verify)
const jwtSign=util.promisify(jwt.sign)

async function login(req,res){
    try{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        throw new APIError('User not found',404)
    }
    const isPasswordCorrect=await bcrypt.compare(password,user?.password)
    if(!isPasswordCorrect){
        throw new APIError('Password is incorrect',401)
    }
    const expiresIn=process.env.JWT_EXPIRES_IN
    const jwtSecret=process.env.JWT_SECRET
    const token=await jwtSign({id:user._id},jwtSecret,{expiresIn})
    res.status(200).json({
        status: 'success',
        data: {token}
    })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}
async function register(req,res){
    try{
        const data=req.body
        if(!data?.password||!data?.passwordConfirmation||!data?.email||!data?.name){
            throw new APIError('All fields are required',400)
    }
    if(data?.password!==data?.passwordConfirmation){
        throw new APIError('Password and password confirmation do not match',400)
    }
    const saltRounds=parseInt(process.env.SALT_ROUNDS)
    const hashedPassword=await bcrypt.hash(data?.password,saltRounds)
    const user=await User.create({...data,password:hashedPassword})
    res.status(200).json({
            status: 'success',
            data: {message:'register successfully'}
        })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}

// const addUser = async (req, res) => {
//     try{
//         const data=req.body
//         const user=await User.create(data)
//         res.status(201).json({
//             status: 'success',
//             data: {user}
//         })
//     }
//     catch(err){
//         throw new APIError(err.message,500)
//     }
// }

const getUsers = async (req, res) => {
    try{
        const users=await User.find()
        res.status(200).json({
            status: 'success',
            data: {users}
        })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}
const getUserById = async (req, res) => {
    try{
        const user=await User.findOne({_id:req.params.id})
        res.status(200).json({
            status: 'success',
            data: {user}
        })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}
const updateUser = async (req, res) => {
    try{
        const data=req.body
        const user=await User.findOneAndUpdate({_id:req.params.id},{name:data?.name , email:data?.email},{new:true})
        res.status(200).json({
            status: 'success',
            data: {user}
        })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}
const deleteUser = async (req, res) => {
    try{
        const user=await User.findOneAndDelete({_id:req.params.id})
        res.status(200).json({
            status: 'success',
            data: {user}
        })
    }
    catch(err){
        throw new APIError(err.message,500)
    }
}

// async function readData(path){
//     const data=await fs.readFile(path,'utf-8')
//     const parsedData=JSON.parse(data)
//     return parsedData
// }
// async function addData(path,data){
//     const dataFile=await readData(path)
//     if(!Array.isArray(data)){
//         data=[data]
//     }
//     for(let i=0;i<data.length;i++){
//         data[i].id=dataFile.length+1
//         dataFile.push(data[i])
//     }

//     await fs.writeFile(path,JSON.stringify(dataFile),'utf-8')
//     return data
// }

// const getUsers = async (req, res) => {
//     const data = await readData('./users.json')
//     res.status(200).json({
//         status: 'success',
//         data: { "users": data }
//     })
// }

// const getUserById = async (req, res) => {
//     const data = await readData('./users.json')
//     const user = data.find(user => user.id === parseInt(req.params.id))
//     if (!user) {
//         // return res.status(404).json({
//         //     status: 'error',
//         //     message: 'User not found'
//         // })
//         throw new APIError(`User ${req.params.id} not found`)  
//     }
//     res.status(200).json({
//         status: 'success',
//         data: user
//     })
// }   

// const addUser = async (req, res) => {
//     try{
//         const data = await addData('./users.json', req.body)
//         res.status(201).json({
//             status: 'success',
//             data: data
//         })
//     }
//     catch(err){
//         throw new APIError('failed to add user')
//     }
// }


// const updateUser = async (req, res) => {
//     const data = await readData('./users.json')
//     const userIndex = data.findIndex(user => user.id === parseInt(req.params.id))
//     if (userIndex === -1) {
//         return res.status(404).json({
//             status: 'error',
//             message: 'User not found'
//         })
//     }
//     else if(req.body['id']!==data[userIndex]['id']){
//         return res.status(500).json({
//             status: 'failure',
//             message: 'You cannot update the id'
//         })
//     }
    
//     data[userIndex] = req.body
//     await fs.writeFile('./users.json', JSON.stringify(data), 'utf-8')
//     res.status(200).json({
//         status: 'success',
//         data: data[userIndex]
//     })
// }   

// const deleteUser = async (req, res) => {
//     const data = await readData('./users.json')
//     const userIndex = data.findIndex(user => user.id === parseInt(req.params.id))
//     if (userIndex === -1) {
//         return res.status(404).json({
//             status: 'error',
//             message: 'User not found'
//         })
//     }

//     const deletedUser = data.splice(userIndex, 1)[0]
//     await fs.writeFile('./users.json', JSON.stringify(data), 'utf-8')
//     res.status(200).json({
//         status: 'success',
//         data: deletedUser
//     })
// }

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    register
}