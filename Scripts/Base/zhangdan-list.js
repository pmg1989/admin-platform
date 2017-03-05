/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="../Core/knockout.mapping-latest.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />

; (function () {
    $.extend(viewModel, {
        condition: ko.observable(),
        key: ko.observable(),

        doSearch: function () {
            //console.log(viewModel.startDate());
            //console.log(viewModel.endDate());
            //console.log(viewModel.key());
            if (!viewModel.startDate() && viewModel.endDate()) {
                $.dialog.alert("起始时间不能为空！");
                return false;
            }
            if (viewModel.startDate() && !viewModel.endDate()) {
                $.dialog.alert("结束时间不能为空！");
                return false;
            }
            if (!viewModel.key()) {
                $.dialog.alert("搜索关键字不能为空！");
                return false;
            }
            page.clearCache();//必须清缓存
            page.getPageList(0, function (sumCount) {
                page.pageBind(sumCount, 0);
            });
        },
        delCur: function () {
            var id = this.Id();
            page.dialogConfirm(function () {
                console.log(id);

                var params = {};
                params.id = id;
                page.executeAjax({
                    url: "../mockdata/postResult.txt",
                    param: params,
                    //isPost:true, //post请求
                    success: function (data) {
                        page.dialogTips("删除成功！");

                        page.clearCache();//必须清缓存
                        page.getPageList(page.myCurPage, function (sumCount) {
                            page.pageBind(sumCount);
                        });
                    }
                });
            });
        },
        deleteAll: function () {
            this.baseDeleteAll(function (delArray) {
                console.log(delArray);

                var params = {};
                params.idArray = delArray;
                page.executeAjax({
                    url: "../mockdata/postResult.txt",
                    param: params,
                    //isPost:true, //post请求
                    success: function (data) {
                        page.dialogTips("批量删除成功！");

                        page.clearCache();//必须清缓存
                        page.getPageList(page.myCurPage, function (sumCount) {
                            page.pageBind(sumCount);
                        });
                    }
                });
            });
        },
        //缴费类型
        getType: function (value) {
            switch (value) {
                case 0:
                    return "物业费";
                default:
                    return "未知状态";
                    break;
            }
        },
        //获得状态
        getStatus: function (value) {
            switch (value) {
                case 0:
                    return "未缴费";
                    break;
                case 1:
                    return "处理中";
                    break;
                case 2:
                    return "扣款失败";
                    break;
                case 3:
                    return "已缴";
                    break;
                case 4:
                    return "作废";
                    break;
                case 5:
                    return "已过期";
                    break;
                default:
                    return "未知状态";
                    break;
            }
        },
        showLookDialog: function () {
            if (this.Id) {
                page.dialogModel(800, 550, "修改账单-" + this.BillNo(), "wuye/zhangdan-edit.html?id=" + this.Id());
            } else {
                page.dialogModel(800, 550, "新增账单-", "wuye/zhangdan-edit.html");
            }
        }
    });

    $.extend(page, {
        cache: [],
        init: function () {
            page.initSearchDateInput();
            page.getPageList(0, function (sumCount) {
                page.pageBind(sumCount);
            });
        },
        getPageList: function (pageNo, bindPage) {
            if (!page.getCache(pageNo)) {
                var params = {};
                params.pageNo = pageNo;
                params.pageSize = page.pageSize;
                params.startDate = viewModel.startDate(),
                params.endDate = viewModel.endDate(),
                params.condition = viewModel.condition();
                params.key = viewModel.key();

                page.executeAjax({
                    url: "../mockdata/zhangdan-list.txt",
                    param: params,
                    success: function (data) {
                        viewModel.list(ko.mapping.fromJS(data.rows));
                        if (bindPage) {
                            bindPage(data.total);
                        }
                        page.addCache(pageNo, data.rows);
                    }
                });
            }
        }
    });

    $(function () {
        page.init();
        ko.applyBindings(viewModel);
    });
})();
