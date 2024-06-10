import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import axios from "axios";
import fs from "fs";

const app = express();
const port = 3000;
var numberOfSubmits = 0;
var titles = [];
var contents = [];
var inc=0;
var users=[];
var LOC_API="http://ip-api.com/json";
var WEATHER_API="https://api.open-meteo.com/v1/forecast?";
var icon;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/users/login",(req,res)=>{
    if(inc==3){
        var msg="Incorrect Credentials";
        inc=0;
        res.render("login.ejs",{error:msg,pic:icon});
    }else{
        res.render("login.ejs",{pic:icon});
    }
});

app.get("/users/signin",(req,res)=>{
    if(inc==1){
        var msg="passwords don't match";
        inc=0;
        res.render("signin.ejs",{error:msg,pic:icon});
    }
    else if(inc==2){
        var msg="username is already taken";
        inc=0;
        res.render("signin.ejs",{error:msg,pic:icon});
    }else if(inc==4){
        var msg="password is too Short";
        inc=0;
        res.render("signin.ejs",{error:msg,pic:icon});
    }
    else{
        res.render("signin.ejs",{pic:icon});
    }
});

app.post("/signin", async (req,res)=>{
    var userData=req.body;
    try{
        if(req.body.password!=req.body.confirmPassword){
            inc=1;
            res.redirect("/users/signin");
        }else if(users.find(user=> user.username==req.body.username)!=null){
            inc=2;
            res.redirect("/users/signin");
        }else if(req.body.password.length<8){
            inc=4;
            res.redirect("/users/signin");
        }
        else{
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        const user={username:req.body.username, password:hashedPassword, email:req.body.email};
        users.push(user);
        res.redirect("/");
        }
    }
    catch{
        console.log("error");
res.status(500).send();
    }
})

app.post("/login", async(req,res)=>{
    const user=users.find(user=> user.username==req.body.username);
    if(user==null){
        inc=3;
        res.redirect("/users/login");
    }
    try{
        if(bcrypt.compare(req.body.password,user.password)){
            res.redirect("/");
        }else{
            inc=3;
            res.redirect("/users/login");
        }
    }catch{
        res.status(500).send()
    }
})

app.get("/", async (req, res) => {
    const loc=await axios.get(LOC_API);
    var lat=loc.data.lat;
    var lon=loc.data.lon;
	try{
    const weather_data=await axios.get(WEATHER_API+`latitude=${lat}&longitude=${lon}&current=weather_code`);
    var weather_code=weather_data.data.current.weather_code;
    icon=wmo_code[weather_code].day.image;
    // const code=codes.find(code=> codes.==weather_code);
    res.render("index.ejs", {
        feed: numberOfSubmits,
        title: titles,
        pic:icon,
    });}
	catch{
		res.render("index.ejs", {
			feed: numberOfSubmits,
			title: titles,
			pic:"👍",
		});
	}
});

app.get("/writing", (req, res) => {
    res.render("new_blog.ejs",{pic:icon});
});

app.get("/post", (req, res) => { 
    var post = req.query.post;
    res.render("partials/blog.ejs", {
        title: titles[post],
        content: contents[post],
        id: post,
		pic:icon,
    });
});

app.get("/edit", (req, res) => {
    var editNumber = req.query.postId;
    res.render("new_blog.ejs", {
        title: titles[editNumber],
        content: contents[editNumber],
        id: editNumber,
		pic:icon,
    });
});

app.post("/submit", (req, res) => {
    var newPost = req.query.new;

    if (newPost == 1) {
        numberOfSubmits++;
        titles.push(req.body.title);
        contents.push(req.body.content);
    } else {
        var postId = req.query.id;
        titles[postId] = req.body.title;
        contents[postId] = req.body.content;
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});

const rawData=fs.readFileSync('WMO_code/descriptions.json')
const wmo_code=JSON.parse(rawData);