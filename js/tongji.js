



jichu()

// 基础类
function jichu() {
    layui.use('table', function () {
        var table = layui.table;
        $('#cound').click(function () {
            // 派出所
           
            var checkStatus = layui.table.checkStatus('te').data;
            //    console.log(checkStatus)
            var ids = [];

            for (var i = 0; i < checkStatus.length; i++) {
                ids.push(checkStatus[i].name)
            }
            if (ids.length < 1) {
                layer.msg('无选中派出所分类项');
                return false;
            }
            var idd = JSON.stringify(ids);//必须要写，不然后台获取不到数据
            console.log(idd)
            // 警情小分类
            var checkStatus2 = layui.table.checkStatus('te2').data;
            var id2 = [];

            for (var i = 0; i < checkStatus2.length; i++) {
                id2.push(checkStatus2[i].nAME)
            }
            if (id2.length < 1) {
                layer.msg('无选中警情分类项');
                return false;
            }
            var idd2 = JSON.stringify(id2);//必须要写，不然后台获取不到数据
            console.log(idd2)
            // toString()
            // 警情大类
            var test_list = []
            $("[name=dl]:checked").each(function () {
                test_list.push($(this).val())
            });
            var test_str = JSON.stringify(test_list);
            console.log(test_str)

            //   统计
            var test_list2 = []
            $("[name=tj]:checked").each(function () {
                test_list2.push($(this).val())
            });
            var test_str2 = JSON.stringify(test_list2);
            console.log(test_str2)
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
            if ( end == "") {
                layer.msg("请选择月份结束时间") 
                return false;
            }
            if (test_str2 == "") {
                layer.msg("请选择分类统计")
                return false;
            }
            $("#tishi").css("display", "block")
            $.ajax({
                type: "post",
                url: basePath + "/Jqtj/one",
                data: {
                    pcs: idd,
                    dl: test_str,
                    xl: idd2,
                    tj: test_str2,
                    startTime: str,
                    stopTime: end,
                },
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    $('#content').html('');
                    $("#content").show();
                    $("#tishi").css("display", "none")
                    // document.getElementById("exportType").value = "one";
                    var oneDate = typeof data == 'string' ? JSON.parse(data) : data;
                    // var oneDate = $.parseJSON(data);
                    console.log(oneDate)
                    var table = $(
                        "<table class=\"table-hover table-bordered\" style=\"margin-top: 10px;text-align: center;width: 300%;color: aliceblue;\"></table>"
                    );
                    table.appendTo("#content");
                    var flHead = $("<thead style='background: #10a7b3;'><tr ></tr></thead>");
                    flHead.appendTo(table);
                    var fl;
                    var sj;
                    for (var i in oneDate) {
                        fl = $.parseJSON(i);
                        sj = $.parseJSON(oneDate[i]);
                        $("#exportTitle2").value = fl;
                        $("#exportValue2").value = JSON
                            .stringify(sj);
                    }
                    for (var k in fl) {
                        var fl_Th = $("<th>" + fl[k] + "</th>");
                        fl_Th.appendTo(flHead);
                    }
                    var sjBody = $("<tbody></tbody>");
                    sjBody.appendTo(table);
                    for (var j in sj) {
                        var sjTr = $("<tr></tr>");
                        sjTr.appendTo(sjBody);
                        var sjTdPcs = $("<td>" + j + "</td>");
                        sjTdPcs.appendTo(sjTr);
                        var sjTotal = $.parseJSON(sj[j]);
                        for (var l in sjTotal) {
                            var sjTdTotal = $("<td >" + sjTotal[l] +
                                "</td>");
                            sjTdTotal.appendTo(sjTr);
                        }
                    }

                }
            });
         
        })
    
            var document = $(document).width();
            table.render({
                id: 'te',
                elem: '#test',
                height: 370
                , url: basePath + '/Type/Pcs'
                , parseData: function (res) { //res 即为原始返回的数据                 
                   
                    
                    
                    
                    return {
                        "code": 0, //解析接口状态
                        "msg": '', //解析提示文本
                        "count": 1000, //解析数据长度
                        "data": res.listJson //解析数据列表
                    };
                }

                , cols: [[
                    { type: 'checkbox', title: '全选', align: 'center', width: "34%" }
                    , { width: "30%", title: '序号', type: 'numbers', align: 'center' }
                    , { field: 'name', width: "28%", title: '管辖区域选择', align: 'center', }
                ]]
                // , page: true
            });
            table.render({
                id: 'te2',
                elem: '#testoo',
                height: 370
                , url: basePath + '/Type/Category'
                , parseData: function (res) { //res 即为原始返回的数据
                   
                    
                    return {
                        "code": 0, //解析接口状态
                        "msg": '', //解析提示文本
                        "count": 1000, //解析数据长度
                        "data": res.listTwo //解析数据列表
                    };
                }

                , cols: [[
                    { type: 'checkbox', title: '全选', align: 'center', width: "34%" }
                    , { width: "30%", title: '序号', type: 'numbers', align: 'center' }
                    , { field: 'nAME', width: "28%", title: '警情类型选择', align: 'center', }

                ]]
                // , page: true
            });
    });
}
// var aaa = $("#dll_1").prop("checked");
// if (aaa == true) {
//     console.log(111)
// } else {
//     console.log(222)
// }
function checkboxOnclick(checkbox) {
    layui.use('form', function () {
        var form = layui.form;
    if (checkbox.checked == true) {
      
     $.ajax({
         type: "post",
         url: basePath + '/Type/Category',
        //  data: "data",
         dataType: "json",
         success: function (response) {
            //  console.log(response)
             var kll = response.listTwo.split(',');
             var res = kll.forEach(item => console.log(item.pID) );
             if(res == 1 ) {
                //  $("input[name='layTableCheckbox']").prop('checked', true);
                 var quotationCheckbox = $("input[name = 'layTableCheckbox']");
                 for (j = 0; j < quotationCheckbox.length; j++) {
                    
                         quotationCheckbox[i].checked = true;  //设置选中
                     
                 }
             }
           form.render();
         }

     });

        // $.get(
        //     "{:url('service/edit')}",
        //     { 'id': adminId },
        //     function (d) {  //d为后台返回的json数据
        //         //设置品种 多选框
        //         arr = d.quotation_type.split(','); //存的时候是多个值拼成的字符串,这里劈成数组
        //         for (i = 0; i < arr.length; i++) {
        //             var quotationCheckbox = $("input[name=quotation_type]");  //有所的checkbox
        //             for (j = 0; j < quotationCheckbox.length; j++) {
        //                 if (quotationCheckbox[j].value == arr[i]) {
        //                     quotationCheckbox[i].checked = true;  //设置选中
        //                 }
        //             }
        //         }

        //         form.render(); //更新全部
        //     }
        // );
       
    } else {

        console.log(222)

    }
    });

}


