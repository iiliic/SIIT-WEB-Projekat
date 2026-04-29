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

