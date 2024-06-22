dayNightIcon()     

function openPost(ele){
    var id = ele.id;
    console.log(id)
    var post = $.param({ post: id});
    window.location.href = "/post?" + post;
};

async function dayNightIcon() {
    var response = await fetch("/icon");
    var data = await response.json();
    var d=new Date();
    let hour=d.getHours();
    var img;
    if(hour=>6 && hour<18){
        img=data.day.image;
    }else{
        img=data.night.image;
    }
    console.log(img)
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