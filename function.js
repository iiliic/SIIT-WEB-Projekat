const login = document.getElementById("login");
const openLogin = document.getElementById("openLogin");
const closeLogin = document.getElementById("closeLogin");
const openSignin = document.getElementById("openSignin");
const closeSignin = document.getElementById("closeSignin");

openLogin.onclick = () => {
  login.classList.add("show");
};

closeLogin.onclick = () => {
  login.classList.remove("show");
};

openSignin.onclick = () => {
  signin.classList.add("show");
};

closeSignin.onclick = () => {
  signin.classList.remove("show");
};

function goToListaKnjiga() {
  window.location.href = "lista-knjiga.html";
}

function goToBook() {
  window.location.href = "knjiga.html"
}

function goToAutor() {
  window.location.href = "author.html";
}



var items = document.querySelectorAll(".item");

function handleClick(event) {
  var clickedItem = event.target;

  removeSelection();

  clickedItem.classList.add("selected");
}

function removeSelection() {
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("selected");
  }
}

function init() {
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", handleClick);
  }
}

init();