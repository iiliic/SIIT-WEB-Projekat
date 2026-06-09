import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDocs, doc, getDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {goToBook} from "./function.js";

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
const db = getFirestore(app);

let sveKnjige = [];

async function loadBooks() {
    const container = document.getElementById("books-container");

    const snapshot = await getDocs(collection(db, "knjige"));

    for (const bookDoc of snapshot.docs) {
        const book = { id: bookDoc.id, ...bookDoc.data() };
        sveKnjige.push(book); // dodavanje 
        const card = createBookCard(book);
        container.appendChild(card);
}
}

function createBookCard(book, pretraga = "") {
    const button = document.createElement("button");
    button.classList.add("book-item");
    button.onclick = () => goToBook(book.id);
    button.innerHTML = 
        `<img src="${book.slike[0]}" alt="knjiga" class="book-image">
        <h3 class="name">${highlight(book.naziv, pretraga)}</h3>
        <p>${book.zanr} - ${book.format}</p>
        <p>Cena: ${book.cena} RSD</p>
        `;

    return button;
}

function filtriraj() {
    const search = document.getElementById("pretraga").value.trim().toLowerCase();

    const selectedZanr = [...document.querySelectorAll('#zanr-dropdown input:checked')].map(cb => cb.value);

    const container = document.getElementById("books-container");
    container.innerHTML = "";

    const filtriraneKnjige = sveKnjige.filter(book => {
        const nazivMatch = book.naziv.toLowerCase().includes(search);
        const zanrMatch = selectedZanr.length === 0 || selectedZanr.includes(book.zanr);
        return nazivMatch && zanrMatch;
    });

    filtriraneKnjige.forEach(book => {
        const card = createBookCard(book, search);
        container.appendChild(card);
    });
}

document.getElementById("pretraga").addEventListener("keyup", filtriraj);
document.querySelectorAll('#zanr-dropdown input').forEach(cb => cb.addEventListener("change", filtriraj));

function highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`   , 'gi');           // g da ne bi stalo posle prvog, a i je ignore za velika/mala slova
    return text.replace(regex, '<span class="marked">$1</span>'); 
}

loadBooks();