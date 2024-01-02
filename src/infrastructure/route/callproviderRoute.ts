import callproviderController from "../../adapter/callproviderController";
import callproviderRepository from "../repository/callproviderRepository";
import callproviderUsecase from "../../use_case/callproviderUsecase";
import express from "express";

const repository = new callproviderRepository()
const useCase = new callproviderUsecase(repository)
const controller = new callproviderController(useCase)

const router = express.Router()

router.post('/register',(req,res)=>controller.register(req,res))



export default router