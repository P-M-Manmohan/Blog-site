const sessionIdToUserMap=new Map();

function setUser(id,userInfo){
    const user={
        id:userInfo.id,
        username:userInfo.username,
    }
    sessionIdToUserMap.set(id,user)
}

function getUser(id){
    return sessionIdToUserMap.get(id)
}

function canEdit(id,userId){
    if(id==userId){
        return 1;
    }else{
        return 0;
    }
}

export{
    setUser,
    getUser,
    canEdit,
};