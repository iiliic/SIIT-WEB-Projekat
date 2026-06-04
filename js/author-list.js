import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDocs, doc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {goToAuthor} from "./function.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuqF5p1WuNUP4WJ5PspU7tl_1N4mrIyAU",
    authDomain: "siit-ilija-i-vule.firebaseapp.com",
    projectId: "siit-ilija-i-vule",
    storageBucket: "siit-ilija-i-vule.firebasestorage.app",
    messagingSenderId: "561148505182",
    appId: "1:561148505182:web:d39761a1be9f767d68d8cf",
    measurementId: "G-L1TXJPJY6Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function loadAuthors() {
    const container = document.getElementById("authors-container");

    const snapshot = await getDocs(collection(db, "autori"));
    snapshot.forEach((doc) => {
        const author = { id: doc.id, ...doc.data() };
        const card = createAuthorCard(author);
        container.appendChild(card);
    });
}

function createAuthorCard(author) {
    const button = document.createElement("button");
    button.classList.add("item");
    button.onclick = () => goToAuthor(author.id);
    button.innerHTML = 
        `<div class="item-image-container">
            <img src="${author.slike[0]}" alt="Аутор" class="item-image">
        </div>

        <div class="item-text-container">

            <div class="item-top-text">

                <div class="item-element">
                    <p class="text big">${author.ime} ${author.prezime}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Датум рођења:</p>
                    <p class="text">${author.datumRodjenja}</p>
                </div>

                <div class="item-element">
                    <p class="text">${author.status}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Продато:</p>
                    <p class="text">${author.brojProdatihPrimeraka}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Награде:</p>
                    <p class="text">${author.brojOsvojenihNagrada}</p>
                </div>

            </div>

            <div class="item-description-text">
                <p class="text faded">${author.biografija}</p>
            </div>

        </div>`;

    return button;
}

loadAuthors();