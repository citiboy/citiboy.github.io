/***
** 功能：  字符串格式化替换操作
** Author: Allen Zhang
** RTX：   14002
***/
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
}

/***
** 功能：  去掉字符左右空格
** Author: Allen Zhang
** RTX：   14002
***/
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/***
** 功能：  格式化时间字符串，支持多种时间格式化类型
** 参数：  format 日期对象 
** 示例：  new Date().format("yyyy年MM月dd日 hh:mm:ss");
** Author: Allen Zhang
** RTX：   14002
***/
Date.prototype.format = function (format) {
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds(), //millisecond
        "Ｗ": week[this.getDay()] //周 
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

/***
** 功能：  加载外部JS文件，加载完成后执行回调函数callback
** Author: Allen Zhang
** RTX：   14002
***/
var utools = {
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    stopEventBubble: function (event) {
        var e = event || window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        }
        return false;
    }
}

/***
** 功能：  cookie操作对象
** Author: Allen Zhang
** RTX：   14002
***/
var cookies = {
    /***
    ** 功能：  写入cookie操作
    ** 参数：  name cookie名称
    **         value cookie值 
    **         expires 过期时间
    **         path  路径
    **         domain 域
    ***/
    set: function (name, value, expires, path, domain) {
        expires = new Date(new Date().getTime() + (((typeof expires == "undefined") ? 12 * 7200 : expires)) * 1000);
        var tempcookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "; path=/") +
            ((domain) ? "; domain=" + domain : "");
        (tempcookie.length < 4096) ? document.cookie = tempcookie : alert("The cookie is bigger than cookie lagrest");
    },

    /***
    ** 功能：  获取cookie操作
    ** 参数：  name cookie名称
    ***/
    get: function (name) {
        var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (xarr != null)
            return unescape(xarr[2]);
        return null;
    },

    /***
    ** 功能：  删除cookie操作
    ** 参数：  name cookie名称
    **         path  路径
    **         domain 域
    ***/
    del: function (name, path, domain) {
        if (this.get(name))
            document.cookie = name + "=" +
                ((path) ? "; path=" + path : "; path=/") +
                ((domain) ? "; domain=" + domain : "") +
                ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    },
    day: function (xd) {
        return xd * 24 * 3600;
    },
    hour: function (xh) {
        return xh * 3600;
    }
}
/***
** 功能：  选项卡切换
** Author: Allen Zhang
** RTX：   14002
***/
jQuery.fn.Tabs = function (options) {
    var defaults = {
        tabSelector: ".tabs li",
        conSelector: ".tabcontent",
        focusClass: "c",
        moreTrigger: ".tabTitle .more .link",
        events: "mouseover",
        selected: 0,
        delay: 0.2
    };
    var events = ["mouseover", "click"];
    var settings = jQuery.extend({}, defaults, options);
    var that = this;
    var _tabs = jQuery(settings.tabSelector, that);
    var _cons = jQuery(settings.conSelector, that);
    var _more = jQuery(settings.moreTrigger, that);
    var _isDelay = settings.events == events[0] ? !0 : !1;

    void function () {
        var tab = _tabs.eq(settings.selected);
        if (tab && tab.length == 0) {
            tab = _tabs.eq(0);
        }
        tab.addClass(settings.focusClass);
        tab.siblings(settings.tabSelector).removeClass(settings.focusClass);

        var cons = _cons.eq(settings.selected);
        if (cons && cons.length == 0) {
            cons = _cons.eq(0);
        }
        cons.show();
        cons.siblings(settings.conSelector).hide();

        var more = _more.eq(settings.selected);
        if (more && more.length == 0) {
            more = _more.eq(0);
        }
        more.show();
        more.siblings().hide();
    }();

    _tabs.each(function (i, v) {
        jQuery(v).on(settings.events, function () {
            var _this = this;
            delay.apply(this, [settings.delay, function () {
                jQuery(_this).addClass(settings.focusClass);
                jQuery(_this).siblings(settings.tabSelector).removeClass(settings.focusClass);
                jQuery(_cons[i]).show();
                jQuery(_cons[i]).siblings(settings.conSelector).hide();
                jQuery(_more[i]).show();
                jQuery(_more[i]).siblings().hide();
            }, _isDelay])
        });
    });
    //接收两个参数 t延迟时间秒为单位，fn要执行的函数,m是否执行延迟取决于事件的类型
    var delay = function (t, fn, m) {
        if (m) {
            var _this = this,
                d = setInterval(function () {
                    fn.apply(_this);
                }, t * 1000);
            _this.onmouseout = function () {
                clearInterval(d);
            };
        }
        else fn.apply(this);
    }
}
/***
注册事件
***/
function addEvent(obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, fn);
    }
}

