import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import axios from "axios";
import fs from "fs";
import pg from "pg";
import "dotenv/config";

const ENV=process.env

const db = new pg.Client({
    user: ENV.DB_USERNAME,
    host: ENV.HOST,
    database: ENV.DATABASE,
    password: ENV.PASSWORD,
    port: 5432,
  });
  
db.connect();

const app = express();
const port = 4000;


var LOC_API="http://ip-api.com/json";
var WEATHER_API="https://api.open-meteo.com/v1/forecast?";
const rawData=fs.readFileSync('WMO_code/descriptions.json')
const wmo_code=JSON.parse(rawData);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get("/location/:ip", async (req,res)=>{
try{
    const location = await axios.get(LOC_API+`/2401:4900:6317:6da8:6d14:fc18:efee:57e3`);
    const weather= await axios.get(WEATHER_API+`latitude=${location.data.lat}&longitude=${location.data.lon}&current=weather_code`);
    var weather_code=weather.data.current.weather_code;
    const icon=wmo_code[weather_code];
    res.send(icon);
    }
    catch(err){
        console.log(err);
    }
});

app.get("/content",async (req,res)=>{
    const result=await db.query("SELECT posts.id AS id ,username,title FROM posts JOIN users ON users.id=posts.userid")
    res.send(result.rows);
})

app.get("/blog/:post", async (req,res)=>{
    const result=await db.query("SELECT * FROM posts JOIN users ON users.id=posts.userid WHERE posts.id=$1",[req.params.post])
    res.send(result.rows[0])
})

app.post("/addUser", async(req,res)=>{
    var status;
    const userInfo=req.body;
    const user=await db.query("SELECT username,email FROM users WHERE username=$1 OR email=$2",[userInfo.username,userInfo.email]);
    if(userInfo.password!=userInfo.confirmPassword){
        status="passwords dont match"
    }
    else if(userInfo.password.length<8){
        status="password too short"
    }
    else if(user.rows[0]!=null){
        status="User already exists"
    }else{
        const hashedPassword= await bcrypt.hash(userInfo.password,10);
        try{const result=await db.query("INSERT INTO users (username,password,email) VALUES ($1,$2,$3)",[userInfo.username,hashedPassword,userInfo.email])
        res.sendStatus(200);
        }catch{
            res.sendStatus(500);
        }
    }
    res.send(status)
})

app.post("/checkUser",async (req,res)=>{
    const userInfo=req.body;
    var msg;
    const result=await db.query("SELECT id,username,password FROM users WHERE username=$1",[userInfo.username]);
    const users=result.rows;
    const user=users.find(user=> user.username==req.body.username);
    if(user==null){
        msg="user does not exist"
    }else{
    try{
        if(bcrypt.compare(req.body.password,user.password)){
            msg=user;
        }else{
            msg="Incorrect passord or username";
        }
        }catch{
            res.status(500).send()
            }
        }
        res.send(msg);
})

app.post("/submitting", async (req,res)=>{
    try{const input=req.body;
    const result=await db.query("INSERT INTO posts (title,content,userid) VALUES ($1,$2,$3)",[input.title,input.content,input.id])
    res.sendStatus(200)}
    catch{
        res.sendStatus(500);
    }
})

app.patch("/submitting", async (req,res)=>{
    try{
    const input=req.body;
    const result=await db.query("UPDATE posts SET title=$1,content=$2 WHERE id=$3",[input.title,input.content,input.postId])
    res.sendStatus(200)}
    catch{
        res.sendStatus(500);
    }
})

app.patch("/submitting", async (req,res)=>{
    try{const input=req.body;
    const result=await db.query("INSERT INTO posts (title,content,userid) VALUES ($1,$2,$3)",[input.title,input.content,input.id])
    res.sendStatus(200)}
    catch{
        res.sendStatus(500);
    }
})

app.delete("/remove/:id", async (req,res)=>{
    try{
        console.log(req.params.id)
    const result=await db.query("DELETE FROM posts WHERE id=$1",[req.params.id])
        res.sendStatus(200);
    }catch{
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});