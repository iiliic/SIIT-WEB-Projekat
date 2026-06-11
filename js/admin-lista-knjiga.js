import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
 
// ---- SELEKCIJA REDA ----
function handleClick(event, knjiga) {
    removeSelection();
    event.currentTarget.classList.add("selected");
    selectedKnjiga = knjiga;
}
 
function removeSelection() {
    document.querySelectorAll(".table-row").forEach(row => row.classList.remove("selected"));
}
 
// ---- UCITAVANJE KNJIGA ----
async function loadKnjige() {
    const container = id("tableBody");
    const snapshot = await getDocs(collection(db, "knjige"));
    snapshot.forEach((doc) => {
        const knjiga = { id: doc.id, ...doc.data() };
        const row = createRow(knjiga);
        container.appendChild(row);
    });
}
 
function createRow(knjiga) {
    const row = document.createElement("div");
    row.classList.add("table-row");
    row.addEventListener("click", (e) => handleClick(e, knjiga));
    row.innerHTML =
        `<div class="table-element"><p class="text">${knjiga.naziv}</p></div>
        <div class="table-element"><p class="text">${knjiga.zanr}</p></div>
        <div class="table-element"><p class="text">${knjiga.format}</p></div>
        <div class="table-element"><p class="text">${knjiga.cena} RSD</p></div>
        <div class="table-element"><p class="text">${knjiga.brojStrana}</p></div>
        <div class="table-element"><p class="text">${knjiga.idAutora}</p></div>
        <div class="table-element"><p class="text">${knjiga.isbn}</p></div>`;
    return row;
}
 
// ---- PRETRAGA ----
function pretraziKnjige() {
    const query = id("pretraga").value.trim().toLowerCase();
    document.querySelectorAll(".table-row").forEach(row => {
        const naziv = row.querySelector(".table-element p").textContent.toLowerCase();
        row.style.display = naziv.includes(query) ? "grid" : "none";
    });
}
 
id("pretraga").addEventListener("keyup", pretraziKnjige);

// ---- TRENUTNO SELEKTOVANA KNJIGA ----
let selectedKnjiga = null;
 
// ---- REGEX PRAVILA ----
const REGEX = {
    naziv:    /^.{2,100}$/,
    cena:     /^\d{1,7}(\.\d{1,2})?$/,
    strane:   /^\d{1,5}$/,
    idAutora: /^[a-zA-Z0-9_-]{1,50}$/,
    isbn:     /^978-\d{10}$/
};
 
const PORUKE = {
    naziv:    "Назив мора имати 2–100 знакова.",
    cena:     "Цена мора бити позитиван број.",
    strane:   "Број страна мора бити цео број.",
    idAutora: "ИД аутора може садржати само слова и бројеве (aut001)",
    isbn:     "ISBN мора бити у формату 978-XX XX XX XX XX."
};
 
// ---- VALIDACIJA ----
function validateField(inputEl, errorEl, regex, poruka) {
    const val = inputEl.value.trim();
    if (!val || !regex.test(val)) {
        errorEl.textContent = poruka;
        inputEl.classList.add("input-error");
        return false;
    }
    errorEl.textContent = "";
    inputEl.classList.remove("input-error");
    return true;
}
 
function validateSelect(selectEl, errorEl) {
    if (!selectEl.value) {
        errorEl.textContent = "Молимо одаберите вредност.";
        selectEl.classList.add("input-error");
        return false;
    }
    errorEl.textContent = "";
    selectEl.classList.remove("input-error");
    return true;
}
 
function validateForma(prefix) {
    const p = prefix;
    let ok = true;
    ok = validateField(id(p+"-naziv"),    id("err-"+p+"-naziv"),    REGEX.naziv,    PORUKE.naziv)    && ok;
    ok = validateSelect(id(p+"-zanr"),    id("err-"+p+"-zanr"))                                      && ok;
    ok = validateSelect(id(p+"-format"),  id("err-"+p+"-format"))                                    && ok;
    ok = validateField(id(p+"-cena"),     id("err-"+p+"-cena"),     REGEX.cena,     PORUKE.cena)     && ok;
    ok = validateField(id(p+"-strane"),   id("err-"+p+"-strane"),   REGEX.strane,   PORUKE.strane)   && ok;
    ok = validateField(id(p+"-idautora"), id("err-"+p+"-idautora"), REGEX.idAutora, PORUKE.idAutora) && ok;
    ok = validateField(id(p+"-isbn"),     id("err-"+p+"-isbn"),     REGEX.isbn,     PORUKE.isbn)     && ok;
    return ok;
}
 
