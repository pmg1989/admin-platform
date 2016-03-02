/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="../Core/knockout.mapping-latest.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />

; (function () {
    $.extend(viewModel, {
        keyType: ko.observable(0),
        keyStatus: ko.observable(0),
        key: ko.observable(),

        doSearch: function () {
            //console.log(viewModel.keyStatus());;
            //console.log(viewModel.key());
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
                    url: "/mockdata/postResult.txt",
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
        renderStatus: function (status) {
            switch (status) {
                case 1:
                    status = "等待处理";
                    break;
                case 2:
                    status = "任务指派中";
                    break;
                case 3:
                    status = "处理完成";
                    break;
                case 4:
                    status = "用户已评价";
                    break;
                case 9:
                    status = "报修未受理";
                    break;
            }
            return status;
        },
        showModelDialog: function (width, heigh, title, url) {
            page.dialogModel(width, heigh, title, url);
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
                params.keyType = viewModel.keyType(),
                params.keyStatus = viewModel.keyStatus(),
                params.key = viewModel.key(),

                page.executeAjax({
                    url: "/mockdata/baoxiu-list.txt",
                    param: params,
                    success: function (data) {
                        viewModel.list(ko.mapping.fromJS(data.rows));
                        if (bindPage) {
                            bindPage(data.total);
                        }
                        page.addCache(pageNo, data.rows);
                        //console.log(ko.mapping.toJS(viewModel.list()));
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