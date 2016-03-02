/// <reference path="../Core/jquery-1.8.2.min.js" />

$.fn.pager = function (options) {
    var opt = $.extend($.fn.pager.defaults, options);
    if (opt.btnCount < 3) {
        opt.btnCount = 3;
    }
    opt.pageSize = parseInt(opt.pageSize);
    if (opt.pageSize < 1) {
        opt.pageSize = 1;
    }
    opt.pageCount = Math.ceil(opt.resultCount / opt.pageSize);
    return this.each(function () {
        var base = new $.fn.pager.base(opt, $(this));
        base.render();
    });
};

$.fn.pager.defaults = {
    resultCount: 0, //总记录数
    pageSize: 10, //每页记录数
    btnCount: 6, //最大分布数
    pageCount: 0, //页数
    curPage: 0, //当前页码
    showPage: function (num) {
    },
    //返回当前分页
    renderNav: function (type, pageNo) {
        var nav = "<a href='javascript:void(0);'>" + (pageNo + 1) + "</a>";
        if (pageNo == this.curPage) {
            nav = "<span class='current'>" + (pageNo + 1) + "</span>";
        }
        if (type == "prev") {
            nav = "<a href='javascript:void(0);' class='left-radius'>«上一页</a>";
        }
        else if (type == "next") {
            nav = "<a href='javascript:void(0);' class='right-radius'>下一页»</a>";
        }
        return nav;
    }
};

$.fn.pager.base = function (opt, el, base) {
    return {
        showText: function () {
            var that = this;
            var text = '<div id="pageCount" class="l-btns left-radius right-radius"><span>显示</span>'
                     + '<input type="text" value="' + opt.pageSize + '" id="txtPageSizeNum" class="pagenum">'
                     + '<span>条/页</span><span class="page-count">跳转到</span>'
                     + '<input type="text" value="' + (opt.curPage + 1) + '" id="txtPageNum" class="pagenum">'
                     + '<span>页</span><span class="page-count">共 <span class="count">' + opt.resultCount + '</span> 条记录</span></div>';
            el.parent().find("#pageCount").remove().end().append(text);
            $("#txtPageNum").on("change", function () {
                that.changePageNo($(this).val(), $(this))
            });
            $("#txtPageSizeNum").on("change", function () {
                that.changePageSize($(this).val(), $(this))
            });
        },
        render: function () {
            el.html("");
            this.showText();
            var that = this;
            $(opt.renderNav("prev")).appendTo(el).on("click", function () {
                that.showPrev();
                return false;
            });
            var last = opt.btnCount - 2;
            if (opt.pageCount < opt.btnCount) {
                for (var i = 0; i < opt.pageCount; i++) {
                    this.nav(i);
                }
            }
            else {
                var ids = {};
                ids[0] = 0;
                var flag = true;
                var min = opt.curPage - 1;
                var max = opt.curPage + 1;
                ids[opt.curPage] = opt.curPage;
                ids[opt.pageCount - 1] = opt.pageCount - 1;
                while (last > 0) {
                    if (flag) {
                        if (min > 0) {
                            ids[min] = min;
                            min--;
                            last--;
                        }
                    }
                    else {
                        if (max <= opt.pageCount - 1) {
                            ids[max] = max;
                            max++;
                            last--;
                        }
                    }
                    flag = !flag;
                }
                var arr = [];
                for (var key in ids) {
                    arr.push(ids[key]);
                }
                arr.sort(function (a, b) { return a - b; });
                for (var i = 0; i < arr.length; i++) {
                    this.nav(arr[i]);
                }
            }
            var that = this;
            $(opt.renderNav("next")).appendTo(el).on("click", function () {
                that.showNext();
                return false;
            });
        },
        nav: function (num) {
            var that = this;
            $(opt.renderNav("nav", num)).attr("tag", num).appendTo(el).on("click", function () {
                var num = parseInt($(this).attr("tag"));
                that.show(num);
                return false;
            });
        },
        showNext: function () {
            opt.curPage++;
            if (opt.curPage > opt.pageCount - 1) {
                opt.curPage = opt.pageCount - 1;
                return false;
            }
            this.show(opt.curPage);
        },
        showPrev: function () {
            opt.curPage--;
            if (opt.curPage < 0) {
                opt.curPage = 0;
                return false;
            }
            this.show(opt.curPage);
        },
        show: function (num) {
            if (opt.curPage != num) {
                opt.curPage = num;
            }
            this.render();
            opt.showPage(num);
        },
        changePageNo: function (cur, el) {
            var re = /^[0-9]*[1-9][0-9]*$/;
            if (!re.test(cur)) {
                el.val(opt.curPage + 1)
                return false;
            }
            cur = +cur;
            if (cur > opt.pageCount) {
                el.val(opt.curPage + 1)
                return false;
            }
            this.show(cur - 1);
        },
        changePageSize: function (_pageSize, el) {
            var re = /^[0-9]*[1-9][0-9]*$/;
            if (!re.test(_pageSize)) {
                el.val(opt.pageSize + 1)
                return false;
            }
            if (opt.clearCache) {
                opt.clearCache();
            }
            opt.pageSize = +_pageSize;
            opt.curPage = 0;
            opt.pageCount = Math.ceil(opt.resultCount / opt.pageSize);
            this.render();
            opt.showPage(0);
        }
    }
};