import { listAllPosts } from "../service/getPosts.js";

const home= async (req,res)=>{
    try{
        var user;
        if(req.user){
            user=req.user;
        }
        const result= await listAllPosts()
        res.render("index.ejs", {
        feed: result.length,
        title: result,
        logged:user,
    });}
	catch(err){
        console.log(err)
		res.sendStatus(500);
	
    }
}

export{
    home,
}