// 分类
tabthery();
function tabthery() {
    layui.use('table', function () {
        var table = layui.table;
        $('#cound-1').click(function () {
           
            // // 派出所
            // var checkStatus = layui.table.checkStatus('te3').data;
            // //    console.log(checkStatus)
            // var ids = [];

            // for (var i = 0; i < checkStatus.length; i++) {
            //     ids.push(checkStatus[i].name)
            // }
            // if (ids.length < 1) {
            //     layer.msg('无选中派出所分类项');
            //     return false;
            // }
            // var idd = JSON.stringify(ids);//必须要写，不然后台获取不到数据
            // console.log(idd)
            // 警情小分类
            var checkStatus2 = layui.table.checkStatus('te3').data;
            var id2 = [];

            for (var i = 0; i < checkStatus2.length; i++) {
                id2.push(checkStatus2[i].nAME)
            }
            if (id2.length < 1) {
                layer.msg('无选中警情分类项');
                return false;
            }
            var idd2 = JSON.stringify(id2);//必须要写，不然后台获取不到数据
            console.log(idd2)
            // toString()
            // 警情大类
            var test_list = []
            $("[name=dl2]:checked").each(function () {
                test_list.push($(this).val())
            });
            var test_str = JSON.stringify(test_list);
            console.log(test_str)

            //   统计
            var test_list2 = []
            $("[name=tj2]:checked").each(function () {
                test_list2.push($(this).val())
            });
            var test_str2 = JSON.stringify(test_list2);

            console.log(test_str2)
            // 计算
            var test_list3 = []
            $("[name=ty]:checked").each(function () {
                test_list3.push($(this).val())
            });
            var test_str3 = JSON.stringify(test_list3);

            console.log(test_str3)
            // 开始时间
            var str = $("#test33").val();
            // 结束时间
            var end = $("#test44").val();
            // 同比月份
            var str2 = $("#test55").val();
            var end2 = $("#test66").val();
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
            if (str2 == "") {
                layer.msg("请选择同比月份开始时间")
                return false;
            }
            if (end2 == "") {
                layer.msg("请选择同比月份结束时间")
                return false;
            }
            if (test_str2 == "") {
                layer.msg("请选择分类统计")
                return false;
            }
            if (test_str2 == "") {
                layer.msg("请选择分类计算")
                return false;
            }
            $("#tishi").css("display", "block")
            $.ajax({
                type: "post",
                url: basePath + "/Jqtj/two",
                data: {
                    dl: test_str,

                    xl: idd2,
                    tj: test_str2,
                    js: test_str3,
                    startTime: str,
                    stopTime: end,
                    beginTime: str2,
                    endTime: end2,
                },
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    $("#tishi").css("display", "none")
                    $('#content').html('');
                    $("#content").show();
                    $("#tishi").hide();
                    // document.getElementById("exportType").value = "one";
                    var oneDate = typeof data == 'string' ? JSON.parse(data) : data;
                    // var oneDate = $.parseJSON(data);
                    console.log(oneDate)
                    var table = $(
                        "<table class=\"table-hover table-bordered\" style=\"margin-top: 10px;text-align: center;width: 300%;color: aliceblue;\"></table>"
                    );
                    table.appendTo("#content");
                    var flHead = $("<thead style='background: #10a7b3;'><tr ></tr></thead>");
                    flHead.appendTo(table);
                    var fl;
                    var sj;
                    for (var i in oneDate) {
                        fl = $.parseJSON(i);
                        sj = $.parseJSON(oneDate[i]);
                        document.getElementById("exportTitle2").value = fl;
                        document.getElementById("exportValue2").value = JSON
                            .stringify(sj);
                    }
                    for (var k in fl) {
                        var fl_Th = $("<th>" + fl[k] + "</th>");
                        fl_Th.appendTo(flHead);
                    }
                    var sjBody = $("<tbody></tbody>");
                    sjBody.appendTo(table);
                    for (var j in sj) {
                        var sjTr = $("<tr></tr>");
                        sjTr.appendTo(sjBody);
                        for (var l in sj[j]) {
                            var sjTdTotal = $("<td>" + sj[j][l] +
                                "</td>");
                            sjTdTotal.appendTo(sjTr);
                        }
                    }

                }
            });
        });
        table.render({
            id: 'te3',
            elem: '#testhery',
            height: 370
            , url: basePath + '/Type/Category'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listTwo //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'nAME', width: "150%", title: '警情类型选择', align: 'center', }
            ]],
            // , page: true
            resizing: function (layero) {
                var tableDom = layero.find('.layui-table-box');
                var theadTable = tableDom.find('.layui-table-header');
                var tbodyTable = tableDom.find('.layui-table-body');
                tbodyTable.css({
                    'overflow': 'auto'
                });
                theadTable.css('width', 'auto');
                theadTable.find('table').css('width', 'auto');
                var tbodyTrTable = tbodyTable.find('tr').eq(0);
                if (tbodyTrTable.length != 0) {
                    theadTable.find('th').each(function (i) {
                        var tdDom = tbodyTrTable.find('td').eq(i);
                        $(this).css({
                            'width': tdDom.outerWidth(true) + 'px'
                        });
                    });
                } else {
                    theadTable.find('table').css('width', '100%');
                }
                tableDom.find('.layui-form').css('height', tbodyTable.outerHeight(true) + theadTable.outerHeight(true) + 'px');
            }
        });
    });
}



