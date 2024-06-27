import db from "../models/db.js"
import bcrypt from "bcrypt"

async function findUser(body){
    const result=await db.query("SELECT id,username,password FROM users WHERE username=$1",[body.username]);
    const users=result.rows;
    const user=users.find(user=> user.username==body.username);
    return user
}

async function verifyUser(user,password){
    var msg;
    if(user==null){
        msg="user does not exist"
    }else{
            if(await bcrypt.compare(password,user.password)){
                msg=user;
            }else{
                msg="Incorrect passord or username";
            }
        }
        return msg;
}

async function checkInfo(user){
    var msg;
    const oldUser=await db.query("SELECT username,email FROM users WHERE username=$1 OR email=$2",[user.username,user.email]);
    if(user.password!=user.confirmPassword){
        msg="passwords dont match"
    }
    else if(user.password.length<8){
        msg="password too short"
    }
    else if(oldUser.rows[0]!=null){
        msg="User already exists"
    }else{
        msg="OK"
    }
    return msg;
}

async function addUser(user){
    const hashedPassword= await bcrypt.hash(user.password,10);
        await db.query("INSERT INTO users (username,password,email) VALUES ($1,$2,$3)",[user.username,hashedPassword,user.email])
}

export{
    findUser,
    verifyUser,
    checkInfo,
    addUser
}