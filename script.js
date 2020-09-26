$(document).ready(function () {

    let input = $('.form-control')
    let one = null
    let two = null
    let history = []

    loadCity()

    $('#button-addon2').on("click", function (e) {
        e.preventDefault()
        console.log(history)
        let city = input.val()
        if (history !== null) {
            if (history.indexOf(city) === -1) {
                history.push(city);
                window.localStorage.setItem("history", JSON.stringify(history));

                addHistory(city)
            }
        }
        checkWeather(city)
    })

    $('.history').on("click", function (e) {
        console.log("history")
        checkWeather($(e.target).data('name'))
    })

    function checkWeather(city) {
        if (isNaN(parseInt(city)) === true) {


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
            if (one === null) {
                city = two
                window.localStorage.setItem('zip', city)
            } else if (two === null) {
                city = one
                window.localStorage.setItem('city', city)
            }
            confirm('Please enter a new city or zip, the one you entered does not exist in the database')
        }
    }

    function ajaxCurrent(settings) {
        $.ajax(settings).done(function (response) {
            $('#cityName').text(response.name)
            $('#cityCountry').text(response.sys.country)
            $('#cityWeather').text(response.weather[0].description)
            $('#cityTemp').text(response.main.temp.toFixed())
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
            let j = 1
            for (let i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.includes('12:00:00')) {
                    $('#date' + j).text((new Date(response.list[i].dt_txt).toLocaleDateString()))
                    $('.icon' + j).attr('src', 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png')
                    $('.temp' + j).text(response.list[i].main.temp.toFixed() + ' °F')
                    $('.humid' + j).text(response.list[i].main.humidity + '% Humidity')
                    j++
                }
            }
            // $('#cityName').text(response.name)
        })
    }

    function addHistory(x) {
        var button = $('<li>').addClass("button list-group-item list-group-item-action").text(x).data('name', x)
        $('.history').append(button)
    }

    function loadCity() {
        // Slight misnomer, also loads history
        history = JSON.parse(window.localStorage.getItem("history"))

        if (history != null) {
            for (var i = 0; i < history.length; i++) {
                addHistory(history[i]);
            }
        }

        city = localStorage.getItem('city')
        zip = localStorage.getItem('zip')

        if (zip === null && city === null || zip === 'null' && city === 'null' || zip === undefined && city === undefined) {
            city = 'Portland'
        }

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