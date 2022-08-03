const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
translateBtn = document.querySelector("button"),
exchangeIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");



selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        //Selecionando inglês como padrão from e português padrão to

        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "pt-PT" ? "selected" : "";

        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;

        tag.insertAdjacentHTML("beforeend", option);// Adicionando opções da tag no campo seletor
    }
});


exchangeIcon.addEventListener("click",() => {
    //trocando textarea e selecionando tag valores
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;

});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,//pegando fromSelect value
    translateTo = selectTag[1].value;//pegando o toSelect value
    if(!text) return;


    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;


    fetch(apiUrl).then(res => res.json()).then(data => {//fetch api response e retornando um json
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});



icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            //se clicar no icone e tiver from, copiar do fromTextArea, se não copiar do toTextArea
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            //se clicar no icone e tiver from id, falar o fromTextArea, se não o toTextArea
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);//setando o enunciado da linguagem do fromSelect tag value
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);//setando o enunciado da linguagem do toSelect tag value
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);//falar o enunciado passado
        }
    });
});