import userController from "../../adapter/userController";
import userRepository from "../repository/userRepository";
import Userusecase from "../../use_case/userUsecase";
import express from "express";

const repository = new userRepository()
const useCase = new Userusecase(repository)
const controller = new userController(useCase)

const router = express.Router()

router.post('/register',(req,res)=>controller.register(req,res))
router.post('/verify-otp',(req,res)=> controller.verifyOtp(req,res))
router.post('/login',(req,res)=>controller.login(req,res))
router.post('/logout',(req,res)=>controller.login(req,res))
router.get('/resendotp/:userId',(req,res)=>controller.resendotp(req,res))
router.get('/forgot/:otpemail',(req,res)=>controller.forgot(req,res))
router.post('/resetpassword',(req,res)=>controller.resetpassword(req,res))
router.get('/profile',(req,res)=>controller.profile(req,res))
router.get('/appointment/:id/:time',(req,res)=>controller.appoinment(req,res))
router.get('/getTime/:userId',(req,res)=>controller.getTime(req,res))
router.get('/gethistory/:userId/:receiverId',(req,res)=>controller.gethistory(req,res))

export default router