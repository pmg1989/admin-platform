/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="../Core/knockout.mapping-latest.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />

; (function () {
    $.extend(viewModel, {
        key: ko.observable(),

        doSearch: function () {;
            //console.log(viewModel.key());
            if (typeof (viewModel.key()) == 'undefined') {
                $.dialog.alert("搜索关键字不能为空！");
                return false;
            }
            page.clearCache();//必须清缓存
            page.getPageList(0, function (sumCount) {
                page.pageBind(sumCount, 0);
            });
        },
        delCur: function (data) {
            page.dialogConfirm(function () {
                //ajax delete
                console.log(data.Id());
                page.clearCache();
                viewModel.list().remove(data);
                page.dialogTips("删除成功！");
            });
        },
        deleteAll: function () {
            var delArray = [], i = 0;
            ko.utils.arrayForEach(viewModel.list()(), function (data) {
                if (data.isSelected()) {
                    delArray[i++] = data.Id();
                }
            });
            page.dialogConfirm(function () {
                //ajax delete
                console.log(delArray);
                page.clearCache();
                page.dialogTips("批量删除成功！");

            }, delArray.length == 0);
        },
        showEditDialog: function () {
            page.dialogModel(800, 350, "修改小区-" + this.Name(), "/wuye/xiaoqu-edit.html?id=" + this.Id());
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
                params.key = viewModel.key();

                page.executeAjax({
                    url: "../mockdata/xiaoquM-list.txt",
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
