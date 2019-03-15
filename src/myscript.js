function createStarScaleAsImgElements(numberOfStars) {
    function getImage(index, gold) {
        const name = `star-${gold ? 'gold' : 'gray'}-${index % 2 === 0 ? 'left' : 'right'}-10.png`;
        return chrome.extension.getURL(name)
    }

    let text = "";
    if (isNaN(numberOfStars)) {
        numberOfStars = 0;
    }
    const doubleNumberOfStarsInt = Math.ceil(numberOfStars * 2);
    for (let i = 0; i < 10; i++) {
        text = text + `<img src="${getImage(i, i < doubleNumberOfStarsInt)}" alt="star" width="5" height="10">`;
    }
    return text;
}

function generateInformation(noStars, url, title) {
    return `<a href="${url}" target="_blank" title="${title}">
        <span style="white-space: nowrap;">${createStarScaleAsImgElements(noStars)}</span>
        </a>`;
}

function loadStars(doctorNames, favour, city) {
    for (let i = 0; i < doctorNames.length; i++) {
        let doctor = new Doctor(doctorNames[i], favour[i].textContent.trim(), city);
        doctor.load();
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

function visitPageFutureTerms() {
    const doctorNames = $("#divReservedDynamicContent > div > div.description.limit-width > h4");
    const favour = $("#divReservedDynamicContent > div > div.description.limit-width > p:nth-child(2)").map((i, e) => e.childNodes[0]);
    loadStars(doctorNames, favour);
}

function visitPageExecutedTerms() {
    const entries = $("#reservationHistoryContent > div > div.description > p");
    const doctorNames = entries.map((i, e) => e.childNodes[0]);
    const favour = entries.map((i, e) => e.childNodes[2]);
    loadStars(doctorNames, favour);
}

function reservationPageTerms() {
    const doctorNames = $(".reserveTable > tbody > tr:not(:first-child) > td[colspan=3]:nth-child(2) > div:nth-child(1)");
    const favour = $(".reserveTable > tbody > tr:not(:first-child) > td[colspan=3] > div:nth-child(2)");
    const city = $('label[for="CityId"] + div > div > div > span.caption').first().text().trim();
    loadStars(doctorNames, favour, city);
}

function start() {
    if (isFindOrChangeTermSite()) {
        $('#foundTermsDiv').bind('DOMSubtreeModified', function (e) {
            if (e.target.localName === 'script') {
                reservationPageTerms();
            }
        });
    } else if (isVisitsPage()) {
        visitPageFutureTerms();
        visitPageExecutedTerms();
    } else if (isStartPage()) {
        const loadingText = $("#VisitBoxes > div > span").text().trim();
        if (loadingText === "Ładowanie treści, proszę czekać") {
            setTimeout(start, 1000);
            return;
        }

        startPageFutureTerms();
        startPageExecutedTerms();
    }
}

start();