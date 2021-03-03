var basePath = "http:\/\/172.16.1.189:8888/NewSimilar";



// function getQueryString(name) {
//     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) {
//         return unescape(r[2]);
//     }
//     return null;
// }
// var name = getQueryString(name = "username")
// console.log(name)


/*
* 
* @function: 为搜索框设置默认的搜索提示文字,聚焦时清空默认文字,失焦为空时设置默认文字
* @param: obj为jquery对象;
* @param: SearchText为搜索框默认设置的提示文字
* @note: 动态添加SearchTextColor类可以改变输入文字的样式
* 
*/
var SearchText;
var  obj =$('#sousuo');
$.ajax({
    type: "post",
    url: basePath +"/Search/HighWord",
    async: false, 
    dataType: "json",
    success: function (response) {
        SearchText = response.HighWord
        console.log(SearchText)
        obj.val(SearchText);
        obj.keyup(function () {
            obj.addClass('SearchTextColor');
        }).blur(function () {
            if (obj.val() == '') {
                obj.val(SearchText).removeClass('SearchTextColor');
            }
        }).focus(function () {
            obj.val('');
        })
    }
});
console.log(SearchText)

// var se = sessionStorage.setItem(username);
var se = sessionStorage.getItem("username");
console.log(se)
$("#username").html(se);
var  setItem = sessionStorage.getItem("limit");
console.log(setItem)
if(setItem == 2) {
    $(".nav-dropdown").css("display","none")
}








// if (se == null || se == "") {
//         $("#cue").css("display","block");
//         $("#username").html('');
//     } else {
//     $("#cue").css("display", "none");
//         
//     }



// function load_data() {
//     var theme = sessionStorage.getItem("username");
//     if (theme == null || theme == "") {
//         $("#cue").show();
//         $("#username").html('');
//     } else {
//         $("#cue").hide();
//         $("#username").html(theme);
//     }
// }




