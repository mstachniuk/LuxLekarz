function starImgGoldName(partNumber) {
    if (partNumber % 2 === 0) {
        return "star-gold-left-10.png";
    }
    return "star-gold-right-10.png"
}

function starImgGrayName(partNumber) {
    if (partNumber % 2 === 0) {
        return "star-gray-left-10.png";
    }
    return "star-gray-right-10.png"
}

function createStarScaleAsImgElements(numberOfStars) {
    let text = "";
    if (isNaN(numberOfStars)) {
        numberOfStars = 0;
    }
    const doubleNumberOfStarsInt = Math.ceil(numberOfStars * 2);
    for (let i = 0; i < doubleNumberOfStarsInt; i++) {
        text = text + '<img src="' + chrome.extension.getURL(starImgGoldName(i)) +
            '" alt="star" width="5" height="10">';
    }
    for (let j = doubleNumberOfStarsInt; j < 10; j++) {
        text = text + '<img src="' + chrome.extension.getURL(starImgGrayName(j)) +
            '" alt="star" width="5" height="10">';
    }
    return text;
}

function addNoDataInfo(doctor) {
    const linkAndStars = `<a href="https://www.znanylekarz.pl/" target="_blank" 
        title="Brak strony o danym lekarzu w serwisie znanylekarz.pl Kliknij, aby przejść do tej strony i spróbuj wyszukać lekarza ręcznie.">
        <span style="white-space: nowrap;">${createStarScaleAsImgElements(0)}</span></a>`;
    doctor.addInformation(linkAndStars);

}

function addStarsToLuxPage(doctor, numberOfStars, url) {
    const linkAndStars = `<a href="${url}" target="_blank" 
        title="Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.">
        <span style="white-space: nowrap;">${createStarScaleAsImgElements(numberOfStars)}</span>
        </a>`;
    doctor.addInformation(linkAndStars);
}

function loadDoctor(doctor) {
    doctor.makeRequest().done(function (data) {
        if (data.hits.length > 0) {
            const numberOfStars = parseFloat(data.hits[0].stars);
            console.log("Odczytano " + numberOfStars + " gwiazdki dla: " + doctor.name);
            addStarsToLuxPage(doctor, numberOfStars, data.hits[0].url.replace("http://", "https://"));
        } else {
            console.log("Nie znaleziono strony dla: " + doctor.name);
            addNoDataInfo(doctor);
        }
    });
}

function loadStars(doctorNames, favour) {
    for (let i = 0; i < doctorNames.length; i++) {
        let doctor = new Doctor(doctorNames[i], favour[i].textContent.trim());
        loadDoctor(doctor);
    }
}

function isFindOrChangeTermSite() {
    const currentUrl = window.location.toString();
    return currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/Search"
        || currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Reservation/SearchVisitsForChangeTerm";
}

function isVisitsPage() {
    const currentUrl = window.location.toString();
    return currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/Reservations/Visits";
}

function isStartPage() {
    const currentUrl = window.location.toString();
    return currentUrl === "https://portalpacjenta.luxmed.pl/PatientPortal/"
}

function startPageFutureTerms() {
    const doctorNames = $("#userReservations > div.content > div.item > div.description.limit-width > h4");
    const favour = $("#userReservations > div > div > div.description > p:nth-child(2)").map((i, e) => e.childNodes[3]);
    loadStars(doctorNames, favour);
}

function startPageExecutedTerms() {
    const doctorNames = $("#userReservations > div.content > div.item > div.description:not(.limit-width) > h4");
    const favour = $("#userReservations > div.content.with-padding-top > div.item > div.description ").map((i, e) => e.childNodes[3]);
    loadStars(doctorNames, favour);
}

function start() {
    if (isFindOrChangeTermSite()) {
        $('#foundTermsDiv').bind('DOMSubtreeModified', function (e) {
            if (e.target.localName === 'script') {
                const doctorNames = $(".reserveTable > tbody > tr:not(:first-child) > td[colspan=3]:nth-child(2) > div:nth-child(1)");
                const favour = $(".reserveTable > tbody > tr:not(:first-child) > td[colspan=3] > div:nth-child(2)");
                loadStars(doctorNames, favour);
            }
        });
    } else if (isVisitsPage()) {
        //TODO: Split to Future Terms and Executed Terms
        const doctorNames = $("#divReservedDynamicContent > div > div.description.limit-width > h4");
        const favour = $("#divReservedDynamicContent > div > div.description.limit-width > p:nth-child(2)").map((i, e) => e.childNodes[0]);
        loadStars(doctorNames, favour);
    } else if (isStartPage()) {
        const loadingText = $("#VisitBoxes > div > span");
        if (loadingText.length > 0
            && loadingText[0].textContent.trim() === "Ładowanie treści, proszę czekać") {
            setTimeout(start, 1000);
            return;
        }

        startPageFutureTerms();
        startPageExecutedTerms();
    }
}

start();
