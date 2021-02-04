var hsgtctcharts = [];

//沪深港通实时资金流
var urlsszjl =
  newHqDomain +
  "api/qt/kamt/get?fltt=2&fields1=f1,f3&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59&ut=b2884a393a59ad64002292a3e90d46a5";
var nowyear = new Date().getFullYear();

!(function gzcglist($) {
  bklistload();
  var t1 = "jmr";
  var t2 = "fs";
  var t3 = "0";
  setselect(t1, t2, t3);
  loadzjlchart(t1, t2, t3);
  loadsszjl();
  //loadtabledata();
  loadevent();
  this.hgtjs1 = [loadsszjl, loadzjlchart];
  function loadevent() {
    $(".chart_type1").on("click", "li", function () {
      $(".chart_type2 li").show();
      $(".cateday .chart_legend").show();
      var type1 = $(this).data("type");
      var type2 = $(".chart_type2 .at2").data("type");
      var type3 = $('input[name="chart_radio"]:checked').data("type");
      if (type2 == "fs" && type1 == "ljjmr") {
        $(".chart_type2 li").removeClass("at2");
        $(".chart_type2 li[data-type='101']").addClass("at2");
        type2 = 101;
      }
      $(".chart_type1 li").removeClass("at");
      $(this).addClass("at");
      if (type1 == "zjye") {
        $(".cateday .chart_legend").hide();
        [2, 3, 4, 5].forEach(function (e, i) {
          $(".chart_type2 li").eq(e).hide();
        });
        if (type2 != "fs" && type2 != "101") {
          type2 = "fs";
          $(".chart_type2 li[data-type='fs']").addClass("at2");
        }
        type3 = "0";
      } else if (type1 == "ljjmr") {
        $(".chart_type2 li").eq(0).hide();
      }
      loadzjlchart(type1, type2, type3);
    });
    $(".chart_type2").on("click", "li", function () {
      var type1 = $(".chart_type1 .at").data("type");
      var type2 = $(this).data("type");
      var type3 = $('input[name="chart_radio"]:checked').data("type");
      if (type2 == "fs" && type1 == "ljjmr") {
        $(".chart_type1 li").removeClass("at");
        $(".chart_type1 li[data-type='jmr']").addClass("at");
        type1 = "jmr";
      }
      $(".chart_type2 li").removeClass("at2");
      $(this).addClass("at2");
      if (type1 == "zjye" || type2 == "fs") {
        $(".cateday .chart_legend").hide();
        type3 = "0";
      } else {
        $(".cateday .chart_legend").show();
      }
      loadzjlchart(type1, type2, type3);
    });
    $("input[type=radio][name=chart_radio]").change(function () {
      var type1 = $(".chart_type1 .at").data("type");
      var type2 = $(".chart_type2 .at2").data("type");
      var type3 = $(this).data("type");
      loadzjlchart(type1, type2, type3);
    });
  }

  function bklistload() {
    //var pop = new BkzjlxPop();
  }

  function setselect(type1, type2, type3) {
    $(".chart_type1 li").removeClass("at");
    $(".chart_type1 li[data-type='" + type1 + "']").addClass("at");
    $(".chart_type2 li").removeClass("at2");
    $(".chart_type2 li[data-type='" + type2 + "']").addClass("at2");
    $(":radio[name='chart_radio'][data-type='" + type3 + "']").prop(
      "checked",
      "checked"
    );
    $(".cateday .chart_legend").show();
    if (type1 == "zjye" || type2 == "fs") {
      $(".cateday .chart_legend").hide();
    }
  }

  function loadsszjl() {
    var zjlcont = $(".chart-data-cont");
    Tools.getJsonDataNewHq(urlsszjl, function (json) {
      var hgtdata, sgtdata;
      if (json.data && json.data.hk2sh && json.data.hk2sz) {
        hgtdata = json.data.hk2sh;
        sgtdata = json.data.hk2sz;
        $(".hgt_drjlr").html(
          Tools.getColorByDate(hgtdata["dayNetAmtIn"] * 10000, 2, "元")
        );
        $(".hgt_drye").html(
          Tools.getColorByDate(hgtdata["dayAmtRemain"] * 10000, 2, "元")
        );
        $(".hgt_jyyjlr").html(
          Tools.getColorByDate(hgtdata["monthNetAmtIn"] * 10000, 2, "元")
        );
        //$(".hgt_jynjlr", zjlcont).html(Tools.getColorByDate(hgtdata["yearNetAmtIn"] * 10000, 2, "元"));
        $(".hgt_ljjlr").html(
          Tools.getColorByDate(hgtdata["allNetAmtIn"] * 10000, 2, "元")
        );

        $(".sgt_drjlr").html(
          Tools.getColorByDate(sgtdata["dayNetAmtIn"] * 10000, 2, "元")
        );
        $(".sgt_drye").html(
          Tools.getColorByDate(sgtdata["dayAmtRemain"] * 10000, 2, "元")
        );
        $(".sgt_jyyjlr").html(
          Tools.getColorByDate(sgtdata["monthNetAmtIn"] * 10000, 2, "元")
        );
        //$(".sgt_jynjlr", zjlcont).html(Tools.getColorByDate(sgtdata["yearNetAmtIn"] * 10000, 2, "元"));
        $(".sgt_ljjlr").html(
          Tools.getColorByDate(sgtdata["allNetAmtIn"] * 10000, 2, "元")
        );

        $(".bx_drjlr").html(
          Tools.getColorByDate(
            (hgtdata["dayNetAmtIn"] + sgtdata["dayNetAmtIn"]) * 10000,
            2,
            "元"
          )
        );
        $(".bx_jyyjlr").html(
          Tools.getColorByDate(
            (hgtdata["monthNetAmtIn"] + sgtdata["monthNetAmtIn"]) * 10000,
            2,
            "元"
          )
        );
        //$(".bx_jynjlr", zjlcont).html(Tools.getColorByDate((hgtdata["yearNetAmtIn"] + sgtdata["yearNetAmtIn"]) * 10000, 2, "元"));
        $(".bx_ljjlr").html(
          Tools.getColorByDate(
            (hgtdata["allNetAmtIn"] + sgtdata["allNetAmtIn"]) * 10000,
            2,
            "元"
          )
        );
      }
    });
    Tools.getJsonData2(
      "https://dcfm.eastmoney.com/EM_MutiSvcExpandInterface/api/js/get?type=HSGT20_GZJME_LS_MX&filter=(DateType=%27y%27)&token=894050c76af8597a853f5b408b759f5d&st=TradeDate&sr=-1&ps=1",
      function (json) {
        if (json && json[0]) {
          $(".hgt_ljjmr").html(
            Tools.getColorByDate(json[0]["HKShanghaiStock"] * 1000000, 2, "元")
          );

          $(".sgt_ljjmr").html(
            Tools.getColorByDate(json[0]["HKShenzhenStock"] * 1000000, 2, "元")
          );

          $(".bx_ljjmr").html(
            Tools.getColorByDate(json[0]["MainlandFunds"] * 1000000, 2, "元")
          );
        }
      }
    );
  }

  function loadzjlchart(type1, type2, type3) {
    var urlchart,
      zschart,
      names = ["", "北向", "上证指数"];//"沪股通", "深股通", 
    if (type1 == "jmr") {
      switch (type2) {
        case "fs":
          urlchart =
            newHqDomain +
            "api/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f52,f54,f56&ut=b2884a393a59ad64002292a3e90d46a5";
          zschart =
            newHqDomain +
            "api/qt/stock/trends2/get?secid=1.000001&fields1=f1&fields2=f51,f53&ut=b2884a393a59ad64002292a3e90d46a5";
          break;
        default:
          {
            if (type3 == "0") {
              urlchart =
                newHqDomain_K +
                "api/qt/kamt.kline/get?fields1=f1,f3,f5&fields2=f51,f52&klt=" +
                type2 +
                "&lmt=500&ut=b2884a393a59ad64002292a3e90d46a5";
            } else {
              urlchart =
                strV4Domain +
                "type=HSGT20_GZJME_MX&filter=(DateType='" +
                echartsfun.getdatatype(type2) +
                "')&token=894050c76af8597a853f5b408b759f5d&st=TradeDate&sr=-1&ps=500";
            }
            zschart =
              newHqDomain_K +
              "api/qt/stock/kline/get?secid=1.000001&fields1=f1&fields2=f51,f53&klt=" +
              type2 +
              "&fqt=0&lmt=600&end=29991010&ut=b2884a393a59ad64002292a3e90d46a5";

            names = ["",  "北向", "上证指数"];//"沪股通", "深股通",
          }
          break;
      }
    } else if (type1 == "zjye") {
      switch (type2) {
        case "fs":
          urlchart =
            newHqDomain +
            "api/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f53,f55&ut=b2884a393a59ad64002292a3e90d46a5";
          zschart =
            newHqDomain +
            "api/qt/stock/trends2/get?secid=1.000001&fields1=f1&fields2=f51,f53&ut=b2884a393a59ad64002292a3e90d46a5";
          names = ["", "沪股通", "深股通", "上证指数"];
          break;
        default:
          {
            urlchart =
              newHqDomain_K +
              "api/qt/kamt.kline/get?fields1=f1,f3,f5&fields2=f51,f53&klt=" +
              type2 +
              "&lmt=500&ut=b2884a393a59ad64002292a3e90d46a5";
            zschart =
              newHqDomain_K +
              "api/qt/stock/kline/get?secid=1.000001&fields1=f1&fields2=f51,f53&klt=" +
              type2 +
              "&fqt=0&lmt=600&end=29991010&ut=b2884a393a59ad64002292a3e90d46a5";
            names = ["", "北向", "上证指数"];// "沪股通", "深股通",
          }
          break;
      }
    } else if (type1 == "ljjmr") {
      switch (type2) {
        case "fs":
          urlchart =
            newHqDomain +
            "api/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f53,f55&ut=b2884a393a59ad64002292a3e90d46a5";
          zschart =
            newHqDomain +
            "api/qt/stock/trends2/get?secid=1.000001&fields1=f1&fields2=f58&ut=b2884a393a59ad64002292a3e90d46a5";
          names = ["", "沪股通", "深股通", "上证指数"];
          break;
        default:
          {
            if (type3 == "0") {
              urlchart =
                newHqDomain_K +
                "api/qt/kamt.kline/get?fields1=f1,f3,f5&fields2=f51,f54&klt=" +
                type2 +
                "&lmt=500&ut=b2884a393a59ad64002292a3e90d46a5";
            } else {
              urlchart =
                strV4Domain +
                "type=HSGT20_GZJME_LS_MX&filter=(DateType='" +
                echartsfun.getdatatype(type2) +
                "')&token=894050c76af8597a853f5b408b759f5d&st=TradeDate&sr=-1&ps=500";
            }
            zschart =
              newHqDomain_K +
              "api/qt/stock/kline/get?secid=1.000001&fields1=f1&fields2=f51,f53&klt=" +
              type2 +
              "&fqt=0&lmt=600&end=29991010&ut=b2884a393a59ad64002292a3e90d46a5";
            names = ["", "北向", "上证指数"];//"沪股通", "深股通", 
          }
          break;
      }
    }
    if (type3 != "0")
      Tools.getJsonData2(urlchart, function (json) {
        if (json && json[0]) {
          zschart = zschart.replace(
            "29991010",
            json[0].TradeDate.replace(/-/g, "")
          );
          $("#updateTime_chart").html(
            Tools.dateFormat(json[0].TradeDate, "MM-dd")
          );
        }
        Tools.getJsonDataNewHq(zschart, function (zs) {
          //zs.data.trends || zs.data.klines
          var datas = [];
          if (type1 == "jmr")
            datas = echartsfun.makedatadcfm(
              json,
              ["TradeDate", "ShanghaiStock", "ShenzhenStock", "HKFunds"],
              100
            );
          else
            datas = echartsfun.makedatadcfm(
              json,
              [
                "TradeDate",
                "HKShanghaiStock",
                "HKShenzhenStock",
                "MainlandFunds",
              ],
              100
            );
          datas.push(
            echartsfun.pushdata(
              datas[0],
              echartsfun.arrtoobj(zs.data.klines),
              1,
              1
            )
          ); //指数
          drawdrzjlx("zjlx_chart", datas, names);
        });
      });
    else
      Tools.getJsonDataNewHq(urlchart, function (json) {
        $("#updateTime_chart").html(
          json.data.s2nDate ||
            Tools.dateFormat(
              json.data.s2n[json.data.s2n.length - 1].substring(0, 10),
              "MM-dd"
            )
        );
        Tools.getJsonDataNewHq(zschart, function (zs) {
          //zs.data.trends || zs.data.klines
          var datas = [];
          if (type2 == "fs") {
            datas = echartsfun.makedata(json.data.s2n); //北向
            datas.push(
              echartsfun.pushdata(
                datas[0],
                echartsfun.arrtoobj(zs.data.trends),
                1,
                1,
                function (key) {
                  return (
                    nowyear +
                    "-" +
                    json.data.s2nDate +
                    " " +
                    ("0" + key).slice(-5)
                  );
                }
              )
            );
          } else {
            //datas = echartsfun.makedata(json.data.hk2sh); //沪股通
            //datas.push(
            //   echartsfun.pushdata(
            //     datas[0],
            //     echartsfun.arrtoobj(json.data.hk2sz),
            //     1,
            //     10000
            //   )
            // ); //深股通
            datas.push(
              echartsfun.pushdata(
                datas[0],
                echartsfun.arrtoobj(json.data.s2n),
                1,
                10000
              )
            ); //北向
            datas.push(
              echartsfun.pushdata(
                datas[0],
                echartsfun.arrtoobj(zs.data.klines),
                1,
                1
              )
            ); //指数
          }
          //console.log(datas[0].concat(datas[2],datas[3]));
          
          drawdrzjlx("zjlx_chart", [datas[0],datas[3],datas[4]], names);
        });
      });
  }

  function drawdrzjlx(docname, datas, names) {
    var chart = getechart(docname);
    var colors = ["",  "#6b3906"];//"#2383fc", "#ff5bff",
    var option = {
      title: {
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        right: 20,
      },
      grid: {
        x: "6%",
        y: "15%",
        width: "88%",
        height: "75%",
      },
      xAxis: {
        type: "category",
        data: datas[0],
        axisTick: { show: false },
        axisLabel: {
          textStyle: {
            color: "#000",
          },
          interval: function (index, value) {
            if (
              value == "9:30" ||
              value == "10:30" ||
              value == "11:30" ||
              value == "14:00" ||
              value == "15:0"
            )
              return true;
            return false;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dotted",
            color: "#dde9f3",
          },
          interval: function (index, value) {
            if (value == "10:30" || value == "11:30" || value == "14:00")
              return true;
            return false;
          },
        },
      },
      yAxis: [
        {
          type: "value",
          scale: false,
          name: "单位：亿元",
          axisTick: { show: false },
          axisLabel: {
            textStyle: {
              color: "#000",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dotted",
              color: "#dde9f3",
            },
          },
        },
        {
          type: "value",
          scale: true,
          axisTick: { show: false },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "000",
            },
          },
        },
      ],
      series: [],
      animation: false,
    };
    for (var i = 1; i < datas.length; i++) {
      if (i == datas.length - 1) {
        option.series[i] = {
          name: names[i] + "(右)" || "指数",
          data: datas[i],
          yAxisIndex: 1,
          connectNulls: true,
          symbol: "circle",
          showSymbol: false,
          itemStyle: {
            color: "#E04527",
            normal: {
              color: "#E04527",
              borderColor: "#E04527",
            },
          },
          lineStyle: {
            width: 1,
          },
          type: "line",
        };
      } else {
        option.series[i] = {
          name: names[i] + "(左)",
          data: datas[i],
          connectNulls: true,
          symbol: "circle",
          showSymbol: false,
          itemStyle: {
            color: colors[i],
            normal: {
              color: colors[i],
              borderColor: colors[i],
            },
          },
          lineStyle: {
            width: 1,
          },
          type: "line",
        };
      }
    }
    chart.setOption(option);
  }
  function loadtabledata() {
    new LoadTable({
      id: "table_cgls",
      sort: { id: "HdDate", desc: true },
      cellcount: 12,
      pagesize: 50,
      autoScrollRun: false,
      cells: loadtablefun.cglscells,
      dataurl:
        "https://dcfm.eastmoney.com/EM_MutiSvcExpandInterface/api/js/get?type=HSGT20_GZJME_LS_MX&filter=(DateType=%27y%27)&token=894050c76af8597a853f5b408b759f5d&st=TradeDate&sr=-1&ps=1",
      param: {
        mkt_type: {
          cname: "li",
          type: "Market",
          value: "Market='005'",
          filter: true,
        },
      },
      defjson: pagedata["cglsdata"],
      maketr: loadtablefun.cglsmaketr,
    });
  }
})(jQuery);
