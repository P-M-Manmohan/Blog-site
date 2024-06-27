dayNightIcon()     

function openPost(ele){
    var id = ele.id;
    console.log(id)
    var post = $.param({ post: id});
    window.location.href = "/post/open?" + post;
};

async function dayNightIcon() {
    var response = await fetch("/api/icon");
    var data = await response.json();
    var d=new Date();
    const hour=d.getHours();
    var img;
    if(hour=>6 && hour<18){
        img=data.day.image;
    }else{
        img=data.night.image;
    }
    $(".weather-icon").attr("src",img)
    
}
   

function adjustHeight(el) {
    if (el.value != null) {
        el.style.height =
            el.scrollHeight > el.clientHeight
                ? el.scrollHeight + "px"
                : el.clientHeight;
    }
}