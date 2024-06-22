import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import { setUser } from "./service/auth.js";
import cookieParser from "cookie-parser";
import { restrictToLoggedInUserOnly, checkIfAuthorized } from "./middlewares/auth.js";

const app = express();
const port = 3000;
const API="http://localhost:4000"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser())

app.get("/icon", async(req,res)=>{
    try{
        const weather=await axios.get(API+`/location/127.`);
        const icon=weather;
        res.send(icon.data);
    }catch(err){
        console.log(err);
    }
})


app.get("/", checkIfAuthorized, async (req, res) => {
    try{
        var user;
        if(req.user){
            user=req.user;
        }
        const result=await axios.get(API+`/content`);
        res.render("index.ejs", {
        feed: result.data.length,
        title: result.data,
        logged:user,
    });}
	catch{
		res.sendStatus(500);
	}
});


app.get("/post",checkIfAuthorized, async (req,res)=>{
    try{
        var canEdit;
        var user;
        if(req.user){
            user=req.user;
        }
        const result=await axios.get(API+`/blog/${req.query.post}`);
        if(req.user?.id==result.data.userid){
            canEdit=1;
        }else{
            canEdit=0;
        }
        res.render("partials/blog.ejs",{
            id: req.query.post,
            title: result.data.title,
            content:result.data.content,
            isAuthorized:canEdit,
            name:result.data.username,
            logged:user,
        })
    }
    catch{
        res.sendStatus(500);
    }
})

app.get("/login",(req,res)=>{
    if(req.query.msg){
        res.render("login.ejs",{
            error:req.query.msg,
        });
    }else{
        res.render("login.ejs");
    }
})

app.post("/users/login",async(req,res)=>{
    try{
        const result= await axios.post(API+`/checkUser`,req.body);
        if(typeof(result.data)==='object'){
            const sessionId=uuidv4();
            const user=result.data
            setUser(sessionId,user);
            res.cookie("uid",sessionId)
        res.redirect("/");
        }
        else if (result.data){
            var msg = encodeURIComponent(result.data);
            res.redirect("/login?msg="+msg);
        }
        }catch(err){
            console.log(err)
        }
})

app.get("/signup",(req,res)=>{
    
    if(req.query.msg){
        res.render("signin.ejs",{
            error:req.query.msg,
        });
    }else{
        res.render("signin.ejs");
    }
})

app.post("/users/signup", async (req,res)=>{
    try{
    const result= await axios.post(API+`/addUser`,req.body);
    if(result.data=="OK"){
    res.redirect("/");
    }
    else if (result.data){
        var msg = encodeURIComponent(result.data);
        res.redirect("/signup?msg="+msg);
    }
    }catch(err){
        console.log(err)
    }
})

app.get("/writing",restrictToLoggedInUserOnly,(req,res)=>{
    var user;
        if(req.user){
            user=req.user;
        }
    res.render("new_blog.ejs",{
        logged:user,
    });
})

app.post("/submit",restrictToLoggedInUserOnly,async(req,res)=>{
    var newPost = req.query.new;
    var body={
        ...req.body,
        ...req.user,
        }
    if (newPost == 1) {
        await axios.post(API+"/submitting",body);
    } else {
        body={
            ...body,
            postId:req.query.id,
        }
        await axios.patch(API+"/submitting",body);
    }
    res.redirect("/");
})

app.get("/edit", checkIfAuthorized,async (req, res) => {
    var user;
    if(req.user){
        user=req.user;
    }
    const result=await axios.get(API+`/blog/${req.query.postId}`);
    var content;
    if(req.user?.id==result.data.userid){
        content={
            title:result.data.title,
            content:result.data.content,
            id:req.query.postId,
            logged:user,

        }
    }
    res.render("new_blog.ejs", {
        editContent:content,
        logged:user,

    });
});

app.post("/delete",checkIfAuthorized, async (req,res)=>{
    try{
        const result=await axios.get(API+`/blog/${req.query.postId}`);
        if(req.user?.id==result.data.userid){
            const del=await axios.delete(API+`/remove/${req.query.postId}`);
            console.log(del)
            res.redirect("/");
        }
    }catch{
        res.sendStatus(500);
    }
})

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});