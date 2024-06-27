import express from "express";
import { weather } from "../controller/apiController.js";

//To delete later
import axios from "axios";
const API= process.env.API || "http://localhost:4000"


const router=express.Router();

router.get("/icon", weather);

export default router;