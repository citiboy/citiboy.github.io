
        axios.get('https://textdb.dev/api/data/marketbreadth')
        .then(response => {
            const data = response.data;
            var matrixRow = [];
            var i=0;
            for(var key in data.swCodeNames)
            {
                var v=data.swCodeNames[key];
                // console.log(v.indexCode,v.indexName);
                var j=0;
                var x=data.maMarketWidth[v.indexCode].map(o => [j++,i,o.value20]);
                matrixRow.push(...x);
                // console.log(key,data.maMarketWidth[key]);
                i++;
            };
            // console.log(JSON.stringify(matrixRow));
            myChart = echarts.init(document.getElementById('container'));
            option = {
                tooltip: {
                    position: 'top'
                },
                animation: false,
                xAxis: {
                    type: 'category',
                    data: data.dates,
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        interval:0,//代表显示所有x轴标签显示
                        rotate:90, //代表逆时针旋转90度
                    },
                    axisLine: {
                               lineStyle: {
                                   color: '#fff'
                               }
                           },
                },
                yAxis: [{
                    type: 'category',
                    data: data.swCodeNames.map(v => v.indexName),
                    position: 'left',
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:0,
                    },
                    axisLine: {
                               lineStyle: {
                                   color: '#fff'
                               }
                           },
                },
                {
                    type: 'category',
                    data: data.swCodeNames.map(v => v.indexName),
                    position: 'right',
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:0,
                    },
                    axisLine: {
                               lineStyle: {
                                   color: '#fff'
                               }
                           },
                }],
                visualMap: {
                    min: 0,
                    max: 100,
                    calculable: true,
                    // inRange: {color: ["#e0ffff","#dc143c"]},
                    inRange: {color: ["#006edd", '#b8ddf0', '#e0ffff', '#e0bdb8', '#e16f56', '#eb190a']},
                    show: false
                },
                series: [{
                    type: 'heatmap',
                    data: matrixRow,
                    label: {
                        show: true,
            // -------------------修改分割线-----------------------------
            // 设置 formatter
                        formatter:function(params){
                            return params.data[2];
                        }
            // -------------------修改分割线-----------------------------
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            myChart.setOption(option,{notMerge:true});
        })
        .catch(error => {
           console.log(error);
        });
