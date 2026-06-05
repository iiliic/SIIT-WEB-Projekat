import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// ---- SELEKCIJA REDA ----
function handleClick(event) {
    const clickedRow = event.currentTarget;
    removeSelection();
    clickedRow.classList.add("selected");
}

function removeSelection() {
    document.querySelectorAll(".table-row").forEach(row => {
        row.classList.remove("selected");
    });
}

// ---- UCITAVANJE KNJIGA IZ FIREBASE ----
async function loadKnjige() {
    const container = document.getElementById("tableBody");
    const snapshot = await getDocs(collection(db, "knjige"));
    snapshot.forEach((doc) => {
        const knjiga = { id: doc.id, ...doc.data() };
        const row = createRow(knjiga);
        container.appendChild(row);
    });
}

function createRow(knjiga) {
    const row = document.createElement("div");
    row.classList.add("table-row");
    row.addEventListener("click", handleClick);
    row.innerHTML =
        `<div class="table-element"><p class="text">${knjiga.naziv}</p></div>
        <div class="table-element"><p class="text">${knjiga.zanr}</p></div>
        <div class="table-element"><p class="text">${knjiga.format}</p></div>
        <div class="table-element"><p class="text">${knjiga.cena} RSD</p></div>
        <div class="table-element"><p class="text">${knjiga.brojStrana}</p></div>
        <div class="table-element"><p class="text">${knjiga.idAutora}</p></div>
        <div class="table-element"><p class="text">${knjiga.isbn}</p></div>`;
    return row;
}

// ---- PRETRAGA ----
function pretraziKnjige() {
    const query = document.getElementById("pretraga").value.trim().toLowerCase();
    document.querySelectorAll(".table-row").forEach(row => {
        const naziv = row.querySelector(".table-element p").textContent.toLowerCase();
        row.style.display = naziv.includes(query) ? "grid" : "none";
    });
}

document.getElementById("pretraga").addEventListener("keyup", pretraziKnjige);


loadKnjige();