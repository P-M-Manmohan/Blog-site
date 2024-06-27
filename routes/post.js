import express from "express";
import {  restrictToLoggedInUserOnly,checkIfAuthorized } from "../middlewares/auth.js";
import { openPost,newPost,editPost,deletePost,writePost } from "../controller/postController.js";


const router=express.Router();

router.use(express.static("public"));


router.get("/open",checkIfAuthorized,openPost)

router.post("/submit",restrictToLoggedInUserOnly,newPost)

router.get("/edit", checkIfAuthorized,editPost);

router.post("/delete",checkIfAuthorized,deletePost );

router.get("/new",restrictToLoggedInUserOnly,writePost)


export default router;