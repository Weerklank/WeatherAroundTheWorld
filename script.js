$(document).ready(function () {

    let input = $('.form-control')
    let one = null
    let two = null

    loadCity()

    $('#button-addon2').on("click", function () {
        let city = input.val()

        if (isNaN(parseInt(city)) === true) {

            console.log('shit fuck damn')
            one = localStorage.getItem('city')
            two = localStorage.getItem('zip')
            window.localStorage.removeItem('zip')
            window.localStorage.setItem('city', city)

            let settings = {
                "url": 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };

            ajaxCurrent(settings)

            settings = {
                "url": 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
            };

            ajaxForcast(settings)


        } else if (city.length === 5 && isNaN(parseInt(city)) === false) {

            console.log('damn fuck shit')

            one = localStorage.getItem('city')
            two = localStorage.getItem('zip')
            window.localStorage.removeItem('city')
            window.localStorage.setItem('zip', city)

            let settings = {
                "url": 'https://api.openweathermap.org/data/2.5/weather?zip=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };

            ajaxCurrent(settings)

            settings = {
                "url": 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
            };

            ajaxForcast(settings)
        } else {
            console.log(one, two)
            if (one === null) {
                city = two
                window.localStorage.setItem('zip', city)
            } else if (two === null) {
                city = one
                window.localStorage.setItem('city', city)
            }
            confirm('Please enter a new city or zip, the one you entered does not exist in the database')
        }
    })

    function ajaxCurrent(settings) {
        $.ajax(settings).done(function (response) {
            $('#cityName').text(response.name)
            $('#cityCountry').text(response.sys.country)
            $('#cityWeather').text(response.weather[0].description)
            $('#cityTemp').text(response.main.temp)
            $('#cityHumid').text(response.main.humidity)
            $('#cityWind').text(response.wind.speed)
            let lat = response.coord.lat
            let lon = response.coord.lon

            settings = {
                "url": 'https://api.openweathermap.org/data/2.5/uvi?appid=414413edc95ac55baac0a67078ade8d2&lat=' + lat + '&lon=' + lon,
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
        }).fail(function (response) {
            console.log(one, two)
            if (one === null) {
                city = two
                window.localStorage.setItem('zip', city)
            } else if (two === null) {
                city = one
                window.localStorage.setItem('city', city)
            }
            confirm('Please enter a new city or zip, the one you entered does not exist in the database')
        })
    }

    function ajaxForcast(settings) {
        $.ajax(settings).then(function (response) {
            console.log(response.list);
            let j = 1
            for (let i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.includes('12:00:00')) {
                    $('#date' + j).text((new Date(response.list[i].dt_txt).toLocaleDateString()))
                    $('.temp' + j).text(response.list[i].main.temp)
                    console.log(response.list[i].main.temp)
                    $('.humid' + j).text(response.list[i].main.humidity)
                    j++
                    console.log(j)
                }
            }
            // $('#cityName').text(response.name)
        })
    }

    function loadCity() {
        city = localStorage.getItem('city')
        zip = localStorage.getItem('zip')
        if (zip === null) {
            let settings = {
                "url": 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };
            ajaxCurrent(settings)
            settings = {
                "url": 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
            };

            ajaxForcast(settings)
        } else if (city === null) {
            city = zip
            let settings = {
                "url": 'https://api.openweathermap.org/data/2.5/weather?zip=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
                "method": "GET",
                "timeout": 0
            };
            ajaxCurrent(settings)
            settings = {
                "url": 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=414413edc95ac55baac0a67078ade8d2&units=imperial',
            };

            ajaxForcast(settings)
        }
    }

})