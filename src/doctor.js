let cache = {};

class Doctor {
    constructor(name, service, city) {
        this.name = name;
        this.service = service;
        this.city = city;
    }

    load(onSuccessCallback) {
        if (!this.name) // ignore when empty name
            return;
        this.makeRequest().done(data => {
            if (data.hits.length > 0) {
                const numberOfStars = parseFloat(data.hits[0].stars);
                const opinionCount = parseFloat(data.hits[0].opinionCount)
                const url = data.hits[0].url.replace("http://", "https://");
                console.debug("Odczytano " + numberOfStars + " gwiazdki dla: " + this.name);
                onSuccessCallback(numberOfStars, opinionCount, url,
                    'Przejdź do strony znanylekarz.pl, aby zobaczyć wszystkie opinie.');
            } else {
                console.debug("Nie znaleziono strony dla: " + this.name);
                onSuccessCallback(0, 0,  'https://www.znanylekarz.pl/',
                    'Brak strony o danym lekarzu w serwisie znanylekarz.pl Kliknij, aby przejść do ' +
                    'tej strony i spróbuj wyszukać lekarza ręcznie.');
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
}

function getDoctorNameWithoutTitle(name) {
    return name
        .replace("dr n. med. ", "")
        .replace("dr n.med. ", "")
        .replace("dr hab. n. med ", "")
        .replace("lek. med. ", "")
        .replace("lek. stom. ", "");
}

