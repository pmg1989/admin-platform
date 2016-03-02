/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />
/// <reference path="../Core/knockout-json.min.js" />

//knockout 基类数据
var viewModel = {
    startDate: ko.observable(),
    endDate: ko.observable(),
    list: ko.observable({}),
    isSelectAll: ko.observable(false),
    selectText: ko.observable("全选"),

    //全选/取消全选事件
    selectAll: function () {
        if (!viewModel.isSelectAll()) {
            viewModel.selectText("取消");
        } else {
            viewModel.selectText("全选")
        }
        ko.utils.arrayForEach(viewModel.list()(), function (data) {
            data.isSelected(!viewModel.isSelectAll());
        });
        viewModel.isSelectAll(!viewModel.isSelectAll());
    },
    baseDeleteAll: function (callback) {
        var delArray = [], i = 0;
        ko.utils.arrayForEach(viewModel.list()(), function (data) {
            if (data.isSelected()) {
                delArray[i++] = data.Id();
            }
        });
        page.dialogConfirm(function () {
            if (callback) {
                callback(delArray);
            }
        }, delArray.length == 0);
    },
    // 重绘类型
    renderType: function (value) {
        switch (value) {
            case 0:
                value = "个人业主"; break;
            case 1:
                value = "公司"; break;
            default:
                value = "个人业主"; break;
        }
        return value;
    },
    //时间格式转化
    renderDateTime: function (value) {
        return utility.JsonDateToDateTimeString(value);
    }
};

//日期选择器参数
var datePickerParam = {
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['年 1 月', '年 2 月', '年 3 月', '年 4 月', '年 5 月', '年 6 月', '年 7 月', '年 8 月', '年 9 月', '年 10 月', '年 11 月', '年 12 月'],
    dateFormat: 'yy-mm-dd',
    showMonthAfterYear: true
    //minDate: new Date()
};
//日期格式化
var formatDate = function (str) {
    var arr = str.split("-");
    return new Date(arr[0], arr[1] - 1, arr[2]);
};

