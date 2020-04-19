function isHereHealth() {
    const currentUrl = window.location.toString();
    return currentUrl.startsWith("https://pu.tuzdrowie.pl/pu-www/");
}

function handleHereHealth() {
    if (isSearchResultPage()) {
        const cityFromHeader = $("header.content-header > div.float--right > form > input[type=hidden]")
        if (cityFromHeader.length !== 0) {
            let serviceName = JSON.parse(cityFromHeader[0].value).service.name;
            let cleanServiceName = serviceName.replace(/konsultacja (lekarska|profesorska)/gi, "")
                .replace(/dziecięcy/gi, "")
                .replace(/dziecięca/gi, "")
                .replace(/- konsultacja przed szczepieniami ochronnymi/gi, "")
                .trim();
            let cityName = JSON.parse(cityFromHeader[0].value).city.name.replace(/Powiat m.\s*/g, "").trim();
            const doctorNames = $("dd.realizator");
            for (let i = 0; i < doctorNames.length; i++) {
                let doctorName = doctorNames[i].innerText
                    .replace(/\n/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
                let doctor = new Doctor(doctorName, cleanServiceName, cityName);
                doctor.load(addInformationToDiv(doctorNames[i]));
            }
        }
    }
}

function isSearchResultPage() {
    const currentUrl = window.location.toString();
    return currentUrl.startsWith("https://pu.tuzdrowie.pl/pu-www/portal/wynikiWyszukiwania");
}

