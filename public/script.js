function adjustHeight(el) {
    if (el.value != null) {
        el.style.height =
            el.scrollHeight > el.clientHeight
                ? el.scrollHeight + "px"
                : el.clientHeight;
    }
}
$(".post").click(function (ele) {
    var id = ele.currentTarget.id;
    var post = $.param({ post: id.slice(5) });
    window.location.href = "/post?" + post;
});