var page = {
    //分页显示数
    pageSize: 10,
    //当前页数
    myCurPage: 0,
    //初始化时间搜索框
    initSearchDateInput: function () {
        $("#startDate").attr("readonly", "readonly").css("cursor", "pointer");
        $("#endDate").attr("readonly", "readonly").css("cursor", "pointer");

        $('#startDate').datepicker($.extend({}, datePickerParam, {
            onSelect: function (dateText, inst) {
                var startDate = formatDate(dateText);
                viewModel.startDate(dateText);
                $("#endDate").datepicker("option", "minDate", startDate);
            }
        }));
        $('#endDate').datepicker(datePickerParam, {
            onSelect: function (dateText, inst) {
                viewModel.endDate(dateText);
            }
        });
    },
    //封装ajax
    executeAjax: function (param) {
        $.ajax({
            url: param.url + "?v=" + $.now(),
            type: typeof (param.isPost) == "undefined" ? "GET" : "POST",
            data: param.param,
            beforeSend: function () {
                $("body").append('<div id="ajaxBg" class="ajaxBg"></div>');
            },
            success: function (data) {
                if (typeof (param.success) == 'function') {
                    data = JSON.parse(data);
                    if (data.IsSuccess) {
                        if (data.rows && data.total) {
                            for (var i = 0; i < data.rows.length; i++) {
                                data.rows[i].isSelected = false;
                            }
                        }
                        param.success(data, param.param);
                    } else {
                        page.dialogOK("对不起，数据返回出错！<br/>" + data.ErrMsg);
                    }
                    $('#ajaxBg').remove();
                }
            },
            error: function (data) {
                page.dialogOK("对不起，数据请求出错，请稍后重试！");
                $('#ajaxBg').remove();
            },
            dateType: "json"
        });
    },
    //绑定分页控件
    pageBind: function (count, pageNo) {
        $("#pager").pager({
            resultCount: count, pageSize: page.pageSize, curPage: pageNo, showPage: function (pageNo) {
                page.getPageList(pageNo);
                page.myCurPage = pageNo;
            }, clearCache: function () {
                page.clearCache();
            }
        });
    },
    getCache: function (_id) {
        var flag = false;
        if (page.cache[_id]) {
            viewModel.list(ko.mapping.fromJS(page.cache[_id]));
            flag = true;
        }
        return flag;
    },
    addCache: function (_id, _value) {
        page.cache[_id] = _value;
    },
    clearCache: function () {
        page.cache = [];
    },
    //Tab控制函数
    tabs: function (tabObj) {
        var tabNum = $(tabObj).parent().index("li")
        //设置点击后的切换样式
        $(tabObj).parent().parent().find("li a").removeClass("selected");
        $(tabObj).addClass("selected");
        //根据参数决定显示内容
        $(".tab-content").hide();
        $(".tab-content").eq(tabNum).show();
    },
    //========================基于common.js自定义插件========================
    //开关按钮
    ruleSingleCheckbox: function () {
        $(".rule-single-checkbox").ruleSingleCheckbox();
    },
    //复选框1
    ruleMultiCheckbox: function () {
        $(".rule-multi-checkbox").ruleMultiCheckbox();
    },
    //复选框2
    ruleMultiPorp: function () {
        $(".rule-multi-porp").ruleMultiPorp();
    },
    //单选按钮
    ruleMultiRadio: function () {
        $(".rule-multi-radio").ruleMultiRadio();
    },
    //下拉框
    ruleSingleSelect: function () {
        $(".rule-single-select").ruleSingleSelect();
    },
    //========================以上基于common.js自定义插件========================
    //========================基于lhgdialog插件========================
    //可以自动关闭的提示，基于lhgdialog插件
    dialogTips: function (msgtitle, msgcss, url, callback) {
        var iconurl = "";
        switch (msgcss) {
            case "Hits":
                iconurl = "32X32/hits.png";
                break;
            case "Success":
                iconurl = "32X32/succ.png";
                break;
            case "Error":
                iconurl = "32X32/fail.png";
                break;
            default:
                iconurl = "32X32/succ.png";
                break;
        }
        $.dialog.tips(msgtitle, 1.5, iconurl, function () {
            if (url == "back") {
                frames["mainframe"].history.back(-1);
            } else if (typeof (url) != "undefined") {
                var iframe = $(window.parent.document).find("#mainframe");
                if (iframe.length > 0) {
                    iframe.attr("src", url);
                } else {
                    $(window.parent.parent.document).find("#mainframe").attr("src", url);
                }
            }
            //执行回调函数
            if (arguments.length == 4) {
                callback();
            }
        });
    },
    //弹出一个Dialog窗口
    dialogOK: function (msgcontent, msgtitle, url, msgcss, callback) {
        var iconurl = "";
        var argnum = arguments.length;
        switch (msgcss) {
            case "success":
                iconurl = "success.gif";
                break;
            case "error":
                iconurl = "error.gif";
                break;
            default:
                iconurl = "alert.gif";
                break;
        }
        var dialog = $.dialog({
            title: msgtitle || "警告！",
            content: msgcontent,
            fixed: true,
            min: false,
            max: false,
            lock: true,
            icon: iconurl,
            ok: true,
            close: function () {
                if (url == "back") {
                    history.back(-1);
                } else if (url != "") {
                    var iframe = $(window.parent.document).find("#mainframe");
                    if (iframe.length > 0) {
                        iframe.attr("src", url);
                    } else {
                        $(window.parent.parent.document).find("#mainframe").attr("src", url);
                    }
                }
                //执行回调函数
                if (argnum == 5) {
                    callback();
                }
            }
        });
    },

    //弹出一个modelDialog窗口
    dialogModel: function (w, h, title, url) {
        $.dialog.modelDialog.show(w, h, title, url);
    },

    //弹出一个确认对话框
    dialogConfirm: function (callback, isAll) {
        if (isAll) {
            $.dialog.alert('对不起，请选中您要操作的记录！');
            return false;
        }
        var msg = "删除记录后不可恢复，您确定吗？";
        $.dialog.confirm(msg, function () {
            callback();
        });
        return false;
    }
    //======================以上基于lhgdialog插件======================
};