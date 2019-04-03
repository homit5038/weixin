/**
 * Created by wy on 2016/1/9.
 */
var printWidth = $("#printerWidth").val();
if (printWidth == 199 || printWidth == 249 || printWidth == 2414 || printWidth == 1214 || printWidth == 129 || printWidth == 1914) {
    //横版打印机
    var printBillType = 1;
}
else {
    //竖版打印机
    var printBillType = 0;
}
function chooseKid() {
    var flag = true;
    var initChildId = $("#initChildId").val();
    $(".schoolId").each(function () {
        var obj = $(this);
        if (initChildId == obj.attr("name")) {
            var objTr = obj.parent();
            objTr.click();
            var objTr = objTr[0];  //转化为dom对象
            $("#AllKid").animate({scrollTop: objTr.offsetTop}, "fast"); //定位tr
            flag = false;
        }
    });
    if (flag) {
        //初始化table第一项
        $('.kinder-list-tr').eq(0).click();
    }
}
window.onload = chooseKid;//不要括号
$(function () {
    $("#table-kinder-list").show();
    var doflag = true;

    //搜索框获得焦点
    $(".kinder-search").focus();

    //搜索实现
    var timeS;
    $(".kinder-search").keyup(function () {
        clearTimeout(timeS);
        timeS = setTimeout(function () {
            searchChildByNameAndPy();
        }, 1000);
    });
    $(document).on("keydown" ,".kinder-search",function (e) {
        e = e||event;
        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if(keyCode==13){
            e.preventDefault();
            searchChildByNameAndPy();
        }
    });
    function searchChildByNameAndPy() {
        var pyInput =$(".kinder-search").val();
        $("#tbodyCharge").empty();
        jQuery.ajax({
            url: $("#path").val() + '/charge/chargeNameSearch.do?pinYin='+pyInput,
            method: 'post',
            success: function (data) {
                $.each(data,function(i,child){
                    var tr = $('<tr class="kinder-list-tr"></tr>');
                    var childSchoolId=$('<td class="schoolId" name="'+child.childId +'">'+child.childSchoolId +'</td>');
                    var childName=$('<td><span class="kinderName">'+child.childName+'<input type="hidden" class="childId" value="'+child.childId+'"/></span></td>');
                    var childClassName=$('<td class="kidClass">'+child.childClassName+'</td>');
                    var parentName=$('<td>'+child.parentName+'</td>');
                    var attendance=$('<td class="kidAttend">'+child.attendance+'天</td>');
                    var isArrear;
                    if(child.isArrear!='0'){
                        isArrear=$("<td><button type='button' class='btn btn-sm btn-danger arrears-list-btn'>欠费信息</button>"+
                            "<input type='hidden' name='"+child.childId+"'><input type='hidden' name='"+child.childName+"'>"+
                            "<button type='button' class='btn btn-sm charge-history-btn'>历史缴费</button></td></tr>");
                    }else{
                        isArrear=$("<td><input type='hidden' name='"+child.childId+"'><input type='hidden' name='"+child.childName+"'>"+
                            "<button type='button' class='btn btn-sm charge-history-btn'>历史缴费</button></td></tr>");
                    }
                    tr.append(childSchoolId,childName,childClassName,parentName,attendance,isArrear);
                    $('#table-kinder-list').append(tr);
                });
                changeKinder($(".kinder-list-tr:first"));
            }
        });
    }

    //幼儿表格中，点击行选中幼儿进行收费
    $(document).on('click', ".kinder-list-tr", function () {
        changeKinder($(this));
        $("#display-all-items").attr("checked", false);
    });

    //修改被选中的幼儿
    function changeKinder(selectedKinder) {

        $("#flowCode").val("");
        var childId;
        $("#table-charge-detail tr:not(.table-head)").remove();

        $(".kinder-list-tr").removeClass("active");
        selectedKinder.addClass("active");

        if (selectedKinder.length != 0) {
            $("#selected-kinder").html(selectedKinder.find(".kinderName").html());
            $("#selected-kinder2").html(selectedKinder.find(".kinderName").html());
            $("#kidName").html(selectedKinder.find(".kinderName").html());
            $("#kidClass").html(selectedKinder.find(".kidClass").html());
            $("#kidNameb").html(selectedKinder.find(".kinderName").html());
            $("#kidClassb").html(selectedKinder.find(".kidClass").html());
            $("#kidNum").html(selectedKinder.find(".schoolId").html());
            $("#kidNumb").html(selectedKinder.find(".schoolId").html());
            $("#kidAttend").html(selectedKinder.find(".kidAttend").html());
            $("#kidAttendb").html(selectedKinder.find(".kidAttend").html());
            childId = selectedKinder.find(".childId").val();
            $("#childId").val(childId);
        }
        var itemsExample = new Array();
        //在此发送ajax请求，获取选中幼儿的收费项
        jQuery.ajax({
            url: $("#path").val() + '/charge/selectChildChargeRelation.do',
            data: 'childId=' + childId,
            method: 'post',
            async: false,
            dataType: 'json',
            success: function (data) {

                var mylist = data.pl;
                var alllist = data.cil;
                for (var i in  alllist) {
                    // 1按保育费 2按月 3按天
                    var name = null;
                    if (alllist[i].chargingPeriod == 1) {
                        name = '按保育费';
                    }
                    if (alllist[i].chargingPeriod == 2) {
                        name = '按月';
                    }
                    if (alllist[i].chargingPeriod == 3) {
                        name = '按天';
                    }
                    if (alllist[i].chargingPeriod == 4) {
                        name = '按天退费';
                    }
                    if (alllist[i].chargingPeriod == 5) {
                        name = '其他';
                    }
                    var tr = $('<tr class="hidden"></tr>');
                    var cid = $('<td width="10%" class="td-select"><input type="checkbox" class="charge-item"  value="' + alllist[i].cid + '" /></td>');
                    var chargingName = $('<td width="30%" class="charge-name">' + alllist[i].chargingName + '</td>');
                    var chargingPeriod = $('<td width="20%">' + name + '</td>');
                    var chargingAmount = "";
                    if (alllist[i].chargingPeriod == 5) {
                        chargingAmount = $('<td width="20%"><input type="text" class="form-control input-sm text-center other-charge-item" value="' + alllist[i].chargingAmount + '"/><input type="hidden" class="charge-amount" value="' + alllist[i].chargingAmount + '" /><input type="hidden" class="print-group" value="' + alllist[i].ticketLevel + '"> </td>');
                    } else {
                        chargingAmount = $('<td width="20%">' + alllist[i].chargingAmount + '<input type="hidden" class="charge-amount" value="' + alllist[i].chargingAmount + '" /><input type="hidden" class="print-group" value="' + alllist[i].ticketLevel + '"> </td>');
                    }

                    tr.append(cid, chargingName, chargingPeriod, chargingAmount);
                    $("#table-charge-detail").append(tr);

                }
                if (mylist != null) {
                    // $("#flowCode").val(mylist[0].flowCode);
                }
                for (var i in  mylist) {
                    itemsExample[i] = mylist[i].cid;
                }
            }
        });


        //计算缴费  收费项关联

        changeItems(itemsExample);
        chargeCount();

        //查询缴费历史
        var weChatIsSet=$("#weChatIsSet").val();
        var alipayIsSet=$("#alipayIsSet").val();
        jQuery.ajax({
            url: $("#path").val() + '/charge/findChildHistoryInfoByChildId.do',
            data: 'childId=' + childId,
            method: 'post',
            dataType: 'json',
            success: function (data) {
                $("#table-charge-history tr:not(.table-head)").remove();
                for (var i in  data) {
                    var tr = $('<tr></tr>');
                    var flowCode = $('<td width="20%">' + data[i].flowCode + '</td>');
                    var amount = $('<td  width="20%">' + data[i].payed + '</td>');
                    var payDate = $('<td  width="20%">' + new Date(data[i].payDate).format("yyyy-MM-dd") + '</td>');
                    var payType = '';
                    var col = $('<td  width="20%"><a cid="' + data[i].cid + '" name="' + data[i].flowCode + '" class="printbill" href="javascript:void(0);">补打小票</a>' +
                        ' &nbsp;&nbsp;&nbsp;<a name="' + data[i].cid + '" class="delhistory" href="#">删除</a></td>');
                    var col2=$('<td  width="20%"><a cid="' + data[i].cid + '" name="' + data[i].flowCode + '" class="printbill" href="javascript:void(0);">补打小票</a></td>');
                    if (data[i].payType == '1') {
                        payType = $('<td  width="20%">现金</td>');
                        tr.append(flowCode, amount, payDate, payType, col);
                    }
                    if (data[i].payType == '2') {
                        payType = $('<td  width="20%">刷卡</td>');
                        tr.append(flowCode, amount, payDate, payType, col);
                    }
                    if (data[i].payType == '3'&&weChatIsSet!=0){
                        payType = $('<td  width="20%">微信</td>');
                        tr.append(flowCode, amount, payDate, payType, col2);
                        // tr.append(flowCode, amount, payDate, payType, col);
                    }
                    if (data[i].payType == '3'&&weChatIsSet==0){
                        payType = $('<td  width="20%">微信</td>');
                        tr.append(flowCode, amount, payDate, payType, col);
                    }
                    if (data[i].payType == '4'&&alipayIsSet==0) {
                        payType = $('<td  width="20%">支付宝</td>');
                        tr.append(flowCode, amount, payDate, payType, col);
                    }
                    if (data[i].payType == '4'&&alipayIsSet!=0) {
                        payType = $('<td  width="20%">支付宝</td>');
                        tr.append(flowCode, amount, payDate, payType, col2);
                    }
                    $("#table-charge-history").append(tr);
                }
            }
        });

    }

    //删除历史缴费
    $(document).on('click', '.delhistory', function (e) {
        e.preventDefault();
        var cid = $(this).attr("name");
        var initChildId = $("#initChildId").val();
        bootbox.confirm("是否确定删除？", function (result) {
            if (result) {
                jQuery.ajax({
                    url: $("#path").val() + '/charge/delChargingInfoHistory.do',
                    data: 'cid=' + cid,
                    method: 'post',
                    success: function (data) {
                        if ('norlue' == data) {
                            bootbox.alert("无权限！");
                        }
                        if ('success' == data) {
                            bootbox.alert("删除成功！");
                            $("#initChildId").val(initChildId);
                            setTimeout(function () {
                                location.reload();
                            }, 1500)
                        }
                        if ('false' == data) {
                            bootbox.alert("历史月份费用已结算，无法删除！");
                        }
                    }
                });
            }
        })


    });

    //补打小票
    $(document).on('click', '.printbill', function () {
        var flowCode = $(this).attr("name");
        var cid = $(this).attr("cid");
        //查询历史总共信息
        jQuery.ajax({
            url: $("#path").val() + '/charge/findHistoryByCid.do',
            data: 'cid=' + cid,
            method: 'post',
            async: false,
            dataType: 'json',
            success: function (data) {
                //总共实收应收
                $("#kidTotalMoneyb").html(data.amount);
                $("#kidRealMoneyb").html(data.payed);
                if (printBillType == 1) {
                    $("#kidRealMoneyUppercaseb").html(digit_uppercase(data.payed));
                }
                if (data.favourable == '1') {
                    $("#kidShouldMoneyb").html(data.payed);
                } else if (data.favourable == '0') {
                    $("#kidShouldMoneyb").html(data.amount);
                }
                var paytype =  '';
                if(data.payType==1){
                    paytype="现金";
                }
                if(data.payType==2){
                    paytype="刷卡";
                }
                if(data.payType==3){
                    paytype="微信"
                }
                if(data.payType==4){
                    paytype="支付宝";
                }
                $("#kidPaytypeb").html(paytype);
                $("#kidUsernameb").html(data.userName);
                $("#kidAttendb").html(data.attendDays+"天");
                $("#kidBzb").html(data.bz);
                if (data.payableDate != null) {
                    var paydate = data.payableDate.substr(0, data.payableDate.lastIndexOf('-'));
                    $("#kidPayableDate").html(paydate + "（补打小票）");
                }
                else {
                    var date = new Date(data.payDate);
                    var payDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
                    $("#kidPayableDate").html(payDate + "（补打小票）");
                }
            }
        });
        //查询详细信息
        jQuery.ajax({
            url: $("#path").val() + '/charge/findChargeInfoDetail.do',
            data: 'flowCode=' + flowCode,
            method: 'post',
            async: false,
            dataType: 'json',
            success: function (data) {
                $(".othertrb").remove();
                if (printBillType == 1) {
                    var printCount = 0;
                    var tr = '<tr class="othertrb">';
                }
                for (var i in  data) {
                    if (printBillType == 0) {
                        var tr = $('<tr class="othertrb"></tr>');
                        var cName = $('<td>' + data[i].chargingItemName + '</td>');
                        var cAmount = $('<td>' + data[i].chargingAmount + '元</td>');
                        tr.append(cName, cAmount);
                        $("#printtableb").append(tr);
                    }
                    else if (printBillType == 1) {
                        tr += "<td>" + data[i].chargingItemName + "：" + data[i].chargingAmount + '</td>';
                        if (printCount % 2 == 1) {
                            tr += '</tr><tr class="othertrb">';
                        }
                        printCount++;
                    }
                }
                if (printBillType == 1) {
                    tr += "</tr>";
                    $("#printtableb").append($(tr));
                }
                $("#kidFlowCodeb").html(flowCode);
                //时间
                var time = getTime();
                $("#kidTimeb").html(time);

            }
        });
        printCount();
        printTicket($("#printerName").val(), "#wrapb", $("#printerWidth").val());
    });
    //修改被选中的幼儿默认收费项
    function changeItems(items) {
        $(".charge-item").each(function () {
            if ($.inArray($(this).val(), items) != -1) {
                $(this).prop("checked", true);
                $(this).parent().parent().removeClass("hidden").addClass("active");
            }
            else {
                $(this).prop("checked", false);
                $(this).parent().parent().addClass("hidden").removeClass("active");
            }
        });
    }

    //“实交”文本框处理
    $("input[name=charge-real-pay]").focus(function () {
        $(this).val() == 0 ? $(this).val("") : "";
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^\.|\d]|^0/g, ''));
        var chargeReturn = parseFloat($(this).val()) - parseFloat($("input[name=charge-should-pay]").val());
        if (isNaN(chargeReturn)) {
            $("input[name=charge-return]").val(parseFloat("0").toFixed(2));
        }
        else {
            if (chargeReturn >= 0) {
                $("input[name=charge-return]").val(parseFloat(chargeReturn).toFixed(2));
            } else {
                $("input[name=charge-return]").val(parseFloat("0").toFixed(2));
            }
        }

    }).bind("paste", function () {
        $(this).val($(this).val().replace(/[^\.|\d]|^0/g, ''));
    });

    //显示全部收费项
    $("#display-all-items").click(function () {
        if ($(this).prop("checked") == true) {
            $("#table-charge-detail tr").removeClass("hidden");
        }
        else {
            $("#table-charge-detail tr").not(".active").addClass("hidden");
            $(".table-head").removeClass("hidden");
        }
    });

    //收费项表格，点击行即选中本行
    $(document).on('click', '#table-charge-detail tr .td-select', function () {
        if ($(this).find("input[type=checkbox]").prop("checked")) {
            $(this).find("input[type=checkbox]").prop("checked", false);
            $(this).removeClass("active");
        }
        else {
            $(this).find("input[type=checkbox]").prop("checked", true);
            $(this).addClass("active");
        }
        chargeCount();
    });


    $(document).on('click', '#table-charge-detail input[type=checkbox]', function (e) {
        e.stopPropagation();
        if (!$(this).prop("checked")) {
            $(this).parent().parent().removeClass("active");
        }
        else {
            $(this).parent().parent().addClass("active");
        }
        chargeCount();
    });

    //欠费信息、历史缴费按钮弹出新窗口
    $(document).on('click', ".arrears-list-btn", function () {
        var childId = $(this).next().attr("name");
        var childName = $(this).next().next().attr("name");
        var weChatIsSet=$("#weChatIsSet").val();
        var alipayIsSet=$("#alipayIsSet").val();
        window.open($("#path").val() + '/charge/selectChildOwingInfoByChildId.do?childId=' + childId
            + '&childName=' + childName+'&weChatIsSet='+weChatIsSet+'&alipayIsSet='+alipayIsSet, '', 'width=1000,height=600,menubar=no,top=50,left=400')
    });
    $(document).on('click', ".charge-history-btn", function () {
        var childId = $(this).prev().prev().attr("name");
        var childName = $(this).prev().attr("name");
        window.open($("#path").val() + '/charge/selectChildHistoryInfoByChildId.do?childId=' + childId
            + '&childName=' + childName, '', 'width=1000,height=600,menubar=no,top=50,left=400')
    });

    $(document).on('click', "#doCharge", function () {
        if (doflag) {
            var shouldpay = parseFloat($("#shouldpay").val());
            var realpay = parseFloat($("#realpay").val());
            if (isNaN(realpay)) {
                bootbox.alert("实收费用不能为空！");
                return false;
            }
            if (shouldpay > realpay) {
                bootbox.dialog({
                    message: "实收金额小于应收金额请选择操作：",
                    title: "提示",
                    buttons: {
                        success: {
                            label: "优惠",
                            className: "btn-success",
                            callback: function () {
                                $("#favourable").val("1");
                                $(".btn-success").attr("disabled",true);
                                addCharge(doflag);

                            }
                        },
                        danger: {
                            label: "欠费",
                            className: "btn-danger",
                            callback: function () {
                                $("#favourable").val("0");
                                $(".btn-danger").attr("disabled",true);
                                addCharge(doflag);
                            }
                        }
                    }
                });
            } else {
                addCharge(doflag);
            }
        }
    });
    function addCharge(flag) {
        var payType=$("input[name='paytype']:checked").val();
        var weChatIsSet=$("#weChatIsSet").val();
        if("3"==payType &&weChatIsSet!=0){
            //接入扫描枪
            $("#add-pay-code-modal").modal("show");
            $("#payCode").val("");
            $("#payCode").focus();
        }else{
            addChargeToReal(flag);
        }
    }
});
function addChargeToReal(flag){
    if (flag) {
        doflag = false;
        var oid = [];
        var temp = [];
        var chargeItemToPrint = [];
        var colCount = 0;
        $("#table-charge-detail tr").each(function () {
            if ($(this).find(".charge-item").prop("checked") == true) {
                var chargingItemName = $(this).find(".charge-name").html();
                var chargingAmount = $(this).find(".charge-amount").val();
                var chargeItemId = $(this).find(".charge-item").val();
                var printGroup = $(this).find(".print-group").val();
                var flowCode = $("#flowCode").val();
                var inOutFlag = "1";
                if (parseFloat(chargingAmount) < 0) {
                    var inOutFlag = "0";
                }

                temp.push("{'chargingItemName':");
                temp.push("'" + chargingItemName + "'");
                temp.push(",'chargingAmount':");
                temp.push(chargingAmount);
                temp.push(",'chargeItemId':");
                temp.push("'" + chargeItemId + "'");
                temp.push(",'flowCode':");
                temp.push("'" + flowCode + "'");
                temp.push(",'inOutFlag':");
                temp.push("'" + inOutFlag + "'");
                temp.push("},");

                //添加打印小票
                if (chargeItemToPrint[printGroup] == undefined) {
                    if (printBillType == 0) {
                        chargeItemToPrint[printGroup] = "";
                    }
                    else if(printBillType == 1) {
                        chargeItemToPrint[printGroup] = '<tr class="othertr">';
                    }
                }
                if (printBillType == 0) {
                    chargeItemToPrint[printGroup] += '<tr class="othertr">';
                    chargeItemToPrint[printGroup] += '<td>' + chargingItemName + '</td>';
                    chargeItemToPrint[printGroup] += '<td>' + chargingAmount + '元</td>';
                    chargeItemToPrint[printGroup] += '</tr>';
                }else {
                    if (colCount % 2 == 0){
                        chargeItemToPrint[printGroup] += '</tr><tr class="othertr">';
                    }
                    chargeItemToPrint[printGroup] += "<td>" + chargingItemName + "：" + chargingAmount + "元 </td>";
                    colCount++;
                }
            }
        });
        colCount = 0;

        oid.push(temp.join(""));
        // $("#doCharge").attr("disabled",true);
        jQuery.ajax({

            url: $("#path").val() + '/charge/addChargePay.do?' + $('#myform').serialize(),
            data: {"oid": oid},
            method: 'post',
            async: false,

            error: function (request) {
                bootbox.alert("缴费失败！");
                doflag = true;
            },
            success: function (data) {
                if (data != null) {
                    bootbox.alert("缴费成功！");
                    setPrint(data);
                    var printGroup = $("#printGroup").val();
                    for (var i = 1; i <= printGroup; i++) {
                        if (chargeItemToPrint[i] == "" || chargeItemToPrint[i] == undefined) {
                            continue;
                        }
                        $("#printtable .othertr").remove();
                        $("#printtable").append($(chargeItemToPrint[i]));
                        printTicket($("#printerName").val(), "#wrap", $("#printerWidth").val());
                    }
                    doflag = true;

                } else {
                    bootbox.alert("缴费失败！");
                    doflag = true;
                }

                setTimeout(function () {
                    //window.location.reload();
                    var childId = $("#childId").val();
                    var pyInput =$(".kinder-search").val();
                   window.location.href = $("#path").val() + "/charge/chargeMain.do?childId=" + childId+"&pinYin="+pyInput;
                    // window.location.href = $("#path").val() + "/charge/chargeMain.do?childId=" + childId;
                }, 2000)
            }
        });
    }
}
$(document).on("keydown" ,"#payCode",function (e) {
    e = e||event;
    var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if(keyCode==13){
        e.preventDefault();
        keyDownCode(true);
    }
});
function keyDownCode(flag) {
    //对接微信接口
    var authCode=$("#payCode").val();
    var shouldPay=$("#shouldpay").val();
    var totalFee=$("#realpay").val();
    if(shouldPay<=totalFee){
        totalFee=shouldPay;
    }
    if(totalFee==0){
        bootbox.alert("缴费金额错误！");
        return;
    }
    var flowCode = $("#flowCode").val();
    $("#add-pay-code-modal").modal("hide");
    //遮罩层显示
    $('body').css("overflow","hidden");
    $('#cover').show();
    jQuery.ajax({
        url: $("#path").val() + '/common/micropay.do?authCode='+authCode+"&totalFee="+totalFee,
        method: 'post',
        success: function (data) {
            if("0"==data){
                //遮罩层隐藏
                $('body').css("overflow","auto");
                $('#cover').hide();
                $.zui.messager.warning("缴费失败！");
            }else if("1"==data){
                //遮罩层隐藏
                $('body').css("overflow","auto");
                $('#cover').hide();
                addChargeToReal(flag);
            }else if("2P"==data.substr(0,2)){
                var outTradeNo=data.substr(2,data.lenth);
                //$.zui.messager.warning("请等待用户支付。。。");
                jQuery.ajax({
                    url: $("#path").val() + '/common/micropayPassWord.do?outTradeNo='+outTradeNo,
                    method: 'post',
                    success: function (data) {
                        if(data=='1'){
                            //遮罩层隐藏
                            $('body').css("overflow","auto");
                            $('#cover').hide();
                            addChargeToReal(flag);
                        }else{
                            //遮罩层隐藏
                            $('body').css("overflow","auto");
                            $('#cover').hide();
                            $.zui.messager.warning(data+", 缴费失败！");
                        }
                    }
                });
            }else{
                // $("#payCode").val("");
                // $("#payCode").focus();
                //遮罩层隐藏
                $('body').css("overflow","auto");
                $('#cover').hide();
                $.zui.messager.warning(data);

            }
        }

    });

}
$(document).on("click","#pay-code-save-btn",function () {
    keyDownCode(true);
});
//现金刷卡

