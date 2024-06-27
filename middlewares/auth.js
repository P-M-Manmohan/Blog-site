import { getUser } from "../service/auth.js";


async function restrictToLoggedInUserOnly(req,res,next){
    const userId=req.cookies?.uid;
    if(!userId) return res.redirect("/user/login");
    const user=getUser(userId);
    if(!user) return res.redirect("/user/login");
    req.user=user;
    next();
}

async function checkIfAuthorized(req,res,next){
    const userId=req.cookies?.uid;
    if(!userId){
        res.user=null;
    }else{
        const user=getUser(userId);
        if(!user){
            res.user=null;
        }else{
            req.user=user;
        }
    }
    next();
}


export{
    restrictToLoggedInUserOnly,
    checkIfAuthorized,
}