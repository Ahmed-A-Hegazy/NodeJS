const express=require('express')
const router=express.Router()
const usersController=require('../controllers/users_controllers')
const auth=require('../middlewares/auth')
const restrictTo=require('../middlewares/restrictTo')


router.get('/', auth, restrictTo('admin'),usersController.getUsers)
router.get('/:id',usersController.getUserById)
// router.post('/',usersController.addUser)
router.put('/:id',usersController.updateUser)
router.delete('/:id',usersController.deleteUser)

router.post('/login',usersController.login)
router.post('/register',usersController.register)

module.exports=router