// 日
ri()

function ri() {
    layui.use('table', function () {
        var table = layui.table;
        $('#cound-4').click(function () {
           
            // 派出所
            var checkStatus = layui.table.checkStatus('ripai').data;
            console.log(checkStatus)
            var ids = [];

            for (var i = 0; i < checkStatus.length; i++) {
                ids.push(checkStatus[i].name)
            }
            if (ids.length < 1) {
                layer.msg('无选中派出所分类项');
                return false;
            }
            var idd = JSON.stringify(ids);//必须要写，不然后台获取不到数据
            console.log(idd)
            // 警情小分类
            var checkStatus2 = layui.table.checkStatus('rijing').data;
            var id2 = [];

            for (var i = 0; i < checkStatus2.length; i++) {
                id2.push(checkStatus2[i].nAME)
            }
            if (id2.length < 1) {
                layer.msg('无选中警情分类项');
                return false;
            }
            var idd2 = JSON.stringify(id2);//必须要写，不然后台获取不到数据
            console.log(idd2)
            // toString()
            // 警情大类
            var test_list = []
            $("[name=dw]:checked").each(function () {
                test_list.push($(this).val())
            });
            var test_str = JSON.stringify(test_list);
            console.log(test_str)

            //   统计
            var test_list2 = []
            $("[name=tq]:checked").each(function () {
                test_list2.push($(this).val())
            });
            var test_str2 = JSON.stringify(test_list2);

            console.log(test_str2)
            // 开始时间
            var str = $("#test1515").val();
            // 结束时间
            var end = $("#test1616").val();
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
            // if (str1 == "") {
            //     layer.msg("请选择同比月份开始时间")
            //     return false;
            // }
            // if (end1 == "") {
            //     layer.msg("请选择同比月份结束时间")
            //     return false;
            // }
            if (test_str.length < 1) {
                layer.msg('无选中分类统计项');
                return false;
            }

            $("#tishi").css("display", "block")
            $.ajax({
                type: "post",
                url: basePath + "/Jqtj/four",
                data: {
                    pcsAll: idd,
                    pcs: idd,
                    dl: test_str,
                    xl: idd2,
                    tj: test_str2,
                    startTime: str,
                    stopTime: end,
                },
                dataType: "json",
                success: function (data) {
                    $("#tishi").css("display", "none")
                    console.log(data)
                    $('#content').html('');
                    $("#content").show();
                    $("#tishi").hide();
                    // document.getElementById("exportType").value = "one";
                    var oneDate = typeof data == 'string' ? JSON.parse(data) : data;
                    // var oneDate = $.parseJSON(data);
                    console.log(oneDate)
                    var table = $(
                        "<table class=\"table-hover table-bordered\" style=\"margin-top: 10px;text-align: center;width: 300%;color: aliceblue;\"></table>"
                    );
                    table.appendTo("#content");
                    var flHead = $("<thead style='background: #10a7b3;'><tr ></tr></thead>");
                    flHead.appendTo(table);
                    var fl;
                    var sj;
                    for (var i in oneDate) {
                        fl = $.parseJSON(i);
                        sj = $.parseJSON(oneDate[i]);
                        document.getElementById("exportTitle6").value = fl;
                        document.getElementById("exportValue6").value = JSON
                            .stringify(sj);
                    }
                    for (var k in fl) {
                        var fl_Th = $("<th>" + fl[k] + "</th>");
                        fl_Th.appendTo(flHead);
                    }
                    var sjBody = $("<tbody></tbody>");
                    sjBody.appendTo(table);
                    for (var j in sj) {
                        var sjTr = $("<tr></tr>");
                        sjTr.appendTo(sjBody);
                        var sjTdPcs = $("<td>" + j + "</td>");
                        sjTdPcs.appendTo(sjTr);
                        var sjTotal = $.parseJSON(sj[j]);
                        for (var l in sjTotal) {
                            var sjTdTotal = $("<td >" + sjTotal[l] +
                                "</td>");
                            sjTdTotal.appendTo(sjTr);
                        }
                    }

                }
            });
        });
        table.render({
            id: 'ripai',
            elem: '#test8',
            height: 370
            , url: basePath + '/Type/Pcs'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listJson //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'name', width: "150%", title: '管辖区域选择', align: 'center', }

            ]]
            // , page: true
        });

        table.render({
            id: 'rijing',
            elem: '#test9',
            height: 370
            , url: basePath + '/Type/Category'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listTwo //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'nAME', width: "150%", title: '警情类型选择', align: 'center', }

            ]]
            // , page: true
        });

    });
}

