import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, deleteDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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


function handleClick(event) {
  	var clickedItem = event.currentTarget;
  	removeSelection();
  	clickedItem.classList.add("selected");
    console.log("Selected author ID:", clickedItem.querySelector(".item-element p").textContent);
}

function removeSelection() {
    document.querySelectorAll(".item").forEach(item => {
        item.classList.remove("selected");
    });
}

async function loadAuthors() {
    const container = document.getElementById("container");
    const snapshot = await getDocs(collection(db, "autori"));
    snapshot.forEach((doc) => {
        const author = { id: doc.id, ...doc.data() };
        const card = createRow(author);
        container.appendChild(card);
    });
}

function createRow(author) {
    const button = document.createElement("button");
    button.classList.add("item");
    button.addEventListener("click", handleClick);
    button.innerHTML = 
        `<div class="item-element">
            <p class="text">${author.id}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.ime}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.prezime}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.datumRodjenja}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.status}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.brojOsvojenihNagrada}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.brojProdatihPrimeraka}</p>
        </div>
        <div class="item-element">
            <p class="text">${author.kontaktTelefonMenadzera}</p>
        </div>`;
    
    return button;
}

function search() {
    const query = document.getElementById("pretraga").value.trim().toLowerCase();
    document.querySelectorAll(".item").forEach(item => {
        const naziv = item.querySelector(".item-element:nth-child(2) p").textContent.toLowerCase();
        item.style.display = naziv.includes(query) ? "flex" : "none";
    });
}

function addDelete(){
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.id = "deletePopup";
     popup.innerHTML =
    `<div class="popup-content-position">
            <div class="popup-content">
                <p class="text big">Да ли сте сигурни да желите да избришете овог аутора?</p>
                <div class="popup-button-container">
                    <button type="submit" class="button-style" id="confirmDelete">Да</button>
                    <button type="submit" class="button-style" id="cancelDelete">Не</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(popup);
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");

    confirmDelete.onclick = deleteAuthor;
    cancelDelete.onclick = () => {
        const deletePopup = document.getElementById("deletePopup");
        deletePopup.classList.remove("show");
    }
}

async function deleteAuthor() {
    const selected = document.querySelector(".item.selected");
    if (!selected) {
        alert("Молимо изаберите аутора за брисање.");
        return;
    }
    const authorId = selected.querySelector(".item-element:nth-child(1) p").textContent;
    await deleteDoc(doc(db, "autori", authorId));
    const q=query(collection(db, "ocene"), where("idAutora", "==", authorId));
    const snapshot = await getDocs(q);
    console.log(snapshot);
    for (const snap of snapshot.docs){
        await deleteDoc(doc(db, "ocene", snap.id));
    }
    selected.remove();
    deletePopup.classList.remove("show");
}

function main(){
    addDelete();
    const deletePopup = document.getElementById("deletePopup");
    const openDelete = document.getElementById("openDelete");
    const openEdit = document.getElementById("openEdit");
    const openAdd = document.getElementById("openAdd");

    openDelete.onclick = () => {deletePopup.classList.add("show")};
    openEdit.onclick = () => {};
    openAdd.onclick = () => {};
}

await loadAuthors();
main();
document.getElementById("pretraga").addEventListener("keyup", search);