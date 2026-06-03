import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const authorId = params.get("id");

function fill(author) {
    document.getElementById("ime").textContent = author.ime + " " + author.prezime;
    document.getElementById("biografija").textContent = author.biografija;
    document.getElementById("datumRodjenja").textContent = author.datumRodjenja;
    document.getElementById("status").textContent = author.status;
    document.getElementById("napisano").textContent = author.brojProdatihPrimeraka;
    document.getElementById("nagrade").textContent = author.brojOsvojenihNagrada;
    document.getElementById("slika").src = author.slike[0];
}

async function loadAuthor() {
    const docRef = doc(db, "autori", authorId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    fill(data);
}

loadAuthor();