/// <reference path="../Core/jquery-1.8.2.min.js" />
/// <reference path="../Core/knockout-3.2.0.js" />
/// <reference path="../Core/knockout.mapping-latest.js" />
/// <reference path="utility.js" />
/// <reference path="page.js" />
/// <reference path="../Plugin/lhgdialog/lhgdialog.js" />

; (function () {
    $(function () {
        index.init();
    });

    var $navh2 = $("#sidebar-nav .list-group>h2"),
        $navul = $("#sidebar-nav .list-group>ul"),
        $navli = $("#sidebar-nav .list-group>ul>li");

    var index = {
        init: function () {
            //左侧导航栏点击展开事件
            $navh2.each(function (i) {
                $(this).on("click", function () {
                    if (!$navul.eq(i).is(":hidden")) {
                        return false;
                    }
                    $navul.slideUp(300);
                    $navul.eq(i).slideDown(300);
                });
            });

            //头部导航栏点击触发左侧导航栏展开事件
            $("#nav li").each(function (i) {
                var $that = $(this);
                $that.on("click", function () {
                    if (!$navul.eq(i).is(":hidden")) {
                        return false;
                    }
                    $that.siblings().removeClass("selected").end().addClass("selected");
                    $navul.slideUp(300);
                    $navul.eq(i).slideDown(300);
                });
            });

            //左侧导航栏内部菜单点击展开事件
            $navli.each(function (i) {
                var $that = $(this);
                $that.find("a.pack").each(function (i) {
                    $(this).on("click", function () {
                        if (!$(this).next().is(":hidden")) {
                            return false;
                        }
                        $that.siblings().find("ul").slideUp(300);
                        $(this).next().slideDown(300);

                        $that.find("a.pack .expandable").removeClass("open");
                        $(this).find(".expandable").addClass("open");
                    });
                });

            });
        }
    };
})();