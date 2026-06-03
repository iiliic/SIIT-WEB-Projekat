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
    console.log("username: ", username);
    if (!username) {
        return;
    }
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", username));
    const snapshot = await getDocs(q);
    fill(snapshot.docs[0].data());
}

loadProfile();