/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="../Core/knockout.mapping-latest.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />

; (function () {
    $.extend(viewModel, {
        condition: ko.observable(1),
        key: ko.observable(),

        doSearch: function () {
            if (!viewModel.key()) {
                $.dialog.alert("搜索关键字不能为空！");
                return false;
            }
            page.clearCache();//必须清缓存
            page.getPageList(0, function (sumCount) {
                page.pageBind(sumCount, 0);
            });
        },
        delCur: function (data) {
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
        showLookDialog: function () {
            page.dialogModel(800, 550, "修改信息-" + this.CommuntityName(), "/wuye/gonggao-add.html?id=" + this.Id());
        }
    });

    $.extend(page, {
        cache: [],
        init: function () {
            page.getPageList(0, function (sumCount) {
                page.pageBind(sumCount);
            });
        },
        getPageList: function (pageNo, bindPage) {
            if (!page.getCache(pageNo)) {
                var params = {};
                params.pageNo = pageNo;
                params.pageSize = page.pageSize;
                params.condition = viewModel.condition();
                params.key = viewModel.key();

                page.executeAjax({
                    url: "../mockdata/fangwu-list.txt",
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
