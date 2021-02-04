var echartsfun = {
  tooltipformatter_1: function (data) {
    var str = "";
    var date = data[0].axisValue;
    var linecount = 1;
    if (data.length > 20) linecount = 5;
    for (var i = 0; i < data.length; i++) {
      if (Tools.isExist(data[i].value)) {
        str +=
          data[i].marker +
          '<span style ="display:inline-block;width:195px;" >' +
          data[i].seriesName +
          ":" +
          Tools.FixAmt(data[i].value, 2) +
          "</span>" +
          ((i + 1) % linecount == 0 ? "<br/>" : "&nbsp;");
      }
    }
    return date + "<br/>" + str;
  },
  tooltipformatter_2: function (data) {
    var str = "";
    var date = data[0].axisValue;
    var linecount = 1;
    if (data.length > 20) linecount = 5;
    for (var i = 0; i < data.length; i++) {
      if (Tools.isExist(data[i].value)) {
        str +=
          data[i].marker +
          '<span style ="display:inline-block;width:195px;" >' +
          data[i].seriesName +
          ":" +
          Tools.FixAmt(data[i].value, 3) +
          "</span>" +
          ((i + 1) % linecount == 0 ? "<br/>" : "&nbsp;");
      }
    }
    return date + "<br/>" + str;
  },
  makedata: function (data, dw) {
    dw = dw || 10000;
    var datas = [];
    var dataitemlength = data[0].split(",").length;
    for (var m = 0; m < dataitemlength; m++) {
      datas[m] = [];
    }
    for (var i = data.length - 1; i >= 0; i--) {
      var item = data[i].split(",");
      datas[0][i] = item[0];
      for (var j = 1; j < dataitemlength; j++) {
        datas[j][i] = Tools.isExist(item[j])
          ? parseFloat(item[j] / dw).toFixed(2)
          : "";
      }
    }
    return datas;
  },
  makedatadcfm: function (data, keys, dw) {
    dw = dw || 10000;
    var datas = [];
    for (var m = 0; m < keys.length; m++) {
      datas[m] = [];
    }
    for (var i = data.length - 1; i >= 0; i--) {
      var item = data[i];
      var index = data.length - i - 1;
      datas[0][index] = item[keys[0]];
      for (var j = 1; j < keys.length; j++) {
        datas[j][index] = Tools.isExist(item[keys[j]])
          ? parseFloat(item[keys[j]] / dw).toFixed(2)
          : "";
      }
    }
    return datas;
  },

  arrtoobj: function (data, index) {
    index = index || 0;
    var datas = {};
    for (var i = data.length - 1; i >= 0; i--) {
      var item = data[i].split(",");
      datas[item[index]] = item;
    }
    return datas;
  },

  pushdata: function (keys, data, index, dw, getkey) {
    dw = dw || 10000;
    index = index || 1;
    var datas = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (typeof getkey == "function") key = getkey(key);
      if (data[key] && data[key].length > index)
        datas.push(
          Tools.isExist(data[key][index])
            ? parseFloat(data[key][index] / dw).toFixed(2)
            : ""
        );
      else datas.push(null);
    }
    return datas;
  },
  getdatatype: function (key) {
    switch (key) {
      case 101:
      default:
        return "d";
      case 102:
        return "w";
      case 103:
        return "m";
      case 104:
        return "q";
      case 106:
        return "y";
    }
  },
};

var hsgtctcharts = [];
var getechart = function (id) {
  var chart = hsgtctcharts[id];
  if (chart == null || chart == undefined) {
    chart = echarts.init(document.getElementById(id));
    hsgtctcharts[id] = chart;
  }
  chart.clear();
  chart.resize();
  return chart;
};

