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

export{
    setUser,
    getUser,
};