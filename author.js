import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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

async function loadBooks() {
    const container = document.getElementById("book-list");

    const q = query(collection(db, "knjige"), where("idAutora", "==", authorId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        const book = { id: doc.id, ...doc.data() };
        const card = createBookCard(book);
        container.appendChild(card);
        console.log("Book loaded: " + book.naziv);
    });
    
        console.log("aa");
}

function createBookCard(book) {
    const button = document.createElement("button");
    button.classList.add("book");
    button.onclick = () => goToBook(book.id);
    button.innerHTML = 
        `<img src="${book.slike[0]}" alt="Аутор" class="book-image">
        <div class="item-text-container">
            <p class="text">${book.naziv}</p>
        </div>`;

    return button;
}

loadAuthor();
loadBooks();