$(document).on("change", ".paytype", function(){
    var value = $("input[name='paytype']:checked").val();
    //如果为刷卡 则需要判断是否绑定
    if (value == '2') {
        jQuery.ajax({
            url: $("#path").val() + '/charge/selectBankCardPosFlagByKid.do',
            method: 'post',
            async: false,
            success: function (data) {
                if (data == 'success') {
                } else if (data == 'false') {
                    $.zui.messager.warning("未绑定银行卡 请先绑定银行卡！");
                    $("#paytypeCash").click();
                }
            }
        });
    }
    value = $("input[name='paytype']:checked").val();
    $("#paytype").val(value);

});

//给小票赋值
function setPrint(flowCode) {
    //小票号
    $("#kidFlowCode").html(flowCode);
    //时间
    var time = getTime();
    $("#kidTime").html(time);
    //总共实收应收找零
    $("#kidTotalMoney").html($("#shouldpay").val());
    $("#kidRealMoney").html($("#realpay").val());

    if (printBillType == 1) {
        $("#kidRealMoneyUppercase").html(digit_uppercase($("#realpay").val()));
    }
    var checkedPaytype = $("input[name='paytype']:checked").val();
    var paytype =  '';
    if(checkedPaytype==1){
        paytype="现金";
    }
    if(checkedPaytype==2){
        paytype="刷卡";
    }
    if(checkedPaytype==3){
        paytype="微信"
    }
    if(checkedPaytype==4){
        paytype="支付宝";
    }
    $("#kidPaytype").html(paytype);
    $("#kidShouldMoney").html($("#shouldpay").val());
    $("#kidReturnMoney").html($("#returnpay").val());
    $("#kidBz").html($("#bz").val());
}