shike()
// 时刻
function shike() {
    layui.use('table', function () {
        var table = layui.table;
        $('#cound-3').click(function () {
          
            // 派出所
            var checkStatus = layui.table.checkStatus('tepp').data;
            console.log(checkStatus)
            var ids = [];

            for (var i = 0; i < checkStatus.length; i++) {
                ids.push(checkStatus[i].name)
            }
            if (ids.length < 1) {
                layer.msg('无选中派出所分类项');
                return false;
            }
            var idd = JSON.stringify(ids);//必须要写，不然后台获取不到数据
            console.log(idd)
            // 警情小分类
            var checkStatus2 = layui.table.checkStatus('te-jing').data;
            var id2 = [];

            for (var i = 0; i < checkStatus2.length; i++) {
                id2.push(checkStatus2[i].nAME)
            }
            if (id2.length < 1) {
                layer.msg('无选中警情分类项');
                return false;
            }
            var idd2 = JSON.stringify(id2);//必须要写，不然后台获取不到数据
            console.log(idd2)
            // toString()
            // 警情大类
            var test_list = []
            $("[name=dm]:checked").each(function () {
                test_list.push($(this).val())
            });
            var test_str = JSON.stringify(test_list);
            console.log(test_str)

            //   统计
            var test_list2 = []
            $("[name=to]:checked").each(function () {
                test_list2.push($(this).val())
            });
            var test_str2 = JSON.stringify(test_list2);

            console.log(test_str2)
            // 开始时间
            var str = $("#test77").val();
            // 结束时间
            var end = $("#test88").val();
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
            // if (str1 == "") {
            //     layer.msg("请选择同比月份开始时间")
            //     return false;
            // }
            // if (end1 == "") {
            //     layer.msg("请选择同比月份结束时间")
            //     return false;
            // }
            if (test_str2.length < 1) {
                layer.msg('无选中分类统计项');
                return false;
            }

            $("#tishi").css("display", "block")
            $.ajax({
                type: "post",
                url: basePath + "/Jqtj/five",
                data: {
                    pcsAll: idd,
                    pcs: idd,
                    dl: test_str,
                    xl: idd2,
                    tj: test_str2,
                    startTime: str,
                    stopTime: end,
                },
                dataType: "json",
                success: function (data) {
                    $("#tishi").css("display", "none")
                    console.log(data)
                    $('#content').html('');
                    $("#content").show();
                    $("#tishi").hide();
                    // document.getElementById("exportType").value = "one";
                    var oneDate = typeof data == 'string' ? JSON.parse(data) : data;
                    // var oneDate = $.parseJSON(data);
                    console.log(oneDate)
                    var table = $(
                        "<table class=\"table-hover table-bordered\" style=\"margin-top: 10px;text-align: center;width: 300%;color: aliceblue;\"></table>"
                    );
                    table.appendTo("#content");
                    var flHead = $("<thead style='background: #10a7b3;'><tr ></tr></thead>");
                    flHead.appendTo(table);
                    var fl;
                    var sj;
                    for (var i in oneDate) {
                        fl = $.parseJSON(i);
                        sj = $.parseJSON(oneDate[i]);
                        document.getElementById("exportTitle6").value = fl;
                        document.getElementById("exportValue6").value = JSON
                            .stringify(sj);
                    }
                    for (var k in fl) {
                        var fl_Th = $("<th>" + fl[k] + "</th>");
                        fl_Th.appendTo(flHead);
                    }
                    var sjBody = $("<tbody></tbody>");
                    sjBody.appendTo(table);
                    for (var j in sj) {
                        var sjTr = $("<tr></tr>");
                        sjTr.appendTo(sjBody);
                        var sjTdPcs = $("<td>" + j + "</td>");
                        sjTdPcs.appendTo(sjTr);
                        var sjTotal = $.parseJSON(sj[j]);
                        for (var l in sjTotal) {
                            var sjTdTotal = $("<td >" + sjTotal[l] +
                                "</td>");
                            sjTdTotal.appendTo(sjTr);
                        }
                    }

                }
            });
        });
        table.render({
            id: 'tepp',
            elem: '#testfour',
            height: 370
            , url: basePath + '/Type/Pcs'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listJson //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'name', width: "150%", title: '管辖区域选择', align: 'center', }

            ]]
            // , page: true
        });

        table.render({
            id: 'te-jing',
            elem: '#testfive',
            height: 370
            , url: basePath + '/Type/Category'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listTwo //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'nAME', width: "150%", title: '警情类型选择', align: 'center', }

            ]]
            // , page: true
        });

    });
}











