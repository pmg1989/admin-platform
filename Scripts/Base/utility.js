var utility = {
    //JSON to string
    jsonToString: function (obj) {
        return JSON.stringify(obj);
    },
    //string to JSON
    stringToJson: function (str) {
        return JSON.parse(str);
    },
    format: function () {
        var args = arguments;
        return args[0].replace(/{(\d+)}/g, function (m, num) {
            num = +num + 1;
            return typeof args[num] != 'undefined'
              ? args[num]
              : m;
        });
    },
    dateFormat: function (fmt, date) {
        if (!date) {
            date = new Date();
        }
        else {
            date = new Date(date);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    JsonDateToDateString: function (date, fmt) {
        var date = new Date(parseInt(date.slice(6, -2)));
        var fmt = fmt || "yyyy-MM-dd";
        return this.dateFormat(fmt, date);
    },
    JsonDateToDateTimeString: function (date) {
        var date = new Date(parseInt(date.slice(6, -2)));
        return this.dateFormat("yyyy-MM-dd hh:mm:ss", date);
    },
    getQueryString: function (value) {
        var reg = new RegExp("(^|&)" + value + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    },
    emailRegex: function (val) {
        var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (!regex.test(val)) {
            return false;
        }
        return true;
    },
    phoneRegex: function (val) {
        var regex = /^1[3|4|5|8][0-9]\d{8}$/;
        if (!regex.test(val)) {
            return false;
        }
        return true;
    },
    getId: function () {
        return window.location.pathname.replace(/[^\d]/g, '');;
    },
    tsFormat: function (ts) {
        if (ts < 0) {
            ts = 0;
        }
        var o = {
            d: Math.floor(ts / (1000 * 60 * 60 * 24)),
            h: Math.floor(ts / (1000 * 60 * 60)) % 24,
            m: Math.floor(ts / (1000 * 60)) % 60,
            s: Math.floor(ts / 1000) % 60,
            ss: Math.floor(ts / 100) % 10
        };

        o.d = o.d > 9 ? o.d.toString() : "0" + o.d;
        o.dh = o.d[0];
        o.dl = o.d[1];

        o.h = o.h > 9 ? o.h.toString() : "0" + o.h;
        o.hh = o.h[0];
        o.hl = o.h[1];

        o.m = o.m > 9 ? o.m.toString() : "0" + o.m;
        o.mh = o.m[0];
        o.ml = o.m[1];

        o.s = o.s > 9 ? o.s.toString() : "0" + o.s;
        o.sh = o.s[0];
        o.sl = o.s[1];

        o.ss = o.ss > 9 ? o.ss.toString() : "0" + o.ss;
        o.ssh = o.ss[0];
        o.ssl = o.ss[1];
        return o;
    },
    //只允许输入数字
    checkNumber: function (e) {
        if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {  //FF 
            if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which == 8) || (e.which == 46)))
                return false;
        } else {
            if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode == 8) || (event.keyCode == 46)))
                event.returnValue = false;
        }
    }
}
