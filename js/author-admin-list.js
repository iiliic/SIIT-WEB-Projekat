import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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


function handleClick(event) {
  	var clickedItem = event.currentTarget;

  	removeSelection();

  	clickedItem.classList.add("selected");
}

function removeSelection() {
    document.querySelectorAll(".item").forEach(item => {
        item.classList.remove("selected");
    });
}


async function loadAuthors() {
    const container = document.getElementById("container");
    const snapshot = await getDocs(collection(db, "autori"));
    snapshot.forEach((doc) => {
        const author = { id: doc.id, ...doc.data() };
        const card = createRow(author);
        container.appendChild(card);
    });
}

function createRow(author) {
    const button = document.createElement("button");
    button.classList.add("item");
    button.addEventListener("click", handleClick);
    // button.onclick = () => goToBook(book.id);
    button.innerHTML = 
        `<div class="item-element">
            <p class="text">${author.id}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.ime}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.prezime}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.datumRodjenja}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.status}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.brojOsvojenihNagrada}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.brojProdatihPrimeraka}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.kontaktTelefonMenadzera}</p>
        </div>`;
    
    return button;
}

loadAuthors();