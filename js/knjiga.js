import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, addDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {showToast} from "./function.js";

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

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

async function fill(book) {
    document.getElementById("knjiga-naziv").textContent = book.naziv;
    document.getElementById("knjiga-autor").textContent = await getAutorIme(book.idAutora);
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
    await fill(data);
}

async function getAutorIme(idAutora) {
    const autorSnap = await getDoc(doc(db, "autori", idAutora));
    return autorSnap.exists() ? `${autorSnap.data().ime} ${autorSnap.data().prezime}`  : "Непознат аутор";
}

// load RECENZIJE

async function getKorisnikIme(idKorisnika) {
    const snap = await getDoc(doc(db, "korisnici", idKorisnika));
    return snap.exists() ? `${snap.data().ime} ${snap.data().prezime}` : idKorisnika;
}

async function loadRecenzije() {
    const lista = document.querySelector(".recenzije-lista");

    const q = query(collection(db, "recenzije"), where("idKnjige", "==", bookId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        lista.innerHTML = `<p class="text">Нема рецензија за ову књигу.</p>`;
        return;
    }

    for (const recDoc of snapshot.docs) {
        const r = recDoc.data();
        const imeKorisnika = await getKorisnikIme(r.idKorisnika);
        const item = document.createElement("div");
        item.classList.add("recenzija-item");
        item.innerHTML = `
            <div class="recenzija-header">
                <span class="recenzija-korisnik">${imeKorisnika}</span>
                <span class="recenzija-datum faded">${r.datum}</span>
            </div>
            <p class="recenzija-tekst">${r.tekst}</p>`;
        lista.appendChild(item);
    }
}

// pisi recenziju

async function getKorisnikID(username) {
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", username));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].id;
}

async function setupForma(event) {
    const username = sessionStorage.getItem("username");
    const forma = document.querySelector(".recenzija-forma");

    if (!username) {
        forma.innerHTML = `<p class="text">Морате бити пријављени да бисте написали рецензију.</p>`;
        return;
    }

    document.getElementById("posalji-button").addEventListener("click", async (e) => {
        e.preventDefault();
        const tekst = document.getElementById("recenzija-tekst").value.trim();
        if (!tekst) 
            return showToast("Текст рецензије не може бити празан.");

        const idKorisnika = await getKorisnikID(username);
        const now = new Date();
        const dns = `${now.getFullYear()}-${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        await addDoc(collection(db, "recenzije"), {
            idKnjige: bookId,
            idKorisnika: idKorisnika,
            tekst: tekst,
            datum: dns
        });
        document.getElementById("recenzija-tekst").value = "";
        document.querySelector(".recenzije-lista").innerHTML = "";
        showToast("Рецензија је успешно додата.");
        await loadRecenzije();
    });
}


loadBook();
loadRecenzije();
setupForma();