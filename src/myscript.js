function createStarScaleAsImgElements(numberOfStars) {
    var text = "";
    for (var i = 0; i < numberOfStars; i++) {
        text = text + '<img src="' + chrome.extension.getURL("star10.png") +
            '" alt="star" width="10" height="10">';
    }
    for (var j = numberOfStars; j < 5; j++) {
        text = text + '<img src="' + chrome.extension.getURL("star-gray10.png") +
            '" alt="star" width="10" height="10">';
    }
    return text;
}

function addNoDataInfo(doctor) {
    var doctorNameDiv = $(".reserveTable > tbody > tr > td[colspan=3] > div:nth-child(1)");
    var doctorName = getDoctorName(doctor);
    for (var i = 0; i < doctorNameDiv.length; i++) {
        if (doctorNameDiv[i].textContent.trim() === doctorName) {
            $(doctorNameDiv[i]).append("&nbsp;&nbsp;");
            var linkAndStars = '<a href="https://www.znanylekarz.pl/" target="_blank" '
                + 'title="Brak strony o danym lekarzu w serwisie znanylekarz.pl Kliknij, aby przejść do tej strony '
                + 'i spróbuj wyszukać lekarza ręcznie.">' + createStarScaleAsImgElements(0) + '</a>';
            $(doctorNameDiv[i]).append(linkAndStars);
        }
    }
}

function addStarsToLuxPage(doctor, numberOfStars, url) {
    var doctorNameDiv = $(".reserveTable > tbody > tr > td[colspan=3] > div:nth-child(1)");
    var doctorName = getDoctorName(doctor);
    for (var i = 0; i < doctorNameDiv.length; i++) {
        if (doctorNameDiv[i].textContent.trim() === doctorName) {
            $(doctorNameDiv[i]).append("&nbsp;&nbsp;");
            var linkAndStars = '<a href="' + url + '" target="_blank" ' +
                'title="Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.">'
                + createStarScaleAsImgElements(numberOfStars) + '</a>';
            $(doctorNameDiv[i]).append(linkAndStars);
        }
    }
}

function loadDoctorPage(url, doctor) {
    $.get(url).done(function (data) {
        var htmlPage = $('<div/>').html(data).contents();
        var numberOfStarsSpan = htmlPage.find("span.rating.big.pull-left");
        console.log("Odczytujemy gwiazdki dla: " + getDoctorName(doctor));
        if (numberOfStarsSpan.length > 0) {
            var numberOfStars = parseInt(numberOfStarsSpan[0].title);
            console.log("Gwiazdki: " + numberOfStars);
            addStarsToLuxPage(doctor, numberOfStars, url);
        } else {
            addStarsToLuxPage(doctor, 0, url);
        }
    });
}

function loadDoctor(doctor) {
    var arguments = {
        params: getSearchParamForDoctor(doctor),
        apiKey: "90a529da12d7e81ae6c1fae029ed6c8f",
        appID: "docplanner"
    };
    var doctorResponse = $.post("https://docplanner-3.algolia.io/1/indexes/pl_autocomplete_doctor/query",
        JSON.stringify(arguments));
    doctorResponse.done(function (data) {
        if (data.hits.length > 0) {
            loadDoctorPage(data.hits[0].url.replace("http://", "https://"), doctor);
        } else {
            addNoDataInfo(doctor);
        }
    });
}

function loadStars(doctors) {
    doctors.forEach(loadDoctor)
}

var currentUrl = window.location.toString();
if (currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/Find") {
    var doctorNames = $(".reserveTable > tbody > tr > td[colspan=3] > div:nth-child(1)");
    var favour = $(".reserveTable > tbody > tr > td[colspan=3] > div:nth-child(2)");
    var doctors = new Set();
    for (var i = 0; i < doctorNames.length; i++) {
        var doctor = createDoctor(doctorNames[i].textContent.trim(), favour[i].textContent.trim());
        doctors.add(doctor);
    }

    loadStars(doctors);
}
