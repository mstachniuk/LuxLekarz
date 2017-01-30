// Help fuctions for handling info about doctor in format "title name=service"

function createDoctor(name, service) {
    return name + "=" + service;
}

function getDoctorName(doctor) {
    return doctor.substring(0, doctor.indexOf("="));
}

function getDoctorNameWithoutTitle(doctor) {
    return getDoctorName(doctor)
        .replace("dr n. med. ", "")
        .replace("dr n.med. ", "")
        .replace("dr hab. n. med ", "")
        .replace("lek. med. ", "")
        .replace("lek. stom. ", "");
}

function getDoctorService(doctor) {
    return doctor.substring(doctor.indexOf("=") + 1, doctor.length);
}


/**
 * Generate string needed by DocPlanner search engine, e.x.: query=chirurg%20STANISZEWSKI%20ANDRZEJ&hitsPerPage=4
 * @param doctor string in format: "title name=service"
 */
function getSearchParamForDoctor(doctor) {
    var doctorService = serviceLuxToDocPlanner.get(getDoctorService(doctor));
    var text = "query=" + doctorService + " " + getDoctorNameWithoutTitle(doctor) + "&hitsPerPage=4";
    return text.replace(/ /g, "%20");
}

var serviceLuxToDocPlanner = new Map();
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
