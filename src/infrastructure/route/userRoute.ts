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

export default router