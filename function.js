import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
            <form action="#" method="post">
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
            <form action="#" method="post">
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

function goToListaKnjiga() {
  window.location.href = "lista-knjiga.html";
}

function goToBook() {
  window.location.href = "knjiga.html"
}

function goToAutor(authorId) {
  window.location.href = `author.html?id=${authorId}`;
}

function main(){
  if (sessionStorage.getItem("loginId")) {
    console.log("loginId exists:", sessionStorage.getItem("loginId"));
  } 
  else {
    console.log("no loginId found");
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
  }
}

main();