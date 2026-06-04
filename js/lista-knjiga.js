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

async function loadBooks() {
    const container = document.getElementById("books-container");

    const snapshot = await getDocs(collection(db, "knjige"));

    for (const bookDoc of snapshot.docs) {
        const book = { id: bookDoc.id, ...bookDoc.data() };
        book.imeAutora = await getAutorIme(book.idAutora);
        const card = createBookCard(book);
        container.appendChild(card);
}
}

function createBookCard(book) {
    const button = document.createElement("button");
    button.classList.add("book-item");
    button.onclick = () => goToBook(book.id);
    button.innerHTML = 
        `<img src="${book.slike[0]}" alt="knjiga" class="book-image">
        <h3 class="name">${book.naziv}</h3>
        <p class="name">${book.imeAutora}</p>
        <p>${book.zanr} - ${book.format}</p>
        <p>Cena: ${book.cena} RSD</p>
        `;

    return button;
}

async function getAutorIme(idAutora) {
    const autorSnap = await getDoc(doc(db, "autori", idAutora));
    return autorSnap.exists() ? `${autorSnap.data().ime} ${autorSnap.data().prezime}`  : "Nepoznat autor";
}

loadBooks();