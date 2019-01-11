var __getIconFromCNstate = (function(){
    var icon = 'weather-img-';
    var weatherIconArray = [
        {
            name: "霾",
            class: icon+'mai'
        },{
            name: "雾",
            class: icon+'wu'
        },{
            name: "扬沙",
            class: icon+'yangsha'
        },{
            name: "浮尘",
            class: icon+'fuchen'
        },{
            name: "小雪",
            class: icon+'xiaoxue'
        },{
            name: "中雪",
            class: icon+'zhongxue'
        },{
            name: "大雪",
            class: icon+'daxue'
        },{
            name: "阵雪",
            class: icon+'zhenxue'
        },{
            name: "冻雪",
            class: icon+'dongxue'
        },{
            name: "暴雪",
            class: icon+'baoxue'
        },{
            name: "阵雨",
            class: icon+'zhenyu'
        },{
            name: "小雨",
            class: icon+'xiaoyu'
        },{
            name: "中雨",
            class: icon+'zhongyu'
        },{
            name: "大雨",
            class: icon+'dayu'
        },{
            name: "暴雨",
            class: icon+'baoyu'
        },{
            name: "沙尘暴",
            class: icon+'shachenbao'
        },{
            name: "强沙尘暴",
            class: icon+'qiangshachenbao'
        },{
            name: "多云",
            class: icon+'duoyun'
        },{
            name: "晴",
            class: icon+'qing'
        },{
            name: "阴",
            class: icon+'yin'
        },{
            name: "大暴雨",
            class: icon+'dabaoyu'
        },{
            name: "特大暴雨",
            class: icon+'tedabaoyu'
        },{
            name: "雷阵雨",
            class: icon+'leizhenyu'
        },{
            name: "雨夹雪",
            class: icon+'yujiaxue'
        },{
            name: "雷阵雨伴冰雹",
            class: icon+'leizhenyubanbingbao'
        }
      ]
    return function (CNstate){
        for(var index in weatherIconArray){
            var item = weatherIconArray[index]
            var isMatch = CNstate.indexOf(item.name) > -1;
            if(isMatch)
                return item.class
        }
    }
})();


