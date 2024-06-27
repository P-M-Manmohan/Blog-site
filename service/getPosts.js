import db from "../models/db.js"

async function listAllPosts (){
    const result=await db.query("SELECT posts.id AS id ,username,title FROM posts JOIN users ON users.id=posts.userid")
    return result.rows;
}

async function getPost(id){
    const result=await db.query("SELECT posts.id,title,content,userid,username FROM posts JOIN users ON users.id=posts.userid WHERE posts.id=$1",[id])
    return result.rows[0]
}

async function addPost(post){
    try{
        await db.query("INSERT INTO posts (title,content,userid) VALUES ($1,$2,$3)",[post.title,post.content,post.id])
    }catch(err){
            console.log(err);
    }
}

async function updatePost(post){
    try{
        await db.query("UPDATE posts SET title=$1,content=$2 WHERE id=$3",[post.title,post.content,post.postId])
    }catch(err){
            console.log(err)
        }
}

async function removePost(id){
    try{
        const result=await db.query("DELETE FROM posts WHERE id=$1",[id])
    }catch(err){
        console.log(err)
    }
}


export{
    listAllPosts,
    getPost,
    addPost,
    updatePost,
    removePost,
}