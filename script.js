$(document).ready(function () {

    let input = $('.form-control')

    loadCity()

    $('#button-addon2').on("click", function () {
        let city = input.val()

        if (isNaN(parseInt(city)) === true) {

            window.localStorage.removeItem('zip')
            window.localStorage.setItem('city', city)

            let settings = {
                "url": 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };

            ajaxCurrent(settings)

            settings = {
                "url": 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
            };

            ajaxForcast(settings)


        } else if (city.length === 5 && isNaN(parseInt(city)) === false) {

            window.localStorage.removeItem('city')
            window.localStorage.setItem('zip', city)

            let settings = {
                "url": 'http://api.openweathermap.org/data/2.5/weather?zip=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };

            ajaxCurrent(settings)
        }
    })

    function ajaxCurrent(settings) {
        $.ajax(settings).then(function (response) {
            console.log(response);
            $('#cityName').text(response.name)
            $('#cityCountry').text(response.sys.country)
            $('#cityWeather').text(response.weather[0].description)
            $('#cityTemp').text(response.main.temp)
            $('#cityHumid').text(response.main.humidity)
            $('#cityWind').text(response.wind.speed)
            let lat = response.coord.lat
            let lon = response.coord.lon

            settings = {
                "url": 'http://api.openweathermap.org/data/2.5/uvi?appid=414413edc95ac55baac0a67078ade8d2&lat=' + lat + '&lon=' + lon,
            };

            $.ajax(settings).then(function (response) {
                $('#cityUV').text(response.value);
                if (response.value < 4) {
                    $('#cityUV').css('background-color', 'green')
                } else if (response.value < 6) {
                    $('#cityUV').css('background-color', 'yellow')
                } else if (response.value < 8) {
                    $('#cityUV').css('background-color', 'orange')
                } else if (response.value < 11) {
                    $('#cityUV').css('background-color', 'red')
                } else {
                    $('#cityUV').css('background-color', 'violet')
                }
            })
        })
    }

    function ajaxForcast(settings) {
        $.ajax(settings).then(function (response) {
            console.log(response);
            // $('#cityName').text(response.name)
            // $('#cityCountry').text(response.sys.country)
            // $('#cityWeather').text(response.weather[0].description)
            // $('#cityTemp').text(response.main.temp)
            // $('#cityHumid').text(response.main.humidity)
            // $('#cityWind').text(response.wind.speed)
            // let lat = response.coord.lat
            // let lon = response.coord.lon
            })
        }

    function loadCity() {
        city = localStorage.getItem('city')
        zip = localStorage.getItem('zip')
        if (zip === null) {
            let settings = {
                "url": 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };
            ajaxCurrent(settings)
        }
        else if (city === null) {
            city = zip
            let settings = {
                "url": 'http://api.openweathermap.org/data/2.5/weather?zip=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };
            ajaxCurrent(settings)
        }
    }

})