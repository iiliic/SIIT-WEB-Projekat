import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDocs, doc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {goToAuthor} from "./function.js";

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

async function loadAuthors() {
    const container = document.getElementById("authors-container");

    const snapshot = await getDocs(collection(db, "autori"));
    snapshot.forEach((doc) => {
        const author = { id: doc.id, ...doc.data() };
        const card = createAuthorCard(author);
        container.appendChild(card);
    });
    document.querySelectorAll(".item").forEach(item => {
            const naziv = item.querySelector(".item-element p");
            naziv.dataset.original = naziv.textContent;
    });
}

function createAuthorCard(author) {
    const button = document.createElement("button");
    button.classList.add("item");
    button.onclick = () => goToAuthor(author.id);
    button.innerHTML = 
        `<div class="item-image-container">
            <img src="${author.slike[0]}" alt="Аутор" class="item-image">
        </div>

        <div class="item-text-container">

            <div class="item-top-text">

                <div class="item-element">
                    <p class="text big">${author.ime} ${author.prezime}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Рођен:</p>
                    <p class="text">${author.datumRodjenja}</p>
                </div>

                <div class="item-element">
                    <p class="text">${author.status}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Продато:</p>
                    <p class="text">${author.brojProdatihPrimeraka}</p>
                </div>

                <div class="item-element stacked">
                    <p class="text">Награде:</p>
                    <p class="text">${author.brojOsvojenihNagrada}</p>
                </div>

            </div>

            <div class="item-description-text">
                <p class="text faded">${author.biografija}</p>
            </div>

        </div>`;

    return button;
}

function search() {
    const query = document.getElementById("pretraga").value.trim().toLowerCase();
    let checkedValues=[];
    const checked = document.querySelectorAll("input[name='status']:checked");
    for (const check of checked) {
        checkedValues.push(check.value);
    }
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    if(query ==="" && checkedValues.length===0){
        document.querySelectorAll(".item").forEach(item => {
            const naziv = item.querySelector(".item-element p");
            const original = naziv.dataset.original;
            naziv.innerHTML = original;
            item.style.display = "flex";
            return;
        });
    }
    if(checkedValues.length === 0){
        document.querySelectorAll(".item").forEach(item => {
            const naziv = item.querySelector(".item-element p");
            const original = naziv.dataset.original;
            //if (!query) {
            //    naziv.innerHTML = original;
            //    item.style.display = "flex";
            //    return;
            //}
            naziv.innerHTML = original.replace(regex, '<span class="big marked">$1</span>');
            item.style.display = naziv.dataset.original.toLowerCase().includes(query.toLowerCase()) ? "flex" : "none";
        });
        return
    }
    if(query === ""){
        document.querySelectorAll(".item").forEach(item => {
            const naziv = item.querySelector(".item-element p");
            const original = naziv.dataset.original;
            naziv.innerHTML = original;
            item.style.display = "flex";
            const status = item.querySelector(".item-element:nth-child(3) p").textContent;
            item.style.display = checkedValues.includes(status) ? "flex" : "none";
        });
        return;
    }
    document.querySelectorAll(".item").forEach(item => {
        const status = item.querySelector(".item-element:nth-child(3) p").textContent;
        const naziv = item.querySelector(".item-element p");
        const original = naziv.dataset.original;
        console.log(original);
        naziv.dataset.original=original;
        naziv.innerHTML = original.replace(regex, '<span class="big marked">$1</span>');
        const matchesStatus = checkedValues.includes(status);
        const matchesQuery = naziv.dataset.original.toLowerCase().includes(query.toLowerCase());

        item.style.display = (matchesStatus && matchesQuery) ? "flex" : "none";
    });
}

loadAuthors();
document.getElementById("pretraga").addEventListener("input", search);
const status = document.querySelectorAll("input[name='status']");
for (const check of status) {
    check.addEventListener("change", search);
}