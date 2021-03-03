$('.btn2').click(function () {
    chaList();
    // chongtime()
})
$('.btn3').click(function () {
    HistoryList()
})
$('.btn4').click(function () {
    Similar()
})


// 重复
function chaList() {


    //获取查询时间与查询内容
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultRepeat',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',



            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                 day: status,
                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultRepeat',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, 
                    // {
                    //     field: 'jQBT',
                    //     title: '警情标题',
                    //     width: "18%",
                    //     align: 'center'
                    // }, 
                    {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "24%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "30%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};


// 历史数据
function HistoryList() {


    //获取查询时间与查询内容
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultHistory',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',



            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                day: status,
                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultHistory',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, 
                    // {
                    //     field: 'jQBT',
                    //     title: '警情标题',
                    //     width: "18%",
                    //     align: 'center'
                    // }, 
                    {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "24%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "30%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};
 

// 相似数据
function Similar() {


    //获取查询时间与查询内容
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultSimilar',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',

            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                day: status,
            
                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultSimilar',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, 
                    // {
                    //     field: 'jQBT',
                    //     title: '警情标题',
                    //     width: "18%",
                    //     align: 'center'
                    // },
                    {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "24%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "30%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};

layui.use('laydate', function () {
    var laydate = layui.laydate;
   
//自定义格式
laydate.render({
    elem: '#test6'
    , range: true,
    done: function (value, data, endDate) {
        var start = abcd(JSON.parse(JSON.stringify(data)));
        var end = abcd(JSON.parse(JSON.stringify(endDate)));
        layer.alert(start+'</br>'+end)
       

        function abcd(obj) {

            var FullYear = obj.year;
            var Month = obj.month;
            var Day = obj.date;
            var Hours = obj.hours;
            var Minutes = obj.minutes;
            var Seconds = obj.seconds;

            return FullYear + '-' + Month + '-' + Day + ' ' + Hours + 0 + ':' + Minutes + 0 + ':' + Seconds + 0;
        }
    }
  
});
    
});


$(".btff").click(function() {
    // 开始时间
    var str = $("#test11").val();
    // 结束时间
    var end = $("#test22").val();
    if (str == "" && end == "") {
        layer.msg("请选择月份时间")
        return false;
    }
    if (str == "") {
        layer.msg("请选择月份开始时间")
        return false;
    }
    if (end == "") {
        layer.msg("请选择月份结束时间")
        return false;
    }
    $("#tta").html(str +"-" + end)
    $('.tan').css("display", "none")
    
    $('.bl').css("display", "none")
    $('.ne').css("display", "inline")

})
$(".btcc").click(function () {
   
    $('.tan').css("display", "none")
    
   
})
$('#btn5').click(function () {
    loadListTime()
})
$('#btn6').click(function () {
    chaTime()
    // chongtime()
})
$('#btn7').click(function () {
    HistoryTime()
})
$('#btn8').click(function () {
    SimilarTime()
})

// 时间重复数据
function chaTime() {


    //获取查询时间与查询内容
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    // 开始时间
    var str = $("#test11").val();
    // 结束时间
    var end = $("#test22").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultRepeatTime',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',



            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                // day: status,
                
                StartTime: str,
                StopTime: end

                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultRepeatTime',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, {
                        field: 'jQBT',
                        title: '警情标题',
                        width: "18%",
                        align: 'center'
                    }, {
                        field: 'jQXH',
                        width: "18%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "20%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "20%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};


// 时间历史数据
function HistoryTime() {


    //获取查询时间与查询内容
    // 开始时间
    var str = $("#test11").val();
    // 结束时间
    var end = $("#test22").val();
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultHistoryTime',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',



            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                StartTime: str,
                StopTime: end
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultHistoryTime',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, {
                        field: 'jQBT',
                        title: '警情标题',
                        width: "18%",
                        align: 'center'
                    }, {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "18%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "20%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};


// 时间相似数据
function SimilarTime() {


    //获取查询时间与查询内容
    // 开始时间
    var str = $("#test11").val();
    // 结束时间
    var end = $("#test22").val();
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/ResultSimilarTime',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',

            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                // day: status,
                StartTime: str,
                StopTime: end

                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数
            ,
            url: basePath + '/Ajfx/ResultSimilarTime',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, {
                        field: 'jQBT',
                        title: '警情标题',
                        width: "18%",
                        align: 'center'
                    }, {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "18%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "20%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, curr, count) {

                $('th').css({
                    'background-color': '#ed6a1a',
                    'color': '#fff',
                    'font-weight': 'bold'
                })
            },
            parseData: function (res) { //res 即为原始返回的数据
                //    console.log(res.data.pageList[name])

                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            var data = obj.data;
            console.log(data)
            if (obj.event === 'detail') {
                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;

            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};


















// 时间全部
function loadListTime() {


    //获取查询时间与查询内容
    // 开始时间
    var str = $("#test11").val();
    // 结束时间
    var end = $("#test22").val();
    var userId = $("#userId").val();
    var createDate = $("#time").val();
    var status = $("#ervFonr-1 option:selected").val();
    var documentName = $("#name").val();
    layui.use(['table', 'layer', 'laydate', 'laypage', 'util'], function () {
        var $ = layui.$,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate;
        var laypage = layui.laypage;
        var util = layui.util;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        //自定义格式
        laydate.render({
            elem: '#demo',
            format: 'yyyy/MM/dd',
            range: true,
            theme: '#ff7f4f',
            done: function (value, date, endDate) {
                $("#time").val(value);
                table.reload('demo', {
                    url: basePath + '/Ajfx/JQSearch',
                    where: { //设定异步数据接口的额外参数，任意设
                        limitName: '15',
                        pageName: '1',
                        // userId:userId,
                        createDate: value,
                        status: "",
                        documentName: "",
                        time: time
                    }
                });
            }
        });



        table.render({
            elem: '#demo',
            page: {
                theme: '#ff7f4f',



            },

            page: true,
            // limits: [5, 10, 15], //显示
            limit: 15,//每页默认显示的数量
            where: {
                // userId:userId,
                // createDate: createDate,
                StartTime: str,
                StopTime: end
                // likeName: documentName,
                // time: time
            } //如果无需传递额外参数，可不加该参数http-server
            ,
            url: basePath + '/Ajfx/JQSearch',
            cols: [
                [
                    // { type: 'checkbox', width: 100, fixed: 'left', align: 'center' }
                    , {
                        title: '序号',
                        align: 'center',
                        type: 'numbers',
                        // sort: true,
                        width: 80
                    }, {
                        field: 'jQBT',
                        title: '警情标题',
                        width: "18%",
                        align: 'center',
                        templet: '<div><span title="{{d.jQBT}}">{{d.jQBT}}</span></div>',

                    }, {
                        field: 'jQXH',
                        width: "20%",
                        title: '警情序号',
                        align: 'center',
                        template: '#titleTpl'
                    },
                    {
                        field: 'cJPCS',
                        width: "18%",
                        title: '出警派出所',
                        align: 'center',
                        // template: '#titleTpl'
                    },
                    // {
                    //     field: 'counts',
                    //     width: 200,
                    //     title: '上传用户',
                    //     align: 'center',
                    //     template: '#titleTpl'
                    // },
                    {
                        field: 'bJSJ', width: "20%", title: '报警时间', align: 'center', templet: "<div>{{layui.util.toDateString(d.bJSJ, 'yyyy-MM-dd HH:mm:ss')}}</div>"
                    }
                    , {
                        title: '操作',
                        field: 'docName',
                        align: 'center',
                        toolbar: "#barDemo"
                        // type: 'numbers',
                        // sort: true,

                    }
                    // , { field: 'status', width: 213, title: '状态', align: 'center' }
                    // , { field: 'uploadDate', width: 170, title: '上传时间', align: 'center' }
                    // , { width: 283, title: '操作', align: 'center', toolbar: "#barDemo" }

                ]
            ],
            done: function (res, page, count) {
                var that = this.elem.next();
                console.log(that)
                tdTitle();
                res.data.forEach(function (item, index) {
                    console.log(item.sXZT)
                    if (item.sXZT == 1) {
                        var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("color", "#bc3d4c");
                    } else if (item.sXZT == 2) {
                        var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("color", "#FF6600");
                    } else if (item.sXZT == 3) {
                        var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("color", "#3763ff");
                    }
                });
            },

            //   $('th').css({
            //     'background-color': '#ed6a1a',
            //     'color': '#fff',
            //     'font-weight': 'bold'
            // })
            parseData: function (res) { //res 即为原始返回的数据

                //   console.log(res.pageList)
                // var lih = res.pageList
                // for (var i = 0; i < lih.length; i++) {
                //     console.log(lih[i].sXZT)
                //     if (lih[i].sXZT == 2) {
                //         $('.lists table .layui-table-col-special').css("color", "#bc3d4c")

                //         // $("#demo table th div").addClass("test");
                //     }
                //     // if (lih[i].sXZT == 2) {
                //     //     $('.layui-table-col-special').css("color", "#bc3d4c")
                //     //     //  $("#demo table th div").addClass("test1");
                //     // }
                //     // if (lih[i].sXZT == 3) {
                //     //     $('.layui-table-col-special').css("color", "#e0a447")
                //     //     //  $("#demo table th div").addClass("test2");
                //     // }
                //     // if (lih[i].sXZT == 4) {
                //     //     $('.layui-table-col-special').css("color", "#3763ff")
                //     //     //  $("#demo table th div").addClass("test3");
                //     // }
                // }
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.totalCount, //解析数据长度
                    "data": res.pageList //解析数据列表
                };
            },
            request: {
                pageName: 'pageNo' //页码的参数名称，默认：page
                ,
                // limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }

        });

        //监听表格复选框选择
        table.on('checkbox(demo)', function (obj) {
            console.log(obj);
        });

        //监听工具条
        table.on('tool(demo)', function (obj) {
            console.log(obj)
            if (obj.event === 'detail') {


                var id = obj.data.jQID

                // var url = "../templates/fllow.html?time=" + time + "&uuid=" + uuid;
                var url = "./widgets.html?id=" + id

                window.location.href = url;


            } else if (obj.event === 'del') {
                layer.confirm('确认删除？', {
                    btn: ['确定', '取消'],
                    btn1: function (index, layero) {
                        //后台执行删除操作
                        $.post(basePath + '/eye/delete', {
                            'docId': data.id
                        }, function (data) {
                            if (data.status == 1) {
                                layer.msg("删除成功", {
                                    time: 1800,
                                    icon: 1
                                });
                                loadList();
                            } else {
                                layer.msg('删除失败', {
                                    time: 1800,
                                    icon: 2
                                });
                            }
                        }, 'json');
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit') {
                if (data.status == '已修改' || (data.status == '核查完成' && data.errorCount == '0')) {
                    $.post('/eye/get-down', {
                        'docId': data.id
                    }, function (data, status) {
                        if (data == 'false') {
                            layer.msg('下载失败', {
                                time: 1800,
                                icon: 2
                            });
                        } else {
                            data = JSON.parse(data);
                            window.location.href = basePath + "/eye/down-file/" + data.downkey +
                                "/" + data.docId;
                        }
                    });
                } else {
                    layer.msg('此文件不可以下载', {
                        time: 1800,
                        icon: 2
                    });
                }
            }
        });

    });
};