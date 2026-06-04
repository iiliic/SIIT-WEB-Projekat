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

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

function fill(book) {
    document.getElementById("knjiga-naziv").textContent = book.naziv;
    document.getElementById("knjiga-autor").textContent = book.idAutora;
    document.getElementById("knjiga-autor").href = `author.html?id=${book.idAutora}`;
    document.getElementById("knjiga-zanr").textContent = book.zanr;
    document.getElementById("knjiga-format").textContent = book.format;
    document.getElementById("knjiga-br-strana").textContent = book.brojStrana;
    document.getElementById("knjiga-isbn").textContent = book.isbn;
    document.getElementById("knjiga-cena").textContent = book.cena + " RSD";
    document.getElementById("knjiga-opis").textContent = book.opis;
    document.getElementById("knjiga-slika").src = book.slike[0];
}

async function loadBook() {
    const docRef = doc(db, "knjige", bookId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    fill(data);
}


loadBook();