import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
var numberOfSubmits = 0;
var titles = [];
var contents = [];

var users=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/users/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/users/signin",(req,res)=>{
    res.render("signin.ejs");
});

app.post("/login",(req,res)=>{
    var userData=req.body;
    console.log(userData);
    res.redirect("/");
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