function id(s) { return document.getElementById(s); }
 
// ---- MODAL KONTROLA ----
function openModal(modalId) {
    id(modalId).classList.add("modal-show");
}
 
function closeModal(modalId) {
    id(modalId).classList.remove("modal-show");
}
 
document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.modal));
});
 
// ---- DUGMAD U SIDEBARU ----
id("btn-dodaj").addEventListener("click", () => {
    id("forma-dodaj").reset();
    document.querySelectorAll("#modal-dodaj .field-error").forEach(el => el.textContent = "");
    document.querySelectorAll("#modal-dodaj .input-error").forEach(el => el.classList.remove("input-error"));
    openModal("modal-dodaj");
});
 
id("btn-izmeni").addEventListener("click", () => {
    if (!selectedKnjiga) {
        showToast("Прво означите књигу у табели.");
        return;
    }
    popuniFormuIzmeni(selectedKnjiga);
    openModal("modal-izmeni");
});
 
id("btn-obrisi").addEventListener("click", () => {
    if (!selectedKnjiga) {
        showToast("Прво означите књигу у табели.");
        return;
    }
    id("obrisi-naziv").textContent = selectedKnjiga.naziv;
    openModal("modal-obrisi");
});
 
// ---- POPUNI FORMU IZMENI ----
function popuniFormuIzmeni(knjiga) {
    id("i-naziv").value    = knjiga.naziv    ?? "";
    id("i-cena").value     = knjiga.cena     ?? "";
    id("i-strane").value   = knjiga.brojStrana ?? "";
    id("i-idautora").value = knjiga.idAutora ?? "";
    id("i-isbn").value     = knjiga.isbn     ?? "";
    id("i-opis").value = knjiga.opis ?? "";
    id("i-slika").value = knjiga.slike?.[0] ?? "";
    setSelectValue("i-zanr",   knjiga.zanr);
    setSelectValue("i-format", knjiga.format);
    document.querySelectorAll("#modal-izmeni .field-error").forEach(el => el.textContent = "");
    document.querySelectorAll("#modal-izmeni .input-error").forEach(el => el.classList.remove("input-error"));
}
 
function setSelectValue(selectId, value) {
    const sel = id(selectId);
    for (let opt of sel.options) {
        if (opt.value === value) { sel.value = value; return; }
    }
    sel.value = "";
}
 
//  SUBMIT: DODAJ 
id("forma-dodaj").addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForma("d")) return;
    // baza upis
    await addDoc(collection(db, "knjige"), {
        naziv:     id("d-naziv").value.trim(),
        zanr:      id("d-zanr").value,
        format:    id("d-format").value,
        cena:      parseFloat(id("d-cena").value),
        brojStrana: parseInt(id("d-strane").value),
        idAutora:  id("d-idautora").value.trim(),
        isbn:      id("d-isbn").value.trim(),
        opis: id("d-opis").value.trim(),
        slike:     [id("d-slika").value.trim()]
    });
    showToast("Књига је успешно додата.");
    closeModal("modal-dodaj");
    location.reload();
});
 
//  SUBMIT: IZMENI 
id("forma-izmeni").addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForma("i")) return;
    // baza izmena
    const docRef = doc(db, "knjige", selectedKnjiga.id);
    await updateDoc(docRef, {
        naziv:     id("i-naziv").value.trim(),
        zanr:      id("i-zanr").value,
        format:    id("i-format").value,
        cena:      parseFloat(id("i-cena").value),
        brojStrana: parseInt(id("i-strane").value),
        idAutora:  id("i-idautora").value.trim(),
        isbn:      id("i-isbn").value.trim(),
        opis: id("i-opis").value.trim(),
        slike:     id("i-slika").value.trim().split(",")
    });

    showToast("Књига је успешно измењена.");
    closeModal("modal-izmeni");
    location.reload();
});
 
//  POTVRDI BRISANJE 
id("btn-potvrdi-brisanje").addEventListener("click", async () => {
    // baza brisanje
    await deleteDoc(doc(db, "knjige", selectedKnjiga.id));
    showToast(`Брисање: "${selectedKnjiga.naziv}" је успешно.`);
    closeModal("modal-obrisi");
    selectedKnjiga = null;
    removeSelection();
    location.reload();
});
 
loadKnjige();