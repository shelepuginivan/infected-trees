import {Router} from "express";
import FileController from "../controllers/FileController";
import APIController from "../controllers/APIController";


const APIRouter: Router = Router()

APIRouter.get('/', APIController.getAPIKey)
APIRouter.post('/', APIController.generateAPIKey)
APIRouter.get('/files/:filename', FileController.getTreePhotoByFilename)
APIRouter.get('/trees', APIController.getAllTreesRecords)
APIRouter.get('/trees/recent', APIController.getRecentTreesRecords)

export default APIRouter
