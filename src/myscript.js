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
    return `<a href="${url}" target="_blank" title="${title}" onMouseOver="this.style.color='#FFFFFF'"">
        <span style="white-space: nowrap;">${createStarScaleAsImgElements(noStars)}</span>
        </a>`;
}

function loadStars(doctorNames, favour, city) {
    for (let i = 0; i < doctorNames.length; i++) {
        let service = serviceLuxToDocPlanner.get(favour[i].textContent.trim());
        let doctor = new Doctor(doctorNames[i].textContent.trim(), service, city);
        doctor.load(addInformationToDiv(doctorNames[i]));
    }
}

function addInformationToDiv(nameDiv) {
    return function (numberOfStars, url, title) {
        addInformation(nameDiv, generateInformation(numberOfStars, url, title));
    }
}

function addInformation(nameDiv, info) {
    const msg = "&nbsp;&nbsp;" + info;
    switch (nameDiv.nodeType) {
        case Node.ELEMENT_NODE:
            $(nameDiv).append(msg);
            break;
        case Node.TEXT_NODE:
            $(nameDiv).after(msg);
            break;
    }
}

let serviceLuxToDocPlanner = new Map();
serviceLuxToDocPlanner.set("Konsultacja alergologa", "alergolog");
serviceLuxToDocPlanner.set("Konsultacja chirurga dzieci", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga ogólnego", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga naczyniowego", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja chirurga plastyka", "chirurg plastyczny");
serviceLuxToDocPlanner.set("Konsultacja chirurga onkologa", "chirurg");
serviceLuxToDocPlanner.set("Konsultacja dermatologa", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja dermatologa - dzieci", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja diabetologa", "dermatolog");
serviceLuxToDocPlanner.set("Konsultacja endokrynologa", "endokrynolog");
serviceLuxToDocPlanner.set("Konsultacja flebologiczna", "flebolog");
serviceLuxToDocPlanner.set("Konsultacja gastroenterologa", "gastrolog");
serviceLuxToDocPlanner.set("Konsultacja ginekologa", "ginekolog");
serviceLuxToDocPlanner.set("Konsultacja ginekologa - endokrynologa", "ginekolog");
serviceLuxToDocPlanner.set("Konsultacja hematologa", "hematolog");
serviceLuxToDocPlanner.set("Konsultacja hepatologiczna", "gastrolog");
serviceLuxToDocPlanner.set("Konsultacja internisty", "internista");
serviceLuxToDocPlanner.set("Konsultacja internistyczna - Centrum Infekcyjne", "internista");
serviceLuxToDocPlanner.set("Konsultacja kardiologa", "kardiolog");
serviceLuxToDocPlanner.set("Konsultacja laryngologa", "laryngolog");
serviceLuxToDocPlanner.set("Konsultacja lekarza rodzinnego", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Konsultacja nefrologa", "nefrolog");
serviceLuxToDocPlanner.set("Konsultacja neurochirurga", "neurochirurg");
serviceLuxToDocPlanner.set("Konsultacja neurologa", "neurolog");
serviceLuxToDocPlanner.set("Konsultacja neurologa - dzieci", "neurolog dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja okulisty", "okulista");
serviceLuxToDocPlanner.set("Konsultacja okulisty - dzieci", "okulista dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja onkologa", "onkolog");
serviceLuxToDocPlanner.set("Konsultacja ortopedy", "ortopeda");
serviceLuxToDocPlanner.set("Konsultacja ortopedy - dzieci", "ortopeda dziecięcy");
serviceLuxToDocPlanner.set("Konsultacja pediatry - szczepienia dzieci do lat 6", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci chorych", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci zdrowych", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja pediatry - w gabinecie dzieci zdrowych - bilans", "pediatra");
serviceLuxToDocPlanner.set("Konsultacja proktologa", "proktolog");
serviceLuxToDocPlanner.set("Konsultacja pulmonologa", "pulmonolog");
serviceLuxToDocPlanner.set("Konsultacja reumatologa", "reumatolog");
serviceLuxToDocPlanner.set("Konsultacja urologa", "urologa");
serviceLuxToDocPlanner.set("Kwalifikacja - do szczepienia dorośli", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Kwalifikacja - do szczepienia dzieci powyżej 6 r.ż.", "lekarz rodzinny");
serviceLuxToDocPlanner.set("Umówienie wizyty na scaling (usuwanie złogów)", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u chirurga stomatologa", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u stomatologa", "stomatolog");
serviceLuxToDocPlanner.set("Umówienie wizyty u stomatologa dziecięcego", "stomatolog dziecięcy");

function isLuxMedPage() {
    const currentUrl = window.location.toString();
    return currentUrl.startsWith("https://portalpacjenta.luxmed.pl/PatientPortal/");
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
    // //*[@id="VisitBoxes"]/div[2]/div[2]/div[2]/h4
    const doctorNames = $("#userReservations > div.content > div.content.with-padding-top > div.item > div.description:not(.limit-width) > h4");
    const favour = $("#userReservations > div.content > div.content.with-padding-top > div.item > div.description ").map((i, e) => e.childNodes[3]);
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
    if (isLuxMedPage()) {
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
    } else if (isHereHealth()) {
        handleHereHealth();
    }
}

start();
