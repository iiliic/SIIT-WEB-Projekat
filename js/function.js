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


function addLogin() {
  const header= document.getElementById("header-right");
  const button = document.createElement("button");
  button.id = "openLogin";
  button.className = "button-style";
  button.textContent = "Пријави се";
  header.appendChild(button);

  document.body.innerHTML +=
    `<div class="login" id="login">
        <div class="popup-content-position">
            <div class="popup-header">
                <p class="text huge">Пријава</p>
                <button id="closeLogin" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="loginForm">
                <div class="label-above-input">
                    <label for="login-ime" class="text">Име:</label>
                    <input type="text" id="login-ime" name="ime" class="input-style"><br>
                </div>
                <div class="label-above-input">
                    <label for="login-lozinka" class="text">Лозинка:</label>
                    <input type="password" id="login-lozinka" name="lozinka" class="input-style"><br>
                </div>
                <div class="popup-button-container">
                    <button type="submit" class="button-style">Пријави се</button>
                </div>
            </form>
            </div>
        </div>
    </div>`;
}  

async function checkLogin(korisnickoIme, password) {

    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", korisnickoIme));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return false;
    }

    const doc = snapshot.docs[0];
    const user = doc.data();

    return user.lozinka === password;
}

async function loginValidation(e) {
    e.preventDefault();

    const username = document.getElementById("login-ime").value.trim();
    const password = document.getElementById("login-lozinka").value.trim();

    if (!username || !password) {
        alert("Popuni sva polja");
        return;
    }

    const answer = await checkLogin(username, password);

    if (!answer) {
        alert("Pogrešno korisničko ime ili lozinka");
        return;
    }

    // LOGIN SUCCESS
    sessionStorage.setItem("username", username);
    location.reload();
}

function addSignin() {
  const header= document.getElementById("header-right");
  const button = document.createElement("button");
  button.id = "openSignin";
  button.className = "button-style";
  button.textContent = "Региструј се";
  header.appendChild(button);

  document.body.innerHTML +=
    `<div class="signin" id="signin">
        <div class="popup-content-position">
            <div class="popup-header">
                <p class="text huge">Регистрација</p>
                <button id="closeSignin" class="button-style">X</button>
            </div>
            <div class="popup-content">
            <form id="signinForm">
                <div class="label-above-input">
                    <label for="signin-ime" class="text">Име:</label>
                    <input type="text" id="signin-ime" name="ime" class="input-style"><br>
                </div>
                <div class="label-above-input">
                    <label for="signin-lozinka" class="text">Лозинка:</label>
                    <input type="password" id="signin-lozinka" name="lozinka" class="input-style"><br>
                </div>
                <div class="popup-button-container">
                    <button type="submit" class="button-style">Региструј се</button>
                </div>
            </form>
            </div>
        </div>
    </div>`;
}

function addSignout(){
  const header= document.getElementById("header-right");
  const button = document.createElement("button");
  button.id = "openSignout";
  button.className = "button-style";
  button.textContent = "Одјави се";
  header.appendChild(button);

  document.body.innerHTML +=
    `<div class="signout" id="signout">
        <div class="popup-content-position">
            <div class="popup-content">
                <p class="text big">Да ли сте сигурни да желите да се одјавите?</p>
                <div class="popup-button-container">
                    <button type="submit" class="button-style" id="confirmSignout">Да</button>
                    <button type="submit" class="button-style" id="cancelSignout">Не</button>
                </div>
            </div>
        </div>
    </div>`;
}

export function goToListaKnjiga() {
  window.location.href = "lista-knjiga.html";
}

export function goToBook(bookId) {
  window.location.href = `knjiga.html?id=${bookId}`;
}

export function goToAuthor(authorId) {
  window.location.href = `author.html?id=${authorId}`;
}

function main(){
  if (sessionStorage.getItem("username")) {
    addSignout();

    const opensignout = document.getElementById("openSignout");
    const confirmsignout = document.getElementById("confirmSignout");
    const cancelsignout = document.getElementById("cancelSignout");

    opensignout.onclick = () => {
      signout.classList.add("show");
    }

    cancelsignout.onclick = () => {
      signout.classList.remove("show");
    }

    confirmsignout.onclick = () => {
      sessionStorage.removeItem("username");
      signout.classList.remove("show");
      location.reload();
    }
  } 
  else {
    addLogin();
    addSignin();

    const login = document.getElementById("login");
    const signin = document.getElementById("signin");
    const openLogin = document.getElementById("openLogin");
    const closeLogin = document.getElementById("closeLogin");
    const openSignin = document.getElementById("openSignin");
    const closeSignin = document.getElementById("closeSignin");

    openLogin.onclick = () => {
      login.classList.add("show");
    };

    openSignin.onclick = () => {
      signin.classList.add("show");
    };

    closeLogin.onclick = () => {
      login.classList.remove("show");
    };

    closeSignin.onclick = () => {
      signin.classList.remove("show");
    };

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", loginValidation);
  }

  const logo = document.getElementById("logo-container");
  logo.onclick = () => goToListaKnjiga();

}

main();