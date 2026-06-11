import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, deleteDoc, updateDoc, addDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
        item.style.display = naziv.includes(query) ? "grid" : "none";
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
                <p class="text big">Додавање Аутора</p>
                <button id="cancelAdd" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="addForm">
                <div class="fields">
                    <div class="label-above-input">
                        <label for="ime" class="text">Име:</label>
                        <input type="text" id="ime" name="ime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prezime" class="text">Презиме:</label>
                        <input type="text" id="prezime" name="prezime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="menadzer" class="text">Број Менаџера:</label>
                        <input type="text" id="menadzer" name="menadzer" class="input-style">
                    </div>
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
                <p class="text">Статус:</p>
                <div class="checkboxes">
                        <div>
                        <input type="radio" id="status-aktivan" name="status" value="Активан">
                        <label for="status-aktivan" class="text">Активан</label>
                        </div>
                        <div>
                        <input type="radio" id="status-u-penziji" name="status" value="У пензији">
                        <label for="status-u-penziji" class="text">У пензији</label>
                        </div>
                        <div>
                        <input type="radio" id="status-preminuo" name="status" value="Преминуо">
                        <label for="status-preminuo" class="text">Преминуо</label>
                        </div>
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
                    <button action="submit" class="button-style" id="confirmAdd">Додај</button>
                </div>
            </form>
            </div>
        </div>`;
    document.body.appendChild(popup);
    const confirmAdd = document.getElementById("confirmAdd");
    const cancelAdd = document.getElementById("cancelAdd");

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
                <p class="text big">Измена Аутора</p>
                <button id="cancelEdit" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="editForm">
                <div class="fields">
                    <div class="label-above-input">
                        <label for="ime" class="text">Име:</label>
                        <input type="text" id="ime" name="ime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="prezime" class="text">Презиме:</label>
                        <input type="text" id="prezime" name="prezime" class="input-style">
                    </div>
                    <div class="label-above-input">
                        <label for="menadzer" class="text">Број Менаџера:</label>
                        <input type="text" id="menadzer" name="menadzer" class="input-style">
                    </div>
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
                <p class="text">Статус:</p>
                <div class="checkboxes">
                        <div>
                        <input type="radio" id="status-aktivan" name="status" value="Активан">
                        <label for="status-aktivan" class="text">Активан</label>
                        </div>
                        <div>
                        <input type="radio" id="status-u-penziji" name="status" value="У пензији">
                        <label for="status-u-penziji" class="text">У пензији</label>
                        </div>
                        <div>
                        <input type="radio" id="status-preminuo" name="status" value="Преминуо">
                        <label for="status-preminuo" class="text">Преминуо</label>
                        </div>
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
    const popup = document.getElementById("editPopup");
    editPopup.querySelector('[name="ime"]').value = data.ime;
    editPopup.querySelector('[name="prezime"]').value = data.prezime;
    editPopup.querySelector('[name="datum"]').value = data.datumRodjenja;
    editPopup.querySelector('[name="prodato"]').value = data.brojProdatihPrimeraka;
    editPopup.querySelector('[name="nagrade"]').value = data.brojOsvojenihNagrada;
    editPopup.querySelector('[name="menadzer"]').value = data.kontaktTelefonMenadzera;
    editPopup.querySelector(`input[name="status"][value="${data.status}"]`).checked=true;
    editPopup.querySelector('[name="biografija"]').value = data.biografija;
    editPopup.querySelector('[name="slike"]').value = data.slike.join("\n");

    
}


async function validation(form) {

    const ime = form.querySelector('[name="ime"]').value;
    const prezime = form.querySelector('[name="prezime"]').value;
    const datum = form.querySelector('[name="datum"]').value;
    const prodato = form.querySelector('[name="prodato"]').value;
    const nagrade = form.querySelector('[name="nagrade"]').value;
    const menadzer = form.querySelector('[name="menadzer"]').value;
    const statusEl = form.querySelector('input[name="status"]:checked');
    let status = null;
    if (statusEl != null){
        status=statusEl.value;
    }
    const biografija = form.querySelector('[name="biografija"]').value;
    const slike = form.querySelector('[name="slike"]').value.split("\n");

    if(ime==="" || prezime==="" || datum===""|| !status || biografija===""|| prodato==="" ||nagrade===""){
        showToast("Nisu unete sve informacije.");
        return null;
    }

    const phoneRegex = /^\+381\s\d{2}\s\d{6,7}$/;
    const clean = menadzer.replace(/-/g, "");
    if (!phoneRegex.test(clean)) {
        showToast("Број телефона менаџера није важећи.");
        return null;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(datum)) {
        showToast("Унет датум није правог формата (ГГГГ-ММ-ДД).");
        return null;
    }

    if(prodato < 0){
        showToast("Број продатих књига мора бити 0 или више.");
        return null;
    }

    if(nagrade < 0){
        showToast("Број освојених награда мора бити 0 или више.");
        return null;
    }
    if(!await(allImageUrls(slike))){
        showToast("Неки од линкова за слике не воде до слика.");
        return null;
    }

    const data={
        ime:ime,
        prezime:prezime,
        datumRodjenja:datum,
        kontaktTelefonMenadzera:menadzer,
        brojOsvojenihNagrada:parseInt(nagrade,10),
        brojProdatihPrimeraka:parseInt(prodato,10),
        biografija:biografija,
        status:status,
        slike:slike
    };
    console.log(data);
    return data;
}

function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    } 
    catch {
        return false;
    }
}
function isImageUrl(url) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);

        img.src = url;
    });
}
async function validateImageUrl(str) {
    if (!isValidUrl(str)) {
        return false;
    }
    return await isImageUrl(str);
}

async function allImageUrls(urls) {
    for (const url of urls) {
        console.log(url);
        const valid = await isImageUrl(url);

        if (!valid) {
            return false;
        }
    }
    return true;
}

async function addAuthor(e) {
    e.preventDefault();
    const data = await validation(e.currentTarget);
    if (data){
        await addDoc(collection(db, "autori"), data);
        location.reload();
    }
}

async function editAuthor(e) {
    e.preventDefault();
    const data = await validation(e.currentTarget);
    if (data){
        const selected = document.querySelector(".item.selected");
        const authorId = selected.querySelector(".item-element:nth-child(1) p").textContent;
        const ref = doc(db, "autori", authorId);
        await updateDoc(ref,data);
        location.reload();
    }
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

    const addForm = document.getElementById("addForm");
    const editForm = document.getElementById("editForm");

    console.log(addForm);
    addForm.addEventListener("submit", addAuthor);
    editForm.addEventListener("submit", editAuthor);
}

await loadAuthors();
main();
document.getElementById("pretraga").addEventListener("keyup", search);