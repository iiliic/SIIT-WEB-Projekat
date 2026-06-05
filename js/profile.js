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

function fill(user){
    document.getElementById("korisnickoIme").textContent = user.korisnickoIme;
    document.getElementById("ime").textContent = user.ime + " " + user.prezime;
    document.getElementById("email").textContent = user.email;
    document.getElementById("datumRodjenja").textContent = user.datumRodjenja;
    document.getElementById("adresa").textContent = user.adresa;
    document.getElementById("zanimanje").textContent = user.zanimanje;
}

async function loadProfile() {
    const username= sessionStorage.getItem("username");
    if (!username) {
        return;
    }
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", username));
    const snapshot = await getDocs(q);
    const korisnik = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    fill(korisnik);
    loadRatings(korisnik);
    //TODO: ilija dodaj reviews.
}

async function loadRatings(korisnik) {
    const q=query(collection(db, "ocene"), where("idKorisnika", "==", korisnik.id));
    const snapshot = await getDocs(q);
    const ratingContainer = document.getElementById("rating-container");
    for (const ratingDoc of snapshot.docs) {

        const rating = { id: ratingDoc.id, ...ratingDoc.data() };

        const authorRef = doc(db, "autori", rating.idAutora);
        const authorSnap = await getDoc(authorRef);
        const author = authorSnap.data();

        const ratingCard = createRatingCard(rating,author);
        ratingContainer.appendChild(ratingCard);
        
        document.querySelector(`#stars-${rating.id} input[value="${rating.vrednost}"]`).checked = true;
    }
}

function createRatingCard(rating,author) {
    const ratingCard = document.createElement("div");
    ratingCard.classList.add("rating");
    ratingCard.innerHTML = `
            <div class="rated">
                <a class="nav-link big" href="author.html?id=${rating.idAutora}">${author.ime} ${author.prezime}</a> <p class="text faded"> ${rating.datum}</p>
            </div>
            <div class="stars" id="stars-${rating.id}">
                <input type="radio" value="5" disabled>
                <label for="star5">★</label>

                <input type="radio" value="4" disabled>
                <label for="star4">★</label>

                <input type="radio" value="3" disabled>
                <label for="star3">★</label>

                <input type="radio" value="2" disabled>
                <label for="star2">★</label>

                <input type="radio" value="1" disabled>
                <label for="star1">★</label>
            </div>`;
    return ratingCard;
}

loadProfile();