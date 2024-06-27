import express from "express";

import { loginPage,login,signinPage,signup } from "../controller/userController.js";


const router=express.Router();


router.use(express.static("public"));


router.get("/login",loginPage)

router.post("/login",login);

router.get("/signup",signinPage);

router.post("/signup", signup)

export default router;