//通用函数
var Tools = {
    /*
    *获取数据
    */
    getJsonData: function (url, callback, fail) {
        jQuery.ajax({
            url: url,
            method: 'get',
            dataType: 'jsonp',
            jsonp: 'jsonp_callback',
            success: function (data) {
                try {
                    if (data.code == 0) {
                        callback && callback(data)
                    } else {
                        fail && fail();
                    }
                } catch (err) {
                    fail && fail(err);
                }
            },
            error: function (err) {
                fail && fail(err);
            }
        })
    },
    getJsonData2: function (url, callback, fail) {
        jQuery.ajax({
            url: url,
            method: 'get',
            dataType: 'jsonp',
            success: function (data) {
                try {
                    if (data) {
                        callback && callback(data)
                    } else {
                        fail && fail();
                    }
                } catch (err) {
                    fail && fail(err);
                }
            },
            error: function (err) {
                fail && fail(err);
            }
        })
    },
    getJsonDataNewHq: function (url, callback, fail) {
        jQuery.ajax({
            url: url,
            method: 'get',
            dataType: 'jsonp',
            jsonp: 'cb',
            scriptCharset: "utf-8",
            success: function (data) {
                try {
                    if (data) {
                        callback && callback(data)
                    } else {
                        fail && fail();
                    }
                } catch (err) {
                    if (fail)
                        fail(err);
                    else
                        console && console.info(err);
                }
            },
            error: function (err) {
                if (fail)
                    fail(err);
                else
                    console && console.info(err);
            }
        })
    },
    jsonp: function (url, jsonp, callback, fail) {
        jQuery.ajax({
            url: url,
            method: 'get',
            dataType: 'jsonp',
            jsonp: jsonp,
            scriptCharset: "utf-8",
            success: function (data) {
                try {
                    if (data) {
                        callback && callback(data)
                    } else {
                        fail && fail();
                    }
                } catch (err) {
                    if (fail)
                        fail(err);
                    else
                        console && console.info(err);
                }
            },
            error: function (err) {
                if (fail)
                    fail(err);
                else
                    console && console.info(err);
            }
        })
    },
    /*
    *判断值是否非空
    */
    getTextValOrEmpty: function (value) {
        if (value != '' && value != undefined && value != null) {
            return value
        } else {
            return '-'
        }
    },
    isEmpty: function (value) {
        if (value === "" || value === null || typeof value === "undefined") {
            return true;
        }
        return false;
    },

    isEmptyOrOther: function (value) {
        if (value === "" || value === null || typeof value === "undefined" || value === "-" || !isFinite(value)) {
            return true;
        }
        return false;
    },
    GetRealvalue: function (v1, v2) {
        if (v1 === null || typeof v1 === "undefined")
            return v2;
        return v1;
    },
    /*
    *单位自动换算
    */
    FixAmt: function (str, num, fix, ride) {
        try {
            if (str === '' || str === undefined || str === null || str === '-' || isNaN(str) || !isFinite(str)) {
                return '-';
            }
            var result;
            fix = !!fix ? fix : '';
            num = isNaN(parseFloat(num)) ? 2 : parseFloat(num);
            ride = !!ride ? ride : 1;
            str = parseFloat(str) * parseInt(ride);
            var intStr = Math.abs(parseInt(str));
            if (intStr.toString().length > 12) {
                result = (parseFloat(str) / 1000000000000).toFixed(num) + '万亿' + fix;
            } else if (intStr.toString().length > 8) {
                result = (parseFloat(str) / 100000000).toFixed(num) + '亿' + fix;
            } else if (intStr.toString().length > 4) {
                result = (parseFloat(str) / 10000).toFixed(num) + '万' + fix;
            } else {
                result = parseFloat(str).toFixed(num) + fix;
            }
            // console.log(result)
            return result;
        } catch (err) {
            return '-'
        }
    },
    /*
    *换算成百分比
    */
    toPercent: function (data, zoom) {
        if (data === '' || data === undefined || data === null || data === '-' || isNaN(data) || !isFinite(data)) {
            return '-';
        }
        var value = parseFloat(data) * Math.pow(10, parseInt(zoom || 0));
        return !isNaN(value) ? value.toFixed(2) + '%' : '-';
    },
    toFixed: function (data, num) {
        if (data === '' || data === undefined || data === null || data === '-' || isNaN(data) || !isFinite(data)) {
            return '-';
        }
        num = isNaN(parseFloat(num)) ? 2 : parseFloat(num);
        return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(num) : '-';
    },
    Fixed: function (data, num, divide, def) {
        if (data === '' || data === undefined || data === null || data === '-' || isNaN(data)) {
            return def || '-';
        }
        num = isNaN(parseFloat(num)) ? 2 : parseFloat(num);
        if (divide)
            return !isNaN(parseFloat(data / divide)) ? parseFloat(data / divide).toFixed(num) : '-';
        return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(num) : '-';
    },
    /**
    * @param {data}字符串 
    * @param {num}保留小数点几位
    * @param {fix}单位
    * @param {divide} 除以多少，eg:10000 ,如果没有则自动填充
    */
    getColorByDate: function (data, num, fix, divide) {
        try {
            if (data === '' || data === undefined || data === null || data === '-' || isNaN(data) || !isFinite(data)) {
                return '<span>-</span>'
            }
            data = parseFloat(data);
            var retult = '';

            if (!divide) {
                retult = this.FixAmt(data, num, fix);
            } else {
                num = isNaN(parseFloat(num)) ? 2 : parseFloat(num);
                retult = (data / parseFloat(divide)).toFixed(num) + fix;
            }

            var color = '';
            color = !!data ? (data == 0 ? '' : data > 0 ? 'red' : 'green') : '';
            retult = '<span class="' + color + '">' + retult + '</span>'

            return retult;
        } catch (err) {
            return '-'
        }
    },

    getDescribe: function (data, num, fix, divide, abs, arr) {
        try {
            if (data === '' || data === undefined || data === null || data === '-' || isNaN(data) || !isFinite(data)) {
                return '<span>-</span>'
            }
            data = parseFloat(data);
            if (data == 0) {
                return "无变化"
            }
            var retult = '';
            if (!arr) {
                arr = ['上升', '下降']
            }
            if (!divide) {
                retult = this.FixAmt(data, num, fix);
            } else {
                num = !!parseFloat(num) ? parseFloat(num) : 2;

                if (abs) {
                    retult = Math.abs((data / parseInt(divide)).toFixed(num)) + fix;
                } else {
                    retult = (data / parseInt(divide)).toFixed(num) + fix;
                }
            }


            var color = '';
            var desc = '';
            color = !!data ? (data == 0 ? '' : data > 0 ? 'red' : 'green') : '';
            desc = !!data ? (data >= 0 ? arr[0] : arr[1]) : '';
            retult = desc + '<span class="' + color + '">' + retult + '</span>'

            return retult;
        } catch (err) {
            return '-'
        }
    },
    isExist: function (data) {
        if (data !== undefined && data !== null && data !== '-' && data !== '') {
            return true;
        }
        return false;
    },
    getColor: function (data) {
        data = parseFloat(data);
        return !!data ? (data == 0 ? '' : data > 0 ? 'red' : 'green') : '';
    },
    //时间戳转化格式
    dateFormat: function (str, type) {

        if (str === '' || str === undefined || str === null || str === '-') {
            return '-';
        }

        try {
            type = !!type ? type : 'yyyy-MM-dd';
            var retDate = new Date(str);
            if (isNaN(retDate))
                retDate = this.parseISO8601(str);
            return retDate.format(type);
        } catch (err) {
            return '-';
        }
    },
    //生成日期parseISO8601("2016-9-5")
    parseISO8601: function (dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*/,
            date = new Date(NaN), month,
            parts = isoExp.exec(dateStringInRange);

        if (parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if (month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    },
    //2018-09-27T00:00:00格式转化
    dateFormat2: function (dateS, part) {
        if (dateS == "-" || typeof dateS == "undefined") {
            return '-';
        }
        if (dateS.length > 10) {
            dateS = dateS.split('T')[0].replace(/-/g, "/");
        }
        var date = new Date(dateS);
        var datecopy;
        var redate = "";
        part = (part == null) ? "yyyy-MM-dd HH:mm:ss" : part;
        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var MM = (M > 9) ? M : "0" + M;
        var dd = (d > 9) ? d : "0" + d;
        var HH = (H > 9) ? H : "0" + H;
        var mm = (m > 9) ? m : "0" + m;
        var ss = (s > 9) ? s : "0" + s;
        redate = part.replace("yyyy", y).replace("MM", MM).replace("dd", dd).replace("HH", HH).replace("mm", mm).replace("ss", ss).replace("M", M).replace("d", d).replace("H", H).replace("m", m).replace("s", s);
        return redate;
    },
    cutText: function (str, num) {
        if (str === '' || str === undefined || str === null || str === '-') {
            return '-';
        }
        if (!num) {
            return str;
        }
        str = str.toString().replace(/(&#x0D;)/g, ',');
        num = parseInt(num);
        if (str.length > num) {
            return str.substring(0, num) + '...'
        } else {
            return str;
        }
    },
    //默认取25宽度的长度
    cutTitle: function (str) {
        if (str === '' || str === undefined || str === null || str === '-') {
            return '-';
        }
        str = str.replace(/(.{25})/g, "$1&#10;")
        return str
    },
    /**
    *计算行情中心数据
    * @param {data}数据 
    * @param {zoom}缩放大小
    */
    computQuoteDate: function (data, zoom) {
        try {
            if (data === '' || data === undefined || data === null || data === '-' || !isFinite(data)) {
                return '-';
            }

            zoom = zoom || 1;
            //console.log(parseFloat(data) / Math.pow(10, parseInt(zoom)))
            return parseFloat(data) / Math.pow(10, parseInt(zoom)) || '-';
        } catch (err) {
            return "-"
        }
    },
    //币种链接
    getBiLink: function (type, name) {
        if (!name) {
            return '-';
        }
        if (!type) {
            return name;
        }
        type = type.toUpperCase();
        var result = '';
        switch (type) {
            case 'ZAR':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYZARC.html">' + name + '</a>';
                break;
            case 'GBP':
                result = '<a href="http://quote.eastmoney.com/cnyrate/GBPCNYC.html">' + name + '</a>';
                break;
            case 'EUR':
                result = '<a href="http://quote.eastmoney.com/cnyrate/EURCNYC.html">' + name + '</a>';
                break;
            case 'KRW':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYKRWC.html">' + name + '</a>';
                break;
            case 'RUB':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYRUBC.html">' + name + '</a>';
                break;
            case 'MYR':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYMYRC.html">' + name + '</a>';
                break;
            case 'CHF':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CHFCNYC.html">' + name + '</a>';
                break;
            case 'NOK':
                result = '<a href=" http://quote.eastmoney.com/cnyrate/CNYNOKC.html">' + name + '</a>';
                break;
            case 'AED':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYAEDC.html">' + name + '</a>';
                break;
            case 'SAR':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYSARC.html">' + name + '</a>';
                break;
            case 'AUD':
                result = '<a href="http://quote.eastmoney.com/cnyrate/AUDCNYC.html">' + name + '</a>';
                break;
            case 'THB':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYTHBC.html">' + name + '</a>';
                break;
            case 'SGD':
                result = '<a href="http://quote.eastmoney.com/cnyrate/SGDCNYC.html">' + name + '</a>';
                break;
            case 'CAD':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CADCNYC.html">' + name + '</a>';
                break;
            case 'HKD':
                result = '<a href="http://quote.eastmoney.com/cnyrate/HKDCNYC.html">' + name + '</a>';
                break;
            case 'USD':
                result = '<a href="http://quote.eastmoney.com/cnyrate/USDCNYC.html">' + name + '</a>';
                break;
            case 'JPY':
                result = '<a href="http://quote.eastmoney.com/cnyrate/JPYCNYC.html">' + name + '</a>';
                break;
            case 'MXN':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYMXNC.html">' + name + '</a>';
                break;
            case 'SEK':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYSEKC.html">' + name + '</a>';
                break;
            case 'DKK':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYDKKC.html">' + name + '</a>';
                break;
            case 'TRY':
                result = '<a href="http://quote.eastmoney.com/cnyrate/CNYTRYC.html">' + name + '</a>';
                break;
            default:
                result = name;
        }
        return result;
    },
    getCutNum: function (str) {
        if (str === '' || str === undefined || str === null || str === '-' || !isFinite(str)) {
            return '-';
        }
        var result = str.toString();
        var i = str.toString().indexOf(".");
        var num = parseFloat(str);
        if (num < 0) {
            i = i - 1;
        }
        if (i >= 4) {
            num = num.toFixed(0);
            result = num.toString();
        }
        else if (i == 3) {
            num = num.toFixed(1);
            result = num.toString();
        }
        return result;

    },
    getChinesNum: function (num) {
        var changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        var unit = ["", "十", "百", "千", "万"];
        num = parseInt(num);
        var getWan = function (temp) {
            var strArr = temp.toString().split("").reverse();
            var newNum = "";
            for (var i = 0; i < strArr.length; i++) {
                newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;

            }
            return newNum;

        }
        var overWan = Math.floor(num / 10000);
        var noWan = num % 10000;
        if (noWan.toString().length < 4) {
            noWan = "0" + noWan;
        }
        return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);

    }
}