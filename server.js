import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import homeRoute from "./routes/home.js";
import userRoute from "./routes/user.js"
import postRoute from "./routes/post.js"
import weatherRoute from "./routes/API.js"

const app = express();
const port = process.env.PORT || 3000;
const API= process.env.API || "http://localhost:4000"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());


app.use("/",homeRoute);
app.use("/user",userRoute);
app.use("/post",postRoute);
app.use("/api",weatherRoute);


app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});