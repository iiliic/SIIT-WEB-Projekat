import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getFirestore, collection, getDoc, getDocs, doc, query, where, addDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
        showToast("Попуните сва поља");
        return;
    }

    const answer = await checkLogin(username, password);

    if (!answer) {
        showToast("Погрешно корисничко име или лозинка");
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
                <div class="inline">
                    <div class="label-above-input">
                        <label for="signin-ime" class="text">Корисничко име:</label>
                        <input type="text" id="signin-ime" name="username" class="input-style"><br>
                    </div>
                    <div class="label-above-input">
                        <label for="signin-lozinka" class="text">Лозинка:</label>
                        <input type="password" id="signin-lozinka" name="password" class="input-style"><br>
                    </div>
                </div><br>
                <p class="text"> Информације: </p><br>
                <div class="inline">
                    <div class="label-above-input">
                        <label for="ime" class="text">Име:</label>
                        <input type="text" id="ime" name="ime" class="input-style"><br>
                    </div>
                    <div class="label-above-input">
                        <label for="prezime" class="text">Презиме:</label>
                        <input type="text" id="prezime" name="prezime" class="input-style"><br>
                    </div>
                    <div class="label-above-input">
                        <label for="datum" class="text">Датум Рођења:</label>
                        <input type="text" id="datum" name="datum" class="input-style"><br>
                    </div>
                </div>
                <div class="inline">
                    <div class="label-above-input">
                        <label for="adresa" class="text">Адреса:</label>
                        <input type="text" id="adresa" name="adresa" class="input-style"><br>
                    </div>
                    <div class="label-above-input">
                        <label for="email" class="text">Имејл:</label>
                        <input type="text" id="email" name="email" class="input-style"><br>
                    </div>
                    <div class="label-above-input">
                        <label for="zanimanje" class="text">Занимање:</label>
                        <input type="text" id="zanimanje" name="zanimanje" class="input-style"><br>
                    </div>
                </div>
                <div class="popup-button-container">
                    <button type="submit" class="button-style">Региструј се</button>
                </div>
            </form>
            </div>
        </div>
    </div>`;
}

async function checkSignin(korisnickoIme) {
    const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", korisnickoIme));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return true;
    }

    return false;
}

async function signinValidation(e){
    e.preventDefault();

    const username = document.getElementById("signin-ime").value.trim();
    const password = document.getElementById("signin-lozinka").value.trim();

    if (!username || !password) {
        showToast("Попуните сва битна поља (Корисничко име и лозинка).");
        return;
    }

    const answer = await checkSignin(username);

    if (!answer) {
        showToast("Корисничко име је заузето.");
        return;
    }

    const data = infoValidation(username,password);
    if(data){
        console.log(data);
        await addDoc(collection(db, "korisnici"), data);
        sessionStorage.setItem("username", username);
        location.reload();
    }
}

function infoValidation(username,password){
    const form = document.getElementById("signinForm")
    const ime = form.querySelector('[name="ime"]').value;
    const prezime = form.querySelector('[name="prezime"]').value;
    const datum = form.querySelector('[name="datum"]').value;
    const adresa = form.querySelector('[name="adresa"]').value;
    const email = form.querySelector('[name="email"]').value;
    const zanimanje = form.querySelector('[name="zanimanje"]').value;

    console.log(datum);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (datum!="" && !dateRegex.test(datum)) {
        showToast("Aко сте унели датум рођења, унесите прави формат (ГГГГ-ММ-ДД).");
        return null;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (email!="" && !emailRegex.test(email)) {
        showToast("Aко сте унели емаил, унесите га правилно.");
        return null;
    }

    const data ={
        ime:ime,
        prezime:prezime,
        datumRodjenja:datum,
        email:email,
        zanimanje:zanimanje,
        adresa:adresa,
        korisnickoIme:username,
        lozinka:password
    };

    return data;
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

export function showToast(message) {
    console.log(message)
    const toast = document.createElement("div");

    toast.classList.add("toast");
    toast.innerHTML=
    `<p class="text">${message}
    `;

    document.body.appendChild(toast);

    setTimeout(() => {toast.classList.add("show")},100);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
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

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", loginValidation);
    const signinForm = document.getElementById("signinForm");
    signinForm.addEventListener("submit", signinValidation);
  }

  const logo = document.getElementById("logo");
  logo.onclick = () => goToListaKnjiga();

    const hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    hamburger.innerHTML = `<span></span><span></span><span></span>`;

    hamburger.onclick = () => {
    document.querySelector(".sidebar").classList.toggle("open");
    };
    document.querySelector(".logo-container").before(hamburger);

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 875) {
            document.querySelector(".logo").src = "../content/minilogo.png";
        }
        else{
            document.querySelector(".logo").src = "../content/Logo.png";
        }
    });
}

main();