// 详细类
xiangxi();
function xiangxi() {
    layui.use('table', function () {

        var table = layui.table;
        var $browsers = $("input[name=la]");
        $('#cound-2').click(function () {
           
            // 派出所
            var checkStatus = layui.table.checkStatus('six').data;
            //    console.log(checkStatus)
            var ids = [];

            for (var i = 0; i < checkStatus.length; i++) {
                ids.push(checkStatus[i].name)
            }
            if (ids.length < 1) {
                layer.msg('无选中派出所分类项');
                return false;
            }
            var idd = JSON.stringify(ids);//必须要写，不然后台获取不到数据
            console.log(idd)
            // 警情小分类
            // var checkStatus2 = layui.table.checkStatus('sev').data;
            // var id2 = [];
            //  $browsers.attr("checked", false);
            // for (var i = 0; i < checkStatus2.length; i++) {
            //     id2.push(checkStatus2[i].nAME)

            // $('input:radio[name="layTableRadio_9"]').change(function () {
            //     $browsers.attr("checked", false);
            // })

            // }
            // if (id2.length < 1) {
            //     layer.msg('无选中警情分类项');
            //     return false;
            // }
            // var idd2 = JSON.stringify(id2);//必须要写，不然后台获取不到数据
            // console.log(idd2)
            // toString()
            // 警情大类
            // var test_list = []
            // $("[name=dx]:radio").each(function () {
            //     test_list.push($(this).val())
            // });
            // var test_str = JSON.stringify(test_list);
            // console.log(test_str)

            //   统计
            // var test_list2 = []
            // $("[name=layTableRadio_9]:radio").each(function () {
            //     test_list2.push($(this).val())
            // });
            // var test_str2 = test_list2.toString();

            // console.log(test_str2)
            // 计算
            var test_list3 = []
            $("[name=tc]:checked").each(function () {
                test_list3.push($(this).val())
            });
            var test_str3 = JSON.stringify(test_list3);

            console.log(test_str3)

            // var px = []
            // $("[name=tz]:radio").each(function () {
            //     px.push($(this).val())
            // });
            // var pxs = px.toString();
            var zo = $("input[name='layTableRadio_9']:checked").val();
            console.log(zo)
            // 排序
            var pxs = $("input[name='tz']:checked").val();
            console.log(pxs)

            // 开始时间
            var str = $("#test99").val();
            // 结束时间
            var end = $("#test1010").val();
            // 同比月份
            // 开始时间
            var str1 = $("#test1111").val();
            // 结束时间
            var end1 = $("#test1212").val();
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
            if (str1 == "") {
                layer.msg("请选择同比月份开始时间")
                return false;
            }
            if (end1 == "") {
                layer.msg("请选择同比月份结束时间")
                return false;
            }
            if (zo == "") {
                layer.msg("请选择分类统计及排序中的一项")
                return false;
            }
           
            $("#tishi").css("display", "block")
            $.ajax({
                type: "post",
                url: basePath + "/Jqtj/three",
                data: {
                    pcs: idd,
                    threeRadioVal: zo,


                    px: pxs,
                    js: test_str3,
                    startTime: str,
                    beginTime: str1,
                    stopTime: end,
                    endTime: end1,
                },
                dataType: "json",
                success: function (data) {
                    $("#tishi").css("display", "none")
                    console.log(data)
                    $('#content').html('');
                    $("#content").show();
                    $("#tishi").hide();
                    // document.getElementById("exportType").value = "one";
                    var oneDate = typeof data == 'string' ? JSON.parse(data) : data;
                    // var oneDate = $.parseJSON(data);
                    console.log(oneDate)
                    var table = $(
                        "<table class=\"table-hover table-bordered\" style=\"margin-top: 10px;text-align: center;width: 300%;color: aliceblue;\"></table>"
                    );
                    table.appendTo("#content");
                    var flHead = $("<thead style='background: #10a7b3;'><tr ></tr></thead>");
                    flHead.appendTo(table);
                    var fl;
                    var sj;
                    for (var i in oneDate) {
                        fl = $.parseJSON(i);
                        sj = $.parseJSON(oneDate[i]);
                        document.getElementById("exportTitle").value = fl;
                        document.getElementById("exportValue").value = JSON
                            .stringify(sj);
                    }
                    for (var k in fl) {
                        var fl_Th = $("<th>" + fl[k] + "</th>");
                        fl_Th.appendTo(flHead);
                    }
                    var sjBody = $("<tbody></tbody>");
                    sjBody.appendTo(table);
                    for (var j in sj) {
                        var sjTr = $("<tr></tr>");
                        sjTr.appendTo(sjBody);
                        var sjTdPcs = $("<td>" + j + "</td>");
                        sjTdPcs.appendTo(sjTr);
                        var sjTotal = $.parseJSON(sj[j]);
                        for (var l in sjTotal) {
                            var sjTdTotal = $("<td >" + sjTotal[l] +
                                "</td>");
                            sjTdTotal.appendTo(sjTr);
                        }
                    }

                }
            });
        });
        table.render({
            id: 'six',
            elem: '#testsix',
            height: 370
            , url: basePath + '/Type/Pcs'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listJson //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'name', width: "150%", title: '管辖区域选择', align: 'center', }

            ]]
            // , page: true
        });
        table.render({
            id: 'sev',
            elem: '#testsev',
            height: 370
            , url: basePath + '/Type/Category'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 1000, //解析数据长度
                    "data": res.listTwo //解析数据列表
                };
            }

            , cols: [[
                { type: 'checkbox', title: '全选', align: 'center', width: "274%" }
                , { width: "240%", title: '序号', type: 'numbers', align: 'center' }
                , { field: 'nAME', width: "150%", title: '警情类型选择', align: 'center', }
            ]]
            // , page: true
        });

    });
}










