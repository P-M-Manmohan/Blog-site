import { getPost,addPost,updatePost, removePost } from "../service/getPosts.js";
import { canEdit } from "../service/auth.js";


const openPost=async (req,res)=>{
    try{
    const result=await getPost(req.query.post);
    res.render("partials/blog.ejs",{
        id: req.query.post,
        result: result,
        isAuthorized: canEdit(req.user?.id,result.userid),
        logged: req.user,
    })
}
catch(err){
    console.log(err);
    res.sendStatus(500);
}}


const newPost=async (req,res)=>{
    var body={
    ...req.body,
    ...req.user,
    postId:req.query.id,
    }
if (req.query.new == 1) {
    await addPost(body);
} else {
    await updatePost(body);
}
res.redirect("/");
}

const editPost=async(req,res)=>{
    var content;
    const result=await getPost(req.query.postId);
    if(req.user?.id==result.userid){
        content={
            ...result,
        }
        res.render("new_blog.ejs", {
            editContent:content,
        });
    }else{
        res.sendStatus(401)
    }
}

const deletePost = async(req,res)=>{
    try{
        const result=await getPost(req.query.postId);
        if(req.user?.id==result.userid){
            await removePost(req.query.postId)
            res.redirect("/");
        }
    }catch(err){
        console.log(err);
    }
} 

const writePost = async(req,res)=>{
    var user;
    if(req.user){
        user=req.user;
    }
    res.render("new_blog.ejs",{
    logged:user,
    });
}

export{
    openPost,
    newPost,
    editPost,
    deletePost,
    writePost
}