var gettip = function (text) {
  return "<i title='" + text + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>";
};
var SwitchTag = function (tag) {
  var res = "-";
  switch (tag) {
    case 1:
      res = "额度可用";
      break;
    case 2:
      res = "额度已满";
      break;
    case 3:
      res = "收盘";
      break;
    case 4:
      res = "休市";
      break;
    default:
      res = "-";
      break;
  }
  return res;
};
var loadtablefun = {
  ggmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);
    var code = data["SCode"];
    row.cells[0].innerHTML = c;
    row.cells[1].innerHTML =
      '<a href="http://quote.eastmoney.com/' +
      code +
      '.html">' +
      data["SCode"] +
      "</a>";
    row.cells[2].innerHTML =
      '<a href="/stockdata/' + code + '.html">' + data["SName"] + "</a>";
    row.cells[3].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      code +
      '" class="red">详细</a> <a href="http://data.eastmoney.com/stockdata/' +
      code +
      '.html">数据</a>'; //
    row.cells[4].innerHTML =
      '<span class="' +
      Tools.getColor(data["Zdf"]) +
      '">' +
      data["NewPrice"] +
      "</span>"; //最新价
    row.cells[5].innerHTML = Tools.getColorByDate(data["Zdf"], 2, "%"); //涨跌幅
    row.cells[6].innerHTML = Tools.FixAmt(data["ShareHold"]); //ShareHold = string.Empty;//持股数量
    row.cells[7].innerHTML = Tools.FixAmt(data["ShareSZ"]); //ShareSZ = string.Empty;//持股市值
    row.cells[8].innerHTML = Tools.toPercent(
      data["Market"] == "001" ? data["SharesRate"] : data["LTZB"] * 100
    ); //LTZB = string.Empty;//流通占比
    row.cells[9].innerHTML = Tools.toPercent(
      data["Market"] == "001" ? data["ZZB"] * 100 : data["SharesRate"]
    ); //ZZB = string.Empty;//总股本占比
    row.cells[10].innerHTML = Tools.FixAmt(data["ShareHold_Chg_One"]); //ShareHold_Chg_One = string.Empty;//前一日持股数量
    row.cells[11].innerHTML = Tools.getColorByDate(data["ShareSZ_Chg_One"]);
    row.cells[12].innerHTML = Tools.getColorByDate(
      data["ShareSZ_Chg_Rate_One"] * 100,
      2,
      "%"
    ); //ShareSZ_Chg_Rate_One = string.Empty;//前一日持股市值变化比例
    row.cells[13].innerHTML = Tools.getColorByDate(
      data["LTZB_One"] * 1000,
      2,
      "‰"
    ); //LTZB_One = string.Empty;//流通占比
    row.cells[14].innerHTML = Tools.getColorByDate(
      data["ZZB_One"] * 1000,
      2,
      "‰"
    ); //ZZB_One = string.Empty;//总股本占比
    row.cells[15].innerHTML =
      '<a href="/hsgtcg/BK0' +
      data["ORIGINALCODE"] +
      '.html">' +
      data["HYName"] +
      "</a>"; //ORIGINALCODE = string.Empty;//老东财行业代码 HYName = string.Empty;//行业名称
  },
  bkmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);
    var bkcode = data["ORIGINALCODE"];
    row.cells[0].innerHTML = c;
    row.cells[1].innerHTML =
      '<a href="http://quote.eastmoney.com/center/boardlist.html#boards-BK0' +
      bkcode +
      '">' +
      data["HYName"] +
      "</a>";
    row.cells[2].innerHTML =
      '<a href="/hsgtcg/BK0' +
      bkcode +
      '.html" class="red">详细</a> <a href="http://guba.eastmoney.com/list,BK0' +
      bkcode +
      '.html">股吧</a>'; //
    row.cells[3].innerHTML = Tools.getColorByDate(data["Zdf"], 2, "%"); //涨跌幅
    row.cells[4].innerHTML = data["Count"]; //
    row.cells[5].innerHTML = Tools.FixAmt(data["ShareSZ_GZ"]); //ShareSZ_GZ 北向资金今日持股 市值
    row.cells[6].innerHTML = Tools.toPercent(data["ShareHold_Chg_BK"], 2); // ShareHold_Chg_BK  北向资金今日持股 占板块比

    row.cells[7].innerHTML = Tools.toPercent(data["ShareHold_Chg_GZ"], 2); //ShareHold_Chg_GZ = string.Empty;//板块市值占北向资金比例
    row.cells[8].innerHTML = data["ZC_Count"]; //
    row.cells[9].innerHTML = Tools.getColorByDate(data["ShareSZ_ZC"]); //ShareSZ_ZC = string.Empty;//增持市值
    row.cells[10].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg"] * 100,
      2,
      "%"
    ); //ShareHold_ZC_Chg = string.Empty;//增持比例
    row.cells[11].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg_BK"] * 1000,
      2,
      "‰"
    ); //ShareHold_ZC_Chg_BK = string.Empty;//增持占板块比例
    row.cells[12].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg_GZ"] * 1000,
      2,
      "‰"
    ); //ShareHold_ZC_Chg_GZ = string.Empty;//增持占北向资金比例
    row.cells[13].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Max_SZ_Code"] +
      '">' +
      data["Max_SZ_Name"] +
      "</a>";
    row.cells[14].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Max_ZB_Code"] +
      '">' +
      data["Max_ZB_Name"] +
      "</a>";
    row.cells[15].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Min_SZ_Code"] +
      '">' +
      data["Min_SZ_Name"] +
      "</a>";
    row.cells[16].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Min_ZB_Code"] +
      '">' +
      data["Min_ZB_Name"] +
      "</a>";
  },
  jgmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);

    var date = Tools.dateFormat(data.HDDATE, "yyyy-MM-dd"),
      detailLink =
        "/hsgtcg/InstitutionHdDetail.aspx?jgCode=" +
        data.PARTICIPANTCODE +
        "&date=" +
        date +
        "&jgName=" +
        escape(data.PARTICIPANTNAME);
    row.cells[0].innerHTML = date; //持股日期
    row.cells[1].innerHTML =
      '<a class="ellipsis w258" href="' +
      detailLink +
      '" title="' +
      data.PARTICIPANTNAME +
      '">' +
      data.PARTICIPANTNAME +
      "</a>"; //机构名称
    row.cells[2].innerHTML =
      '<a class="red" href="' + detailLink + '">详细</a>'; //相关
    row.cells[3].innerHTML = Tools.FixAmt(data["SHAREHOLDCOUNT"], 0); //持股只数
    row.cells[4].innerHTML = Tools.FixAmt(data["SHAREHOLDPRICE"]); //持股市值
    row.cells[5].innerHTML = Tools.getColorByDate(data["SHAREHOLDPRICEONE"]); //持股市值变化1日
    row.cells[6].innerHTML = Tools.getColorByDate(data["SHAREHOLDPRICEFIVE"]); //持股市值变化5日
    row.cells[7].innerHTML = Tools.getColorByDate(data["SHAREHOLDPRICETEN"]); //持股市值变化10日
  },
  cglsmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);
    var code = data["SCode"];
    row.cells[0].innerHTML = data["HdDate"];
    row.cells[1].innerHTML = Tools.getColorByDate(data["Zdf"], 2, "%"); //涨跌幅;
    row.cells[2].innerHTML = Tools.getColorByDate(data["ShareSZ_Add"]);
    row.cells[3].innerHTML = Tools.getColorByDate(
      data["ShareHoldAdd_ZB_ALL"] * 1000,
      2,
      "‰"
    );
    row.cells[4].innerHTML = Tools.FixAmt(data["ShareSZ"]) + "</span>";
    row.cells[5].innerHTML = Tools.toPercent(data["ShareHold_ZB_ALL"], 2);
    row.cells[6].innerHTML =
      '<a href="/hsgtcg/BK0' +
      data["BKOriginalCode"] +
      '.html">' +
      data["BKSName"] +
      "</a>";
    row.cells[7].innerHTML =
      '<a href="/hsgtcg/BK0' +
      data["BKProportionOriginalCode"] +
      '.html">' +
      data["BKProportionName"] +
      "</a>";
    row.cells[8].innerHTML =
      '<a href="/hsgtcg/BK0' +
      data["BKMarketOriginalCode"] +
      '.html">' +
      data["BKMarketName"] +
      "</a>";
    row.cells[9].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["SZCode_Max"] +
      '">' +
      data["SZName_Max"] +
      "</a>";
    row.cells[10].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["SharesCode_Max"] +
      '">' +
      data["SharesName_Max"] +
      "</a>";
    row.cells[11].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["ProportionCode_Max"] +
      '">' +
      data["ProportionName_Max"] +
      "</a>";
  },
  bkcglsmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);
    row.cells[0].innerHTML = data["HdDate"];
    //row.cells[1].innerHTML = Tools.getColorByDate(data["Zdf"], 2, "%"); //涨跌幅
    row.cells[1].innerHTML = data["ZC_Count"];
    row.cells[2].innerHTML = Tools.FixAmt(data["ShareSZ_ZC"]);
    row.cells[3].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg"] * 100,
      2,
      "%"
    );
    row.cells[4].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg_BK"] * 1000,
      2,
      "‰"
    );
    row.cells[5].innerHTML = Tools.getColorByDate(
      data["ShareHold_ZC_Chg_GZ"] * 1000,
      2,
      "‰"
    );
    row.cells[6].innerHTML = data["Count"];
    row.cells[7].innerHTML = Tools.FixAmt(data["ShareSZ_GZ"]);
    row.cells[8].innerHTML = Tools.toPercent(data["ShareHold_Chg_BK"], 2);
    row.cells[9].innerHTML = Tools.toPercent(data["ShareHold_Chg_GZ"], 2);
    row.cells[10].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Max_SZ_Code"] +
      '">' +
      data["Max_SZ_Name"] +
      "</a>";
    row.cells[11].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Max_ZB_Code"] +
      '">' +
      data["Max_ZB_Name"] +
      "</a>";
    row.cells[12].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Min_SZ_Code"] +
      '">' +
      data["Min_SZ_Name"] +
      "</a>";
    row.cells[13].innerHTML =
      '<a href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data["Min_ZB_Code"] +
      '">' +
      data["Min_ZB_Name"] +
      "</a>";
  },
  lzggmaketr: function (row, data, i, c) {
    var _class = i % 2 == 0 ? "" : "odd";
    row.className = _class;
    row.onmouseover = function () {
      this.className = "over";
    };
    row.onmouseout = function (o, _c) {
      o.className = _c;
    }.binding(this, row, _class);

    var hqLink = "http://quote.eastmoney.com/hk/" + data.SCODE + ".html",
      date = Tools.dateFormat(data.HDDATE, "yyyy-MM-dd");
    row.cells[0].innerHTML = date; //持股日期
    row.cells[1].innerHTML = '<a href="' + hqLink + '">' + data.SCODE + "</a>"; //股票代码
    row.cells[2].innerHTML =
      '<a class="ellipsis w88" href="' +
      hqLink +
      '" title="' +
      data.SNAME +
      '">' +
      data.SNAME +
      "</a>"; //股票简称
    row.cells[3].innerHTML =
      '<a class="red" href="/hsgtcg/StockHdDetail.aspx?stock=' +
      data.SCODE +
      "&date=" +
      date +
      '">详细</a>';
    row.cells[4].innerHTML =
      '<span class="' +
      Tools.getColor(data.ZDF) +
      '">' +
      Tools.FixAmt(data["CLOSEPRICE"]) +
      "</span>"; //当日收盘价
    row.cells[5].innerHTML = Tools.getColorByDate(data.ZDF); //当日涨跌幅
    row.cells[6].innerHTML = Tools.FixAmt(data.SHAREHOLDSUM); //持股数量
    row.cells[7].innerHTML = Tools.FixAmt(data.SHAREHOLDPRICE); //持股市值
    row.cells[8].innerHTML = Tools.FixAmt(data.SHARESRATE); //持股数量占比
    row.cells[9].innerHTML = Tools.getColorByDate(data.SHAREHOLDPRICEONE); //持股市值变化1日
    row.cells[10].innerHTML = Tools.getColorByDate(data.SHAREHOLDPRICEFIVE); //持股市值变化5日
    row.cells[11].innerHTML = Tools.getColorByDate(data.SHAREHOLDPRICETEN); //持股市值变化10日
  },
  ggcells: [
    { n: "序号" },
    { n: "代码", s: "SCode" },
    { n: "名称", w: 58 },
    { n: "相关", w: 55 },
    { n: "今日<br/>收盘价", s: "NewPrice" },
    { n: "今日<br/>涨跌幅", s: "Zdf" },
    {
      n: "今日持股",
      cells: [
        { n: "股数", w: 60, s: "ShareHold" },
        { n: "市值", w: 60, s: "ShareSZ" },
        { n: "占流通<br/>股比", s: "LTZB" },
        { n: "占总股<br/>本比", s: "ZZB" },
      ],
    },
    {
      n: "今日增持估计",
      cells: [
        { n: "股数", w: 60, s: "ShareHold_Chg_One" },
        { n: "市值", w: 60, s: "ShareSZ_Chg_One" },
        { n: "市值增幅", s: "ShareSZ_Chg_Rate_One" },
        { n: "占流通<br/>股比(‰)", s: "LTZB_One" },
        { n: "占总股<br/>本比(‰)", s: "ZZB_One" },
      ],
    },
    { n: "所属板块", w: 58 },
  ],
  bkcells: [
    { n: "序号" },
    { n: "名称" },
    { n: "相关" },
    { n: "最新<br/>涨跌幅", s: "Zdf" },
    {
      n: "北向资金今日持股",
      cells: [
        { n: "股票<br/>只数", s: "Count" },
        { n: "市值", s: "ShareSZ_GZ" },
        {
          n:
            "占板块<br/>比" +
            gettip("持股市值占板块比=100%*持股市值/板块总市值"),
          s: "ShareHold_Chg_BK",
        },
        {
          n:
            "占北向<br/>资金比" +
            gettip("持股市值占北向资金比=100%*持股市值/北向资金累计净买入"),
          s: "ShareHold_Chg_GZ",
        },
      ],
    },
    {
      n: "北向资金今日增持估计",
      cells: [
        { n: "股票<br/>只数", s: "ZC_Count" },
        { n: "市值", s: "ShareSZ_ZC" },
        { n: "市值增幅", s: "ShareHold_ZC_Chg" },
        {
          n:
            "占板块<br/>比(‰)" +
            gettip("增持市值占板块比=1000‰*增持市值/板块总市值"),
          s: "ShareHold_ZC_Chg_BK",
        },
        {
          n:
            "占北向资金<br/>比(‰)" +
            gettip("增持市值占北向资金比=1000‰*增持市值/北向资金累计净买入"),
          s: "ShareHold_ZC_Chg_GZ",
        },
      ],
    },
    {
      n: "今日增持最大股",
      cells: [
        { n: "市值" + gettip("增持市值最大的股票") },
        { n: "占股本<br/>比" + gettip("增持市值占总市值最大的股票") },
      ],
    },
    {
      n: "今日减持最大股",
      cells: [
        { n: "市值" + gettip("增持市值最小的股票") },
        { n: "占股本<br/>比" + gettip("增持市值占总市值最小的股票") },
      ],
    },
  ],
  jgcells: [
    { n: "持股日期", s: "HDDATE", w: 100 },
    { n: "机构名称", w: 260 },
    { n: "相关", w: 45 },
    { n: "持股只数<br />（只）", s: "SHAREHOLDCOUNT", w: 80 },
    { n: "持股市值<br />（元）", s: "SHAREHOLDPRICE", w: 100 },
    {
      n: "持股市值变化（元）",
      cells: [
        { n: "1日", s: "SHAREHOLDPRICEONE", w: 90 },
        { n: "5日", s: "SHAREHOLDPRICEFIVE", w: 90 },
        { n: "10日", s: "SHAREHOLDPRICETEN", w: 90 },
      ],
    },
  ],
  cglscells: [
    { n: "日期" },
    { n: "沪深300<br/>涨跌幅", s: "Zdf" },
    {
      n: "北向资金今日增持估计",
      cells: [
        { n: "市值", s: "ShareSZ_Add" },
        {
          n:
            "占全市场<br/>比(‰)" +
            gettip("增持市值占板块比=1000‰* 增持市值/两市总市值"),
          s: "ShareHoldAdd_ZB_ALL",
        },
      ],
    },
    {
      n: "北向资金今日持股",
      cells: [
        { n: "市值", s: "ShareSZ" },
        {
          n:
            "占全市场<br/>比" +
            gettip("持股市值占板块比=100%* 持股市值/两市总市值"),
          s: "ShareHold_ZB_ALL",
        },
      ],
    },
    {
      n: "今日增持最大行业",
      cells: [
        { n: "市值<br/>增持" + gettip("市值增持最大的行业") },
        { n: "占板块<br/>比增加" + gettip("增持市值占板块市值最大的行业") },
        { n: "占全市场<br/>比增加" + gettip("增持市值占两市总市值最大的行业") },
      ],
    },
    {
      n: "今日增持最大股",
      cells: [
        { n: "市值<br/>增持" + gettip("市值增持最大的股") },
        { n: "股数<br/>增加" + gettip("增持股数最大的股") },
        { n: "占股比<br/>增加" + gettip("增持市值占总市值最大的股") },
      ],
    },
  ],
  bkcglscells: [
    { n: "日期", s: "Zdf" },
    {
      n: "北向资金今日增持估计",
      cells: [
        { n: "股数", s: "ZC_Count" },
        { n: "市值", s: "ShareSZ_ZC" },
        { n: "市值增幅(%)", s: "ShareHold_ZC_Chg" },
        { n: "占板块比(‰)", s: "ShareHold_ZC_Chg_BK" },
        { n: "占北向资金比(‰)", s: "ShareHold_ZC_Chg_GZ" },
      ],
    },
    {
      n: "北向资金今日持股",
      cells: [
        { n: "股数", s: "Count" },
        { n: "市值", s: "ShareSZ_GZ" },
        { n: "占板块比", s: "ShareHold_Chg_BK" },
        { n: "占北向资金比", s: "ShareHold_Chg_GZ" },
      ],
    },
    { n: "今日增持最大股", cells: [{ n: "市值" }, { n: "占股本比" }] },
    { n: "今日减持最大股", cells: [{ n: "市值" }, { n: "占股本比" }] },
  ],
  lzggcells: [
    { n: "持股日期", s: "HDDATE", w: 80 },
    { n: "股票代码", s: "SCODE", w: 70 },
    { n: "股票简称", w: 90 },
    { n: "相关", w: 65 },
    { n: "当日收盘价<br />（元）", s: "CLOSEPRICE", w: 65 },
    { n: "当日涨跌幅<br />（%）", s: "ZDF", w: 65 },
    { n: "持股数量<br />（股）", s: "SHAREHOLDSUM", w: 80 },
    { n: "持股市值<br />（元）", s: "SHAREHOLDPRICE", w: 70 },
    { n: "持股数量占A股百分比(%)", s: "SHARESRATE", w: 70 },
    {
      n: "持股市值变化（元）",
      cells: [
        { n: "1日", s: "SHAREHOLDPRICEONE", w: 65 },
        { n: "5日", s: "SHAREHOLDPRICEFIVE", w: 65 },
        { n: "10日", s: "SHAREHOLDPRICETEN", w: 65 },
      ],
    },
  ],
};
