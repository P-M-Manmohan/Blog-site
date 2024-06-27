import express from "express";
import {checkIfAuthorized} from "../middlewares/auth.js";
import {home} from "../controller/homeController.js"


const router=express.Router();

router.get("/", checkIfAuthorized,home)

export default router;