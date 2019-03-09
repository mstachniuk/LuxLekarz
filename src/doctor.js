let cache = {};

class Doctor {
    constructor(nameDiv, service, city) {
        this.nameDiv = nameDiv;
        this.service = serviceLuxToDocPlanner.get(service);
        this.city = city;
    }

    get name() {
        return this.nameDiv.textContent.trim();
    }

    load() {
        if (!this.name) // ignore when empty name
            return;
        this.makeRequest().done(data => {
            if (data.hits.length > 0) {
                const numberOfStars = parseFloat(data.hits[0].stars);
                const url = data.hits[0].url.replace("http://", "https://");
                console.log("Odczytano " + numberOfStars + " gwiazdki dla: " + this.name);
                this.addInformation(generateInformation(numberOfStars, url,
                    'Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.'));
            } else {
                console.log("Nie znaleziono strony dla: " + this.name);
                this.addInformation(generateInformation(0, 'https://www.znanylekarz.pl/',
                    'Brak strony o danym lekarzu w serwisie znanylekarz.pl Kliknij, aby przejść do tej strony i spróbuj wyszukać lekarza ręcznie.'));
            }
        });
    }

    /**
     * Generate string needed by DocPlanner search engine, e.x.: query=chirurg%20STANISZEWSKI%20ANDRZEJ&hitsPerPage=4
     * string in format: "title name=service"
     */
    searchParams() {
        let text = "query=";
        text += this.service ? (this.service + " ") : "";
        text += this.city ? (this.city + " ") : "";
        text += getDoctorNameWithoutTitle(this.name) + "&hitsPerPage=4";
        return text.replace(/ /g, "%20");
    }

    makeRequest() {
        const params = this.searchParams();
        const args = {
            params: params,
            apiKey: "90a529da12d7e81ae6c1fae029ed6c8f",
            appID: "docplanner"
        };
        if (cache[params] == null) { // if exist on cache
            cache[params] = $.post("https://docplanner-3.algolia.io/1/indexes/pl_autocomplete_doctor/query",
                JSON.stringify(args));
        }
        return cache[params];
    }

    addInformation(info) {
        const msg = "&nbsp;&nbsp;" + info;
        switch (this.nameDiv.nodeType) {
            case Node.ELEMENT_NODE:
                $(this.nameDiv).append(msg);
                break;
            case Node.TEXT_NODE:
                $(this.nameDiv).after(msg);
                break;
        }
    }
}

function getDoctorNameWithoutTitle(name) {
    return name
        .replace("dr n. med. ", "")
        .replace("dr n.med. ", "")
        .replace("dr hab. n. med ", "")
        .replace("lek. med. ", "")
        .replace("lek. stom. ", "");
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
