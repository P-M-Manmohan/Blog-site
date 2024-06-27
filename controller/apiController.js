import { getIcon } from "../service/weatherIcon.js"

const weather=async(req,res)=>{
    try{
        const icon=await getIcon(req.ip.slice(7));
        res.send(icon);
    }catch(err){
        console.log(err);
    }
}

export{
    weather,
}