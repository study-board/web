
import config from './config.js';

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
} 

const cardsContainer = document.getElementById(config.cardsContainerId);
const urlInput = document.getElementById("new-card-url");
const titleInput = document.getElementById("new-card-title");
const cardsList = document.getElementById(config.cardsListId);
const urlparams = new URLSearchParams(location.search);

window.loadCards = function (cards) {

    cards.forEach((c) => {

        if (c.preloaded) {return;}

        let url = c.url;
        let id = c.id;

        let newCard = document.createElement("div");
        newCard.classList.add("card"); newCard.classList.add("draggable");

        let newClickable = document.createElement("div");
        newClickable.classList.add("clickable");

        let newFrame = document.createElement("iframe");
        newFrame.src = url;

        newCard.appendChild(newClickable);
        newCard.appendChild(newFrame);

        newCard.id = id;

        cardsContainer.appendChild(newCard);
    });

}

let cards;

window.addNewCard = function () {

    let url = urlInput.value;
    let title = titleInput.value;
    let id = "card-" + makeid(8);

    let newCardObj = {
        name: title,
        id: id,
        removable: true,
        url: url,
        preloaded: false
    };

    if (cards.map((e) => e.url).includes(url)) {
        return alert("This card is already present.");
    }

    let newCard = document.createElement("div");
    newCard.classList.add("card"); newCard.classList.add("draggable");

    let newClickable = document.createElement("div");
    newClickable.classList.add("clickable");

    let newFrame = document.createElement("iframe");
    newFrame.src = url;

    newCard.appendChild(newClickable);
    newCard.appendChild(newFrame);

    newCard.id = id;

    cardsContainer.appendChild(newCard);
    cards.push(newCardObj);

    updateCardsList();

}

window.updateCardsList = () => {

    cardsList.innerHTML = "";

    cards.forEach((e) => {

        let el = document.createElement("li");
        el.innerText = `"${e.name}" `

        if (e.removable) {
            let removeLink = document.createElement("a");
            removeLink.innerText = "Remove"
            removeLink.href = "#";

            removeLink.onclick = (a) => {
                a.preventDefault();
                document.getElementById(e.id).remove();
                cards = cards.filter((c) => c !== e);
                updateCardsList();
            }

            el.appendChild(removeLink);
        }

        cardsList.appendChild(el);

    });

    cards.filter(e => !e.preloaded).length>0 && history.pushState({
        cards: cards
    }, "", "?cards=" + btoa(JSON.stringify(cards.filter(e => !e.preloaded))));

}

if (urlparams.get("cards")) {

    cards = JSON.parse(atob(urlparams.get("cards")));
    if (cards.length > 5) {
        if (confirm(`The link you followed has ${cards.length} cards. This amount could slow down or crash your computer while they load. Continue?`)) {
            loadCards(cards);
            updateCardsList();
        } else {
            window.location.replace("//" + window.host);
        }
    } else {
        loadCards(cards);
        updateCardsList();
    }

} else {
    cards = [{

        name: "Controls",
        id: "card-controls",
        removable: false,
        url: "#",
        preloaded: true
    
    }];
    updateCardsList();
}


window.share = function () {

    navigator.share({
        url: document.location.href,
        text: "Check out my study board with " + cards.length + " cards!",
        title: "Studyboard with " + cards.length + " cards"
    })

}