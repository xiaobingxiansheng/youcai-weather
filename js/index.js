(function() {
    /**
     * 获取url参数值
     * @param {url参数名} name 
     */
    var _getUrlParams = function(name) {
        try {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return unescape(r[2]);
            return null;
        } catch (error) {
            console.error("getUrlParams is Error: " + error.message)
            return null;
        }
    }
    var cityCode = _getUrlParams("city");
    if (cityCode == null || cityCode == "") {
        cityCode = 101010100;
    }
    main(cityCode);
})();



function main(weatherCode) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'get',
            url: 'http://wthrcdn.etouch.cn/WeatherApi',
            data: {
                "citykey": weatherCode
            },
            success: function (data) {
                //根据返回报文匹配是否为such city，  如果是默认请求北京的数据
                if (data.indexOf('such city') != -1) {
                    main("101010100");
                } else if (data.indexOf('error') != -1) {
                    return reject("接口返回错误!");
                } else {
                    resolve();
                }

                // 污染指数
                var city = $(data).find("city").text();
                var wendu = $(data).find("wendu").text();
                var suggest = $(data).find("suggest").text();
                var updatetime = $(data).find("updatetime").text();
                var aqi = $(data).find("aqi").text();
                var quality = $(data).find("quality").text();
                // var fengli = $(data).find("fengli").text();
                var shidu = $(data).find("shidu").text();
                $(".city").html(city + "<img src='img/down.png' style='width: 15px;margin-left: 5px;'>");
                $(".degrees").html(wendu + "°");
                $(".tips").html(suggest);
                if (aqi != "" || quality != "") {
                    $(".aqi").css("display", "block");
                    $(".aqi").html(aqi + " " + quality);
                    switch (quality) {
                        case "优":
                            $(".aqi").css("background", "#23b286");
                            break;
                        case "良":
                            $(".aqi").css("background", "#f0c545");
                            break;
                        case "轻度污染":
                            $(".aqi").css("background", "#f29e2b");
                            break;
                        default:
                            $(".aqi").css("background", "#f29e2b");
                    }
                }
                // console.log(fengli);
                $(".shidu").html("湿度：" + shidu);
                // 获取今天及明天的数据
                todayWeather(data, updatetime);
                tomorrowWeather(data, updatetime);
                lifeIndex(data);
                // console.log(data);
                sevenDayForecast(data)
            }
        });
    })

}

// 今天的天气，18点-6点是展示晚上的天气状况，6点-18点是展示的早上的天气状况
function todayWeather(data, updatetime) {
    var todayHigh = $(data).find("weather")[0].childNodes[1].textContent.split(" ")[1];
    var todayLow = $(data).find("weather")[0].childNodes[2].textContent.split(" ")[1];
    var todayDay = $(data).find("weather")[0].childNodes[3].childNodes[0].textContent;
    var todayNight = $(data).find("weather")[0].childNodes[4].childNodes[0].textContent;
    var todayFxDay = $(data).find("weather")[0].childNodes[3].childNodes[1].textContent;
    var todayFxNight = $(data).find("weather")[0].childNodes[4].childNodes[1].textContent;
    var dayOrNight;
    // var todayImg = "";
    $(".today-degrees").html(todayHigh + "/" + todayLow)
    // 判断今天天气情况，晚上18点之后，早上6点之前显示的晚上的天气情况
    if (updatetime.split(":")[0] > 18 || updatetime.split(":")[0] < 6) {
        $(".today-cloudy").html(todayNight);
        $(".wInformation").html(todayNight);
        $(".fengxiang").html(todayFxNight);
        dayOrNight = todayNight;
        // $(".today-img").append(todayImg);
        $(".today-img").addClass(__getIconFromCNstate(todayNight));
        $(".weather-head").css("background-image", "url(../img/05.jpg) no-repeat")
    } else {
        dayOrNight = todayDay;
        // $(".today-img").append(todayImg);
        // console.log(__getIconFromCNstate(todayDay));
        $(".today-img").addClass(__getIconFromCNstate(todayDay));
        $(".today-cloudy").html(todayDay);
        $(".wInformation").html(todayDay);
        $(".fengxiang").html(todayFxDay);
    }
    if(dayOrNight.indexOf("雨")!=-1){
        $(".weather-head").css("background", "url(../img/03.jpg) no-repeat");
        $(".weather-head").css("backgroundPosition", "center");
    }else if(dayOrNight.indexOf("阴")!=-1){
        $(".weather-head").css("background", "url(../img/05.jpg) no-repeat");
        $(".weather-head").css("backgroundPosition", "center");
    }else if(dayOrNight.indexOf("雪")!=-1){
        $(".weather-head").css("background", "url(../img/06.jpg) no-repeat")
        $(".weather-head").css("color", "black")
    }
}

// 明天的天气,展示的是早上的天气状况
function tomorrowWeather(data, updatetime) {
    var tomorrowHigh = $(data).find("weather")[1].childNodes[1].textContent.split(" ")[1];
    var tomorrowLow = $(data).find("weather")[1].childNodes[2].textContent.split(" ")[1];
    var tomorrowDay = $(data).find("weather")[1].childNodes[3].childNodes[0].textContent;
    var tomorrowImg = "";
    $(".tomorrow-degrees").html(tomorrowHigh + "/" + tomorrowLow);
    $(".tomorrow-img").addClass(__getIconFromCNstate(tomorrowDay));
    $(".tomorrow-cloudy").html(tomorrowDay)

}

