import profileController from "../../adapter/profileController";
import profileRepository from "../repository/profileRepository";
import profileusecase from "../../use_case/profileUsecase";
import upload from '../config/multer';
import express from "express";

const repository = new profileRepository()
const useCase = new  profileusecase(repository)
const controller = new  profileController(useCase)

const router = express.Router()
router.post('/upload',upload.single('image'),(req,res)=>controller.upload(req,res))
router.post('/update',(req,res)=>controller.update(req,res))

export default router