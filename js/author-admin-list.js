import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, deleteDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
    popup.classList.add("delete");
    popup.id = "deletePopup";
     popup.innerHTML =
    `<div class="popup-content-position">
            <div class="popup-content">
                <p class="text big">Да ли сте сигурни да желите да избришете овог аутора?</p>
                <div class="popup-button-container">
                    <button class="button-style" id="confirmDelete">Да</button>
                    <button class="button-style" id="cancelDelete">Не</button>
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

function addAdd(){
    const popup = document.createElement("div");
    popup.classList.add("add");
    popup.id = "addPopup";
    popup.innerHTML =
    `<div class="popup-content-position">
            <div class="popup-header">
                <p class="text huge">Додавање Аутора</p>
                <button id="cancelAdd" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="addForm">
                <div class="inline">
                    <div class="label-above-input">
                        <label for="ime" class="text">Име:</label>
                        <input type="text" id="ime" name="ime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prezime" class="text">Презиме:</label>
                        <input type="text" id="prezime" name="prezime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="status" class="text">Статус:</label>
                        <input type="text" id="status" name="status" class="input-style">
                    </div>
                </div><br>
                <div class="inline">
                    <div class="label-above-input">
                        <label for="datum" class="text">Датум Рођења:</label>
                        <input type="text" id="datum" name="datum" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="nagrade" class="text">Број Освојених Награда:</label>
                        <input type="number" id="nagrade" name="nagrade" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prodato" class="text">Број Продатих Књига:</label>
                        <input type="number" id="prodato" name="prodato" class="input-style">
                    </div>
                </div><br>
                <div class="label-above-input">
                    <label for="menadzer" class="text">Број Менаџера:</label>
                    <input type="text" id="menadzer" name="menadzer" class="input-style">
                </div><br>
                <div class="label-above-input">
                    <label for="biografija" class="text">Биографија:</label>
                    <textarea rows="3" id="biografija" name="biografija" class="input-style"></textarea>
                </div><br>
                <div class="label-above-input">
                    <label for="slike" class="text">Слике: <span class="text faded">(Следећи ред за унос друге слике)</span></label>
                    <textarea rows="3" id="slike" name="slike" class="input-style"></textarea>
                </div>
                <div class="popup-button-container">
                    <button class="button-style" id="confirmAdd">Пријави се</button>
                </div>
            </form>
            </div>
        </div>`;
    document.body.appendChild(popup);
    const confirmAdd = document.getElementById("confirmAdd");
    const cancelAdd = document.getElementById("cancelAdd");

    confirmAdd.onclick = addAuthor;
    cancelAdd.onclick = () => {
        const addPopup = document.getElementById("addPopup");
        addPopup.classList.remove("show");
    }
}

function addEdit(){
    const popup = document.createElement("div");
    popup.classList.add("edit");
    popup.id = "editPopup";
    popup.innerHTML =
    `<div class="popup-content-position">
            <div class="popup-header">
                <p class="text huge">Измена Аутора</p>
                <button id="cancelEdit" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="editForm">
                <div class="inline">
                    <div class="label-above-input">
                        <label for="ime" class="text">Име:</label>
                        <input type="text" id="ime" name="ime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prezime" class="text">Презиме:</label>
                        <input type="text" id="prezime" name="prezime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="status" class="text">Статус:</label>
                        <input type="text" id="status" name="status" class="input-style">
                    </div>
                </div><br>
                <div class="inline">
                    <div class="label-above-input">
                        <label for="datum" class="text">Датум Рођења:</label>
                        <input type="text" id="datum" name="datum" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="nagrade" class="text">Број Освојених Награда:</label>
                        <input type="number" id="nagrade" name="nagrade" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prodato" class="text">Број Продатих Књига:</label>
                        <input type="number" id="prodato" name="prodato" class="input-style">
                    </div>
                </div><br>
                <div class="label-above-input">
                    <label for="menadzer" class="text">Број Менаџера:</label>
                    <input type="text" id="menadzer" name="menadzer" class="input-style">
                </div><br>
                <div class="label-above-input">
                    <label for="biografija" class="text">Биографија:</label>
                    <textarea rows="3" id="biografija" name="biografija" class="input-style"></textarea>
                </div><br>
                <div class="label-above-input">
                    <label for="slike" class="text">Слике: <span class="text faded">(Следећи ред за унос друге слике)</span></label>
                    <textarea rows="3" id="slike" name="slike" class="input-style"></textarea>
                </div>
                <div class="popup-button-container">
                    <button class="button-style" id="confirmEdit">Измени</button>
                </div>
            </form>
            </div>
        </div>`;
    document.body.appendChild(popup);
    const confirmEdit = document.getElementById("confirmEdit");
    const cancelEdit = document.getElementById("cancelEdit");

    confirmEdit.onclick = editAuthor;
    cancelEdit.onclick = () => {
        const editPopup = document.getElementById("editPopup");
        editPopup.classList.remove("show");
    }
}

function deleteLogic(){
    const selected = document.querySelector(".item.selected");
    if (!selected) {
        showToast("Молимо изаберите аутора за брисање.");
        return;
    }
    deletePopup.classList.add("show");
}

async function deleteAuthor() {
    const selected = document.querySelector(".item.selected");
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

function editLogic(){
    const selected = document.querySelector(".item.selected");
    if (!selected) {
        showToast("Молимо изаберите аутора за измену.");
        return; 
    }
    fillEdit(selected);
    editPopup.classList.add("show");
}

async function fillEdit(selected){
    const authorId = selected.querySelector(".item-element:nth-child(1) p").textContent;
    const docSnap = await getDoc(doc(db, "autori", authorId));
    const data = docSnap.data();
    const popup = document.getElementById("editPopup")
    console.log(data);
    editPopup.querySelector('[name="ime"]').value = data.ime;
    editPopup.querySelector('[name="prezime"]').value = data.prezime;
    editPopup.querySelector('[name="datum"]').value = data.datumRodjenja;
    editPopup.querySelector('[name="status"]').value = data.status;
    editPopup.querySelector('[name="prodato"]').value = data.brojProdatihPrimeraka;
    editPopup.querySelector('[name="nagrade"]').value = data.brojOsvojenihNagrada;
    editPopup.querySelector('[name="menadzer"]').value = data.kontaktTelefonMenadzera;
    editPopup.querySelector('[name="biografija"]').textContent = data.biografija;
    editPopup.querySelector('[name="slike"]').textContent = data.slike.join("\n");
    
}

async function addAuthor() {
    console.log("added");
    //TODO
}

async function editAuthor() {
    console.log("added");
    //TODO
}

function main(){
    addDelete();
    addAdd();
    addEdit();
    const deletePopup = document.getElementById("deletePopup");
    const addPopup = document.getElementById("addPopup");
    const editPopup = document.getElementById("editPopup");
    const openDelete = document.getElementById("openDelete");
    const openEdit = document.getElementById("openEdit");
    const openAdd = document.getElementById("openAdd");

    openDelete.onclick = deleteLogic;
    openEdit.onclick = editLogic;
    openAdd.onclick = () => {
        addPopup.classList.add("show");
    };
}

await loadAuthors();
main();
document.getElementById("pretraga").addEventListener("keyup", search);