import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
var numberOfSubmits = 0;
var titles = [];
var contents = [];
var inc=0;
var users=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/users/login",(req,res)=>{
    if(inc==3){
        var msg="Incorrect Credentials";
        inc=0;
        res.render("login.ejs",{error:msg});
    }else{
        res.render("login.ejs");
    }
});

app.get("/users/signin",(req,res)=>{
    if(inc==1){
        var msg="passwords don't match";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }
    else if(inc==2){
        var msg="username is already taken";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }else if(inc==4){
        var msg="password is too Short";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }
    else{
        res.render("signin.ejs");
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

app.get("/", (req, res) => {
    res.render("index.ejs", {
        feed: numberOfSubmits,
        title: titles,
    });
});

app.get("/writing", (req, res) => {
    res.render("new_blog.ejs");
});

app.get("/post", (req, res) => {
    var post = req.query.post;
    res.render("partials/blog.ejs", {
        title: titles[post],
        content: contents[post],
        id: post,
    });
});

app.get("/edit", (req, res) => {
    var editNumber = req.query.postId;
    res.render("new_blog.ejs", {
        title: titles[editNumber],
        content: contents[editNumber],
        id: editNumber,
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