// 生活指数
function lifeIndex(data) {
    var zihshuArray = $(data).find("zhishu");
    for (var i in zihshuArray) {
        if (i <= 7) {
            var template = "";
            template += `
                <span class="slide-content" name="${zihshuArray[i].childNodes[0].textContent}" comfortable="${zihshuArray[i].childNodes[1].textContent}" info="${zihshuArray[i].childNodes[2].textContent}">
                    <div class="content-information">
                        <img class="slide-img" src="./img/life-${i}.png">
                        <p>${zihshuArray[i].childNodes[0].textContent}</p>
                        <p>${zihshuArray[i].childNodes[1].textContent}</p>
                    </div>
                </span>
            `
            $(".slide-one").append(template);
        } else if (i > 7 && i < 16) {
            var template = "";
            template += `
                <span class="slide-content" name="${zihshuArray[i].childNodes[0].textContent}" comfortable="${zihshuArray[i].childNodes[1].textContent}" info="${zihshuArray[i].childNodes[2].textContent}">
                    <div class="content-information">
                        <img class="slide-img" src="./img/life-${i}.png">
                        <p>${zihshuArray[i].childNodes[0].textContent}</p>
                        <p>${zihshuArray[i].childNodes[1].textContent}</p>
                    </div>
                </span>
            `
            $(".slide-two").append(template);
        }
    }
    // 生活指数弹窗
    $(".slide-content").click(function () {
        $(".prop-title").html($(this).attr("name") + "(" + $(this).attr("comfortable") + ")");
        $(".prop-content").html($(this).attr("info"));
        $(".test").fadeIn();
        $(".prop").fadeIn("slow");
        $(".MaskLayer").fadeIn();
    })
    $(".test").click(function () {

        $(".MaskLayer").fadeOut();
        $(".prop").fadeOut();
        $(".test").fadeOut("slow");
    })
}

// 7天预报
function sevenDayForecast(data) {
    var weatherData = __getSevenDayForecastData(data);
    var weatherWrapDOM = $('.weather-sevday-scroll');
    var html = ''
    var highLowTemp = {
        high: [],
        low: []
    }
    // 渲染七天预报数据
    for (var i in weatherData) {
        var weather = weatherData[i];
        highLowTemp.high.push(weather.high)
        highLowTemp.low.push(weather.low)
        html += __getSevenDayForecastTel(weather)
    }
    weatherWrapDOM.append(html)
    initTempture(highLowTemp);
}

function __getSevenDayForecastTel(data) {
    return `
    <div class="weather-sevday-item">
        <div class="weather-sevday-morn">
            <p class="weather-morn-date">${data.day.day}</p>
            <p class="weather-morn-dateTime">${data.day.time}</p>
            <p class="weather-morn-state">${data.dayState}</p>
            <span class="weather-img ${data.dicon}"></span>
        </div>
        <div class="weather-sevday-night">
            <span class="weather-img ${data.nicon}"></span>
            <p class="weather-light-state">${data.nightState}</p>
            <p class="weather-light-windDir">${data.nfengxiang}</p>
            <p class="weather-light-windlev">${data.nfengli}</p>
        </div>
    </div>
    `
}

function __getSevenDayForecastData(data) {
    var forecast = $(data).find('forecast')[0];
    var weatherData = $(forecast).find('weather');
    var alldata = []
    // 获取时间累加器
    var getDayGenertor = __getDateFromToday();
    for (var index=0;index<weatherData.length;index++) {
        var weather = weatherData[index]
        // 从XML当中获取数据
        var high = __getNumberFromString($(weather).find('high').html());
        var low = __getNumberFromString($(weather).find('low').html());
        var dayState = $(weather).find('day type').html();
        var nightState = $(weather).find('night type').html();
        var dfengxiang = $(weather).find('day fengxiang').html();
        var nfengxiang = $(weather).find('night fengxiang').html();
        var dfengli = $(weather).find('day fengli').html();
        var nfengli = $(weather).find('night fengli').html();

        // 封装打包
        alldata.push({
            high,
            low,
            dayState,
            nightState,
            nfengxiang,
            day: getDayGenertor.getTime(),
            // dfengli:__getFengliFromCdata(dfengli),
            nfengli: __getFengliFromCdata(nfengli),
            dicon: __getIconFromCNstate(dayState),
            nicon: __getIconFromCNstate(nightState)
        })
    }
    return alldata;
}

// 从字符串中获取数字
function __getNumberFromString(string) {
    return string.match(/\-?\d+/)[0];
}

// 从XML Data中获取数字信息
function __getFengliFromCdata(string) {
    return string.match(/\d?[<-]?\b\d/) + "级";
}


function __getDateFromToday() {
    var now = new Date();
    // 在今天上累加的索引值
    var index = 0;
    // 下一天
    var next = new Date();
    // 日期中文和数字的映射
    function __getDay(indexDay, index) {
        switch (index) {
            case 0:
                return '今天';
            case 1:
                return '明天';
            case 2:
                return '后天';
        }
        var cnWeeks = ["日", "一", "二", "三", "四", "五", "六"];
        var enWeeks = cnWeeks[indexDay];
        return enWeeks;
    }
    // 补零操作
    function __getFullDate(date) {
        return date < 10 ? '0' + date : date;
    }
    return {
        getTime() {
            // 获取下一个日期
            next = new Date(new Date().setDate(now.getDate() + index));
            var month = next.getMonth() + 1;
            var date = __getFullDate(next.getDate());
            var day = __getDay(next.getDay(), index);
            index++;
            return {
                time: month + '/' + date,
                day
            }
        }
    }
}

// //晴天多云
// new Weather({
//     id: 'canvas',
//     weatherType: 'rain',
//     num: 3
// });
var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal', // 横向切换选项

    // 如果需要滚动条
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

$(".city").click(function () {
    window.localStorage.setItem("address", $(".city").html());
    window.location.href = "location.html";
})

// 跳转链接
$(".absoluteAlert").click(function () {
    window.location.href = "https://www.pgyer.com/TOoa";
})