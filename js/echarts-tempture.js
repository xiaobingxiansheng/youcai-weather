function initTempture(highLowObj) {
    var dom = document.getElementById("weather-sevday-line");
    var highAndLowEst = getlowestAndHighest(highLowObj);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        xAxis: {
            type: 'category',
            show: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            show: false,
            min: (highAndLowEst.min),
            max: (highAndLowEst.max)
        },
        series: [{
                type: 'line',
                data: highLowObj.high,
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}°'
                }
            },
            {
                type: 'line',
                data: highLowObj.low,
                label: {
                    show: true,
                    position: 'bottom',
                    formatter: '{c}°'
                }
            }
        ],
        grid: {
            left: 0
        },

    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    window.onresize = function () {
        myChart.resize();
    }
}

function getlowestAndHighest(highLowObj) {
    var temptureList = highLowObj.high.concat(highLowObj.low);
    Array.prototype.max = function () {
        var max = this[0];
        this.forEach(function (ele, index, arr) {
            if (+ele > +max) {
                max = ele;
            }
        })
        return max;
    }
    Array.prototype.min = function () {
        var min = this[0];
        this.forEach(function (ele, index, arr) {
            if (+ele < +min) {
                min = ele;
            }
        })
         return min;
    }
    console.log(temptureList)
    return {
        max: temptureList.max(),
        min: temptureList.min()
    };

}