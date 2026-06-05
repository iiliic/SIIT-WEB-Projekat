import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, updateDoc, addDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
const username= sessionStorage.getItem("username");
let selectedRating = 0;

function startSlideshow(images) {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");

    // Preload images
    images.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    if (images.length === 1) {
        img1.src = images[0];
        img1.style.opacity = 1;
        img2.style.opacity = 0;
        return;
    }

    let currentIndex = 0;
    let showingFirst = true;

    
    img1.src = images[0];
    img2.src = images[1];

    img1.style.opacity = 1;
    img2.style.opacity = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;

        if (showingFirst) {
            img2.src = images[currentIndex];
            img2.style.opacity = 1;
            img1.style.opacity = 0;
        } else {
            img1.src = images[currentIndex];
            img1.style.opacity = 1;
            img2.style.opacity = 0;
        }

        showingFirst = !showingFirst;
    }, 5000);
}

function fill(author) {
    document.getElementById("ime").textContent = author.ime + " " + author.prezime;
    document.getElementById("biografija").textContent = author.biografija;
    document.getElementById("datumRodjenja").textContent = author.datumRodjenja;
    document.getElementById("status").textContent = author.status;
    document.getElementById("napisano").textContent = author.brojProdatihPrimeraka;
    document.getElementById("nagrade").textContent = author.brojOsvojenihNagrada;
    startSlideshow(author.slike);
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
    });
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

async function ratingAvg() {
    const q = query(collection(db, "ocene"), where("idAutora", "==", authorId));
    const snapshot = await getDocs(q);
    let sum = 0;
    snapshot.forEach((doc) => {
        const rating = doc.data();
        sum += rating.vrednost;
    });
    let avg = sum / snapshot.size;
    console.log(avg);
    document.getElementById("rating-avg").textContent = String(avg.toFixed(1));
}

async function ratingLogic(){
    const stars = document.querySelectorAll("input[name='rating']");
    for (const star of stars) {
        star.addEventListener("change", updateRating);
    }
    if (!username) {
        disableRating();
        return;
    }
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", username));
    const snapshot = await getDocs(q);
    const korisnik = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    const q2 = query(collection(db, "ocene"), where("idKorisnika", "==", korisnik.id), where("idAutora", "==", authorId));
    const snapshot2 = await getDocs(q2);
    if (snapshot2.empty) {
        console.log("Selected rating:", selectedRating);
        return;
    }
    const rating = { id: snapshot2.docs[0].id, ...snapshot2.docs[0].data() };
    const selected= document.getElementById(`${rating.vrednost}`);
    selected.checked = true;
    selectedRating = rating.vrednost;
    console.log("Selected rating:", selectedRating);

}

async function updateRating(e) {
    selectedRating = parseInt(e.target.value);
    console.log("Selected rating:", selectedRating);
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", username));
    const snapshot = await getDocs(q);
    const userId = snapshot.docs[0].id;
    const q2 = query(collection(db, "ocene"), where("idKorisnika", "==", userId), where("idAutora", "==", authorId));
    const snapshot2 = await getDocs(q2);
    if (snapshot2.empty) {
        await addDoc(collection(db, "ocene"), {idKorisnika: userId, idAutora: authorId, vrednost: selectedRating, datum: date});
        console.log("Added rating:", selectedRating);
    } 
    else {
    const docRef = snapshot2.docs[0].ref;
    await updateDoc(docRef, {vrednost: selectedRating, datum: date});
    console.log("Updated rating:", selectedRating);
}
}

function disableRating() {
    const stars = document.querySelectorAll(".stars input");
    for (const star of stars) {
        star.disabled = true;
        console.log("disabled");
    }
}

loadAuthor();
loadBooks();
ratingAvg();
ratingLogic();