//“其他”类别收费项被点击时，不让本收费项取消选中
$(document).on("click", ".other-charge-item", function(e) {
    e.stopPropagation();
});

//“其他”类别收费项，修改金额处理
$(document).on("keyup", ".other-charge-item", function (e) {
    if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        return;
    }
    $(this).val($(this).val().replace(/[^0-9.-]/g, ''));
    $(this).next().val($(this).val());
    chargeCount();
});

//修改收费合计
function chargeCount() {
    var amount = 0;
    $("#table-charge-detail tr").each(function () {
        if ($(this).find(".charge-item").prop("checked") == true) {
            amount += parseFloat($(this).find(".charge-amount").val());
        }
    })
    $("input[name=charge-should-pay]").val(parseFloat(amount).toFixed(2));
    $("input[name=charge-real-pay]").val(parseFloat(amount).toFixed(2));

    var realpay = parseFloat($("input[name=charge-real-pay]").val());
    if (realpay == null) {
        realpay = 0;
    }
    var chargeReturn = realpay - parseFloat($("input[name=charge-should-pay]").val());
    if (isNaN(chargeReturn)) {
        $("input[name=charge-return]").val(parseFloat("0").toFixed(2));
    }
    else {
        if (chargeReturn >= 0) {
            $("input[name=charge-return]").val(parseFloat(chargeReturn).toFixed(2));
        } else {
            $("input[name=charge-return]").val(parseFloat("0").toFixed(2));
        }
    }

}