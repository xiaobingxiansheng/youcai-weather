


$(function () {
  // event
  $('.allCity-wrap').on('click', '.city-item', function (ev) {
    $(this).toggleClass('city-item__opened')
    ev.stopPropagation();
  });
  $('.allCity-wrap').on('click', '.allCity-province', function (ev) {
    $(this).toggleClass('province-open')
    ev.stopPropagation();
  });
  $('.allCity-wrap').on('click', '.town-item', setLocate);
  $('.locate-hostCity-content').on('click', '.locate-city-label', setLocate);

  // 渲染全部城市
  getCityData().then((allCity) => {
    $('.allCity-content').html(getAllCityTel(allCity.province));
  })

  // 渲染‘当前定位’
  getStorageLocate();
})

function getStorageLocate(){
  $('.locate-now-content').html(localStorage.address || '尚未定位成功，请您通过定位权限！')
}

function setLocate(){
  localStorage.weatherCode = this.getAttribute('code')||'101010100';
  localStorage.address = this.innerHTML;
  window.location.href = "index.html?city=" + this.getAttribute('code') || '101010100';
}

function getAllCityTel(provinceList) {
  var html = '';
  for(var index in provinceList) {
    var province = provinceList[index]
    html+=`<div class="allCity-province">
      <div class="allCity-province-title">
        ${province["@name"]}
      </div>
      ${__getCityTel(province.city)}
      </div>
    `
  }
  return html;
}

function __getCityTel(cityList){
  var html = '<div class="city-list">';
  // 对象与数组分开处理
    if(isObject(cityList)){
      html+= `
          <div class="city-item">
              <div class="city-item-title">
                ${cityList['@name']}<span class="city-item-open" href="#"></span>
              </div>
              ${cityList.county　? __getTownTel(cityList.county): ''}
          </div>`;
    } else {
      for(var index in cityList){
        var city = cityList[index];
        html += `
            <div class="city-item">
              <div class="city-item-title">
                ${city['@name']}<span class="city-item-open" href="#"></span>
              </div>
              ${city.county　? __getTownTel(city.county) : ''}
          </div>
          `
        }
  }
  return html+'</div>';
}

function __getTownTel(townList) {
  var html = '<div class="town-list">';
    // 对象与数组分开处理
  if(isObject(townList)){
      html += `
        <div class="town-item" code="${townList['@weatherCode']}">
          ${townList['@name']}
        </div>
        `
  } else {
    for(var index in townList){
      var town = townList[index];
      html += `
        <div class="town-item" code="${town['@weatherCode']}">
          ${town['@name']}
        </div>
        `
    }
  }
  return html+'</div>';
}


function getCityData() {
  return new Promise((resolve, reject) => {
      $.ajax({
          url: "./weather_code.json",
          dataType: "json",
          type: "GET",
          async: false,
          error: function(error) {
             reject(error)
          },
          success: function(data) {
             resolve(data.China)
          }
      });
  })
}


function isObject(obj) {
  return Object.prototype.toString.call(obj).indexOf("Object") > -1
}