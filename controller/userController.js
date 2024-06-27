import { findUser,verifyUser,checkInfo,addUser } from "../service/userServices.js";
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../service/auth.js";

const loginPage=(req,res)=>{
        res.render("login.ejs",{
            error:req.query.msg,
        });
}

const login=async (req,res)=>{
    try{
        const user=await findUser(req.body);
        const verification = await verifyUser(user,req.body.password)
        if(typeof(verification)==='object'){
            const sessionId=uuidv4()
            setUser(sessionId,user);
            res.cookie("uid",sessionId)
            res.redirect("/");
        }
        else if (typeof(verification)==='string'){
            res.redirect("/user/login?msg="+verification)
        }
    }catch(err){
        console.log(err)
    }
}

const signinPage =(req,res)=>{
        res.render("signin.ejs",{
            error:req.query.msg,
        });
}

const signup=async(req,res)=>{
    try{
        const msg=await checkInfo(req.body);
        if(msg=="OK"){
            await addUser(req.body)
            res.redirect("/");
        }
        else if (msg){
            res.redirect("/user/signup?msg="+msg);
        }
        }catch(err){
            console.log(err)
        }
}

export{
    loginPage,
    login,
    signinPage,
    signup
}