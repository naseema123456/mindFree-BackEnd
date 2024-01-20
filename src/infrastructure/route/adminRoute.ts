import adminController from "../../adapter/adminController";
import adminRepository from "../repository/adminRepository";
import Adminusecase from "../../use_case/adminUsecase";
import express from "express";

const repository = new adminRepository()
const useCase = new Adminusecase(repository)
const controller = new adminController(useCase)

const router = express.Router()


router.post('/login',(req,res)=>controller.login(req,res))
router.get('/Users',(req,res)=>controller.Users(req,res))
router.post('/addUser',(req,res)=>controller.addUser(req,res))
router.get('/getUser/:user_id',(req,res)=>controller.getUser(req,res))
router.post('/editUser',(req,res)=>controller.editUser(req,res))
router.post('/Blocked',(req,res)=>controller.Bloked(req,res))
router.get('/getMarket',(req,res)=>controller.getMarket(req,res))


export default router