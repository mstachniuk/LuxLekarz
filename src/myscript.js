function starImgGoldName(partNumber) {
    if(partNumber % 2 === 0) {
        return "star-gold-left-10.png";
    }
    return "star-gold-right-10.png"
}

function starImgGrayName(partNumber) {
    if(partNumber % 2 === 0) {
        return "star-gray-left-10.png";
    }
    return "star-gray-right-10.png"
}

function createStarScaleAsImgElements(numberOfStars) {
    var text = "";
    if(isNaN(numberOfStars)) {
        numberOfStars = 0;
    }
    var doubleNumberOfStarsInt = Math.ceil(numberOfStars * 2);
    for (var i = 0; i < doubleNumberOfStarsInt; i++) {
        text = text + '<img src="' + chrome.extension.getURL(starImgGoldName(i)) +
            '" alt="star" width="5" height="10">';
    }
    for (var j = doubleNumberOfStarsInt; j < 10; j++) {
        text = text + '<img src="' + chrome.extension.getURL(starImgGrayName(j)) +
            '" alt="star" width="5" height="10">';
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
                + 'i spróbuj wyszukać lekarza ręcznie."><span style="white-space: nowrap;">'
                + createStarScaleAsImgElements(0) + '</span></a>';
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
            var linkAndStars = '<a href="' + url + '" target="_blank" '
                + 'title="Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.">'
                + '<span style="white-space: nowrap;">'
                + createStarScaleAsImgElements(numberOfStars) + '</span></a>';
            $(doctorNameDiv[i]).append(linkAndStars);
        }
    }
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
            var numberOfStars = parseFloat(data.hits[0].stars);
            console.log("Odczytano " + numberOfStars + " gwiazdki dla: " + getDoctorName(doctor));
            addStarsToLuxPage(doctor, numberOfStars, data.hits[0].url.replace("http://", "https://"));
        } else {
            console.log("Nie znaleziono strony dla: " + getDoctorName(doctor));
            addNoDataInfo(doctor);
        }
    });
}

function loadStars(doctors) {
    doctors.forEach(loadDoctor)
}

var currentUrl = window.location.toString();
if (currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/Find"
        || currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/SearchVisitsForChangeTerm") {
    var doctorNames = $(".reserveTable > tbody > tr > td[colspan=3]:nth-child(2) > div:nth-child(1)");
    var favour = $(".reserveTable > tbody > tr > td[colspan=3] > div:nth-child(2)");
    var doctors = new Set();
    for (var i = 0; i < doctorNames.length; i++) {
        var doctor = createDoctor(doctorNames[i].textContent.trim(), favour[i].textContent.trim());
        doctors.add(doctor);
    }

    loadStars(